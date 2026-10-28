import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

const updateProfileSchema = z.object({
  phone: z.string().optional(),
  bloodGroup: z.string().optional(),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.studentProfile.findFirst({
      where: session.role === Role.STUDENT ? { userId: session.userId } : { user: { identifier: "URK25CS6015" } },
      include: {
        user: true,
        mentor: { include: { user: true } },
        currentHostel: { include: { warden: { include: { user: true } } } },
        currentWing: true,
        currentRoom: true,
        currentBed: true,
        residentialHistories: { orderBy: { checkInDate: "desc" } },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Personal details GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve personal details" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.flatten() }, { status: 400 });
    }

    const student = await prisma.studentProfile.findFirst({
      where: session.role === Role.STUDENT ? { userId: session.userId } : { user: { identifier: "URK25CS6015" } },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const {
      phone,
      bloodGroup,
      permanentAddress,
      currentAddress,
      parentName,
      parentPhone,
      emergencyContactName,
      emergencyContactPhone,
    } = result.data;

    // Update student editable fields
    const updated = await prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        bloodGroup,
        permanentAddress,
        currentAddress,
        parentName,
        parentPhone,
        emergencyContactName,
        emergencyContactPhone,
        user: phone ? { update: { phone } } : undefined,
      },
      include: { user: true },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "STUDENT_PROFILE_UPDATED",
        entityType: "StudentProfile",
        entityId: student.id,
        detailsJson: JSON.stringify({ fieldsUpdated: Object.keys(result.data) }),
      },
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error("Personal details PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

