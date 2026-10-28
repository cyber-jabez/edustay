import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { canMarkAttendance } from "@/lib/permissions/rbac";
import { HostelAttendanceStatus } from "@prisma/client";
import { z } from "zod";

const submitAttendanceSchema = z.object({
  hostelId: z.string().min(1),
  wingId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.nativeEnum(HostelAttendanceStatus),
      remarks: z.string().optional(),
    })
  ),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !canMarkAttendance(session)) {
      return NextResponse.json({ error: "Forbidden: SRA or Warden authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const hostelId = searchParams.get("hostelId");
    const wingId = searchParams.get("wingId");

    // Fetch resident students in this hostel/wing
    const students = await prisma.studentProfile.findMany({
      where: {
        currentHostelId: hostelId || undefined,
        currentWingId: wingId || undefined,
      },
      include: {
        user: { select: { fullName: true, identifier: true } },
        currentRoom: { select: { roomNumber: true } },
        currentBed: { select: { bedCode: true } },
      },
      orderBy: { currentRoom: { roomNumber: "asc" } },
    });

    const hostels = await prisma.hostel.findMany({
      include: { wings: true },
    });

    return NextResponse.json({ students, hostels });
  } catch (error) {
    console.error("Staff attendance GET error:", error);
    return NextResponse.json({ error: "Failed to load student roster" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !canMarkAttendance(session) || !session.staffProfileId) {
      return NextResponse.json({ error: "Forbidden: SRA authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const result = submitAttendanceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid attendance data", details: result.error.flatten() }, { status: 400 });
    }

    const { hostelId, wingId, date, records } = result.data;
    const sessionDate = new Date(date);

    // Save session and records transactionally
    const savedSession = await prisma.$transaction(async (tx) => {
      const attSession = await tx.hostelAttendanceSession.create({
        data: {
          hostelId,
          wingId,
          date: sessionDate,
          markedById: session.staffProfileId!,
          status: "SUBMITTED",
        },
      });

      for (const rec of records) {
        await tx.hostelAttendanceRecord.upsert({
          where: {
            sessionId_studentId: {
              sessionId: attSession.id,
              studentId: rec.studentId,
            },
          },
          create: {
            sessionId: attSession.id,
            studentId: rec.studentId,
            status: rec.status,
            remarks: rec.remarks,
          },
          update: {
            status: rec.status,
            remarks: rec.remarks,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "HOSTEL_ATTENDANCE_MARKED",
          entityType: "HostelAttendanceSession",
          entityId: attSession.id,
          detailsJson: JSON.stringify({
            hostelId,
            wingId,
            recordsCount: records.length,
          }),
        },
      });

      return attSession;
    });

    return NextResponse.json({
      success: true,
      message: `Hostel attendance marked successfully for ${records.length} residents.`,
      sessionId: savedSession.id,
    });
  } catch (error) {
    console.error("Staff attendance POST error:", error);
    return NextResponse.json({ error: "Failed to submit attendance records" }, { status: 500 });
  }
}

