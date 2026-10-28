import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Role, TargetAudience, NoticeCategory } from "@prisma/client";
import { isStaffRole } from "@/lib/permissions/rbac";
import { z } from "zod";

const noticeSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(5),
  category: z.nativeEnum(NoticeCategory).default(NoticeCategory.GENERAL),
  targetAudience: z.nativeEnum(TargetAudience).default(TargetAudience.ALL_STUDENTS),
  targetHostelId: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let whereClause: Record<string, unknown> = { isPublished: true };

    if (session.role === Role.STUDENT) {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
      });

      whereClause = {
        isPublished: true,
        OR: [
          { targetAudience: TargetAudience.ALL_STUDENTS },
          student?.currentHostelId ? { targetHostelId: student.currentHostelId } : {},
        ],
      };
    }

    const notices = await prisma.notice.findMany({
      where: whereClause,
      include: {
        author: { select: { fullName: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notices });
  } catch (error) {
    console.error("Notices GET error:", error);
    return NextResponse.json({ error: "Failed to load notices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isStaffRole(session.role)) {
      return NextResponse.json({ error: "Forbidden: Staff authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const result = noticeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid notice data", details: result.error.flatten() }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        ...result.data,
        authorId: session.userId,
      },
      include: { author: { select: { fullName: true } } },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "NOTICE_PUBLISHED",
        entityType: "Notice",
        entityId: notice.id,
        detailsJson: JSON.stringify({ title: notice.title, audience: notice.targetAudience }),
      },
    });

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    console.error("Notices POST error:", error);
    return NextResponse.json({ error: "Failed to publish notice" }, { status: 500 });
  }
}

