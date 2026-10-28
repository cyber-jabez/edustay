import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Role, OutpassStatus, OutpassDecision } from "@prisma/client";
import { z } from "zod";

const outpassSubmitSchema = z.object({
  formTypeCode: z.enum(["YELLOW", "GREEN", "WHITE"]),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  destination: z.string().min(3, "Destination is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  expectedReturnTime: z.string().min(1, "Expected return time is required"),
  contactPhone: z.string().min(10, "Valid contact number required"),
  parentConsentGiven: z.boolean().default(true),
  emergencyContact: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // e.g. "pending", "all"

    // If student, return own outpasses
    if (session.role === Role.STUDENT) {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
      });

      if (!student) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }

      const outpasses = await prisma.outpassRequest.findMany({
        where: { studentId: student.id },
        include: {
          formType: true,
          mentor: { include: { user: { select: { fullName: true } } } },
          sra: { include: { user: { select: { fullName: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });

      const formTypes = await prisma.outpassFormType.findMany({ where: { isActive: true } });

      return NextResponse.json({ outpasses, formTypes });
    }

    // If staff (Mentor, SRA, Warden, Admin), return outpasses in their jurisdiction
    let whereClause: Record<string, unknown> = {};

    if (session.role === Role.MENTOR) {
      whereClause = { mentorId: session.staffProfileId };
    } else if (session.role === Role.SRA) {
      whereClause = { sraId: session.staffProfileId };
    }

    if (filter === "pending") {
      if (session.role === Role.MENTOR) {
        whereClause.mentorDecision = OutpassDecision.PENDING;
      } else if (session.role === Role.SRA) {
        whereClause.sraDecision = OutpassDecision.PENDING;
      }
    }

    const outpasses = await prisma.outpassRequest.findMany({
      where: whereClause,
      include: {
        formType: true,
        student: {
          include: {
            user: { select: { fullName: true, identifier: true, email: true, phone: true } },
            currentHostel: { select: { name: true } },
            currentWing: { select: { name: true } },
            currentRoom: { select: { roomNumber: true } },
          },
        },
        mentor: { include: { user: { select: { fullName: true } } } },
        sra: { include: { user: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formTypes = await prisma.outpassFormType.findMany({ where: { isActive: true } });

    return NextResponse.json({ outpasses, formTypes });
  } catch (error) {
    console.error("Outpass GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve outpasses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== Role.STUDENT) {
      return NextResponse.json({ error: "Only registered students can apply for an outpass" }, { status: 403 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
      include: { mentor: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = outpassSubmitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid form parameters", details: result.error.flatten() }, { status: 400 });
    }

    const {
      formTypeCode,
      reason,
      destination,
      departureTime,
      expectedReturnTime,
      contactPhone,
      parentConsentGiven,
      emergencyContact,
    } = result.data;

    // Retrieve form type
    const formType = await prisma.outpassFormType.findUnique({
      where: { code: formTypeCode },
    });

    if (!formType || !formType.isActive) {
      return NextResponse.json({ error: "Selected outpass form type is unavailable or inactive" }, { status: 400 });
    }

    // Determine assigned SRA from student's hostel & wing
    const sraAssignment = await prisma.staffScopeAssignment.findFirst({
      where: {
        hostelId: student.currentHostelId || undefined,
        wingId: student.currentWingId || undefined,
        role: Role.SRA,
      },
    });

    const outpassNumber = `OUT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const outpass = await prisma.$transaction(async (tx) => {
      const created = await tx.outpassRequest.create({
        data: {
          outpassNumber,
          studentId: student.id,
          formTypeId: formType.id,
          reason,
          destination,
          departureTime: new Date(departureTime),
          expectedReturnTime: new Date(expectedReturnTime),
          contactPhone,
          parentConsentGiven,
          emergencyContact,
          status: OutpassStatus.SUBMITTED,
          mentorDecision: OutpassDecision.PENDING,
          mentorId: student.mentorId,
          sraDecision: OutpassDecision.PENDING,
          sraId: sraAssignment?.staffId,
          policyVersion: formType.policyVersion,
        },
        include: {
          formType: true,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "OUTPASS_SUBMITTED",
          entityType: "OutpassRequest",
          entityId: created.id,
          detailsJson: JSON.stringify({ outpassNumber, formTypeCode, destination }),
        },
      });

      // In-app notification to Mentor
      if (student.mentor) {
        await tx.notification.create({
          data: {
            userId: student.mentor.userId,
            title: `New Outpass Application: ${outpassNumber}`,
            message: `${session.fullName} (${session.identifier}) submitted a ${formType.name} to ${destination}. Review pending.`,
            type: "INFO",
            link: "/staff/outpass",
          },
        });
      }

      return created;
    });

    return NextResponse.json({
      success: true,
      message: "Outpass application submitted successfully and routed for dual Mentor and SRA authorization.",
      outpass,
    });
  } catch (error) {
    console.error("Outpass POST error:", error);
    return NextResponse.json({ error: "Failed to submit outpass request" }, { status: 500 });
  }
}

