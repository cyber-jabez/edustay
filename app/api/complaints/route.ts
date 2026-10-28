import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Role, ComplaintStatus, ComplaintPriority } from "@prisma/client";
import { isStaffRole } from "@/lib/permissions/rbac";
import { z } from "zod";

const complaintSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be detailed"),
  priority: z.nativeEnum(ComplaintPriority).default(ComplaintPriority.MEDIUM),
});

const updateComplaintSchema = z.object({
  complaintId: z.string().min(1),
  status: z.nativeEnum(ComplaintStatus),
  resolutionNotes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    // If student, return only their own complaints
    if (session.role === Role.STUDENT) {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
      });

      if (!student) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }

      const complaints = await prisma.complaint.findMany({
        where: {
          studentId: student.id,
          status: statusFilter ? (statusFilter as ComplaintStatus) : undefined,
        },
        include: {
          hostel: { select: { name: true } },
          room: { select: { roomNumber: true } },
          assignedStaff: { include: { user: { select: { fullName: true } } } },
          comments: {
            include: { author: { select: { fullName: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ complaints });
    }

    // If staff, return complaints in their hostel/wing jurisdiction
    const complaints = await prisma.complaint.findMany({
      where: {
        status: statusFilter ? (statusFilter as ComplaintStatus) : undefined,
      },
      include: {
        student: {
          include: {
            user: { select: { fullName: true, identifier: true, phone: true } },
          },
        },
        hostel: { select: { name: true } },
        room: { select: { roomNumber: true } },
        assignedStaff: { include: { user: { select: { fullName: true } } } },
        comments: {
          include: { author: { select: { fullName: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error("Complaints GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve complaints" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== Role.STUDENT) {
      return NextResponse.json({ error: "Only students can file maintenance tickets" }, { status: 403 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!student || !student.currentHostelId) {
      return NextResponse.json({ error: "No active hostel residence allocation found" }, { status: 400 });
    }

    const body = await req.json();
    const result = complaintSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid complaint data", details: result.error.flatten() }, { status: 400 });
    }

    const { category, title, description, priority } = result.data;
    const ticketNumber = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const complaint = await prisma.$transaction(async (tx) => {
      const created = await tx.complaint.create({
        data: {
          ticketNumber,
          studentId: student.id,
          hostelId: student.currentHostelId!,
          roomId: student.currentRoomId,
          category,
          title,
          description,
          priority,
          status: ComplaintStatus.SUBMITTED,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "COMPLAINT_CREATED",
          entityType: "Complaint",
          entityId: created.id,
          detailsJson: JSON.stringify({ ticketNumber, category, priority }),
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      message: `Complaint ticket ${ticketNumber} submitted successfully.`,
      complaint,
    });
  } catch (error) {
    console.error("Complaints POST error:", error);
    return NextResponse.json({ error: "Failed to submit complaint" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isStaffRole(session.role)) {
      return NextResponse.json({ error: "Forbidden: Staff authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateComplaintSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.flatten() }, { status: 400 });
    }

    const { complaintId, status, resolutionNotes } = result.data;

    const updated = await prisma.$transaction(async (tx) => {
      const comp = await tx.complaint.update({
        where: { id: complaintId },
        data: {
          status,
          resolutionNotes,
          resolvedAt: status === "RESOLVED" || status === "CLOSED" ? new Date() : undefined,
          assignedStaffId: session.staffProfileId,
        },
        include: { student: true },
      });

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "COMPLAINT_STATUS_UPDATED",
          entityType: "Complaint",
          entityId: comp.id,
          detailsJson: JSON.stringify({ status, resolutionNotes }),
        },
      });

      await tx.notification.create({
        data: {
          userId: comp.student.userId,
          title: `Complaint Updated: ${comp.ticketNumber}`,
          message: `Your complaint is now marked as ${status}. ${resolutionNotes ? `Notes: ${resolutionNotes}` : ""}`,
          type: status === "RESOLVED" ? "SUCCESS" : "INFO",
          link: "/student/complaints",
        },
      });

      return comp;
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error("Complaints PUT error:", error);
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
  }
}

