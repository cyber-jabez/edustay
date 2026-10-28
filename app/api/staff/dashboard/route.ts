import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { isStaffRole } from "@/lib/permissions/rbac";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !isStaffRole(session.role)) {
      return NextResponse.json({ error: "Unauthorized staff access" }, { status: 403 });
    }

    const [
      totalStudents,
      totalHostels,
      totalRooms,
      totalBeds,
      occupiedBeds,
      pendingOutpasses,
      unresolvedComplaints,
      recentAudits,
    ] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.hostel.count(),
      prisma.room.count(),
      prisma.bed.count(),
      prisma.bed.count({ where: { isOccupied: true } }),
      prisma.outpassRequest.count({
        where: {
          status: { in: ["SUBMITTED", "PENDING_MENTOR", "PENDING_SRA", "PENDING_BOTH"] },
        },
      }),
      prisma.complaint.count({
        where: { status: { in: ["SUBMITTED", "ACKNOWLEDGED", "IN_PROGRESS", "ASSIGNED"] } },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { fullName: true, role: true } } },
      }),
    ]);

    // Role-specific stats
    let roleMetrics: Record<string, unknown> = {};

    if (session.role === Role.MENTOR) {
      const mentees = await prisma.studentProfile.findMany({
        where: { mentorId: session.staffProfileId },
        include: { user: true, currentHostel: true },
      });
      const pendingMentorOutpasses = await prisma.outpassRequest.count({
        where: { mentorId: session.staffProfileId, mentorDecision: "PENDING" },
      });
      roleMetrics = {
        menteesCount: mentees.length,
        pendingReviewCount: pendingMentorOutpasses,
        menteesList: mentees.map((m) => ({
          id: m.id,
          name: m.user.fullName,
          identifier: m.user.identifier,
          cgpa: m.cgpa,
          attendancePct: m.classAttendancePct,
          hostel: m.currentHostel?.name || "N/A",
        })),
      };
    } else if (session.role === Role.SRA) {
      const scope = await prisma.staffScopeAssignment.findFirst({
        where: { staffId: session.staffProfileId, role: Role.SRA },
        include: { hostel: true, wing: true },
      });
      const wingStudents = await prisma.studentProfile.count({
        where: { currentWingId: scope?.wingId || undefined },
      });
      const pendingSraOutpasses = await prisma.outpassRequest.count({
        where: { sraId: session.staffProfileId, sraDecision: "PENDING" },
      });
      roleMetrics = {
        assignedHostel: scope?.hostel?.name || "Father Duraisamy",
        assignedWing: scope?.wing?.name || "A Block",
        residentsCount: wingStudents,
        pendingDecisions: pendingSraOutpasses,
      };
    }

    return NextResponse.json({
      role: session.role,
      fullName: session.fullName,
      overview: {
        totalStudents,
        totalHostels,
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
        occupancyRate: totalBeds > 0 ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0,
        pendingOutpasses,
        unresolvedComplaints,
      },
      roleMetrics,
      recentAudits,
    });
  } catch (error) {
    console.error("Staff dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load staff dashboard" }, { status: 500 });
  }
}

