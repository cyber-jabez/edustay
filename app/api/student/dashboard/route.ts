import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If student, find by session.userId. If staff inspecting, default to primary seeded student Jabez
    let student = null;
    if (session.role === Role.STUDENT) {
      student = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
        include: {
          user: true,
          mentor: { include: { user: true } },
          currentHostel: { include: { warden: { include: { user: true } } } },
          currentWing: true,
          currentRoom: {
            include: {
              beds: {
                include: {
                  currentStudent: { include: { user: true } },
                },
              },
            },
          },
          currentBed: true,
        },
      });
    } else {
      // Demonstration view for staff inspecting student portal
      student = await prisma.studentProfile.findFirst({
        where: { user: { identifier: "URK25CS6015" } },
        include: {
          user: true,
          mentor: { include: { user: true } },
          currentHostel: { include: { warden: { include: { user: true } } } },
          currentWing: true,
          currentRoom: {
            include: {
              beds: {
                include: {
                  currentStudent: { include: { user: true } },
                },
              },
            },
          },
          currentBed: true,
        },
      });
    }

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Get assigned SRA for this student's hostel and wing
    const sraScope = await prisma.staffScopeAssignment.findFirst({
      where: {
        hostelId: student.currentHostelId || undefined,
        wingId: student.currentWingId || undefined,
        role: Role.SRA,
      },
      include: {
        staff: { include: { user: true } },
      },
    });

    // Query persisted counts from database
    const [
      academicTotalSessions,
      academicAttendedSessions,
      hostelTotalDays,
      hostelPresentDays,
      hostelOutpassDays,
      pendingOutpassesCount,
      unresolvedComplaintsCount,
      recentNotices,
      recentNotifications,
      activeOutpass,
    ] = await Promise.all([
      prisma.academicAttendanceRecord.count({ where: { studentId: student.id } }),
      prisma.academicAttendanceRecord.count({
        where: { studentId: student.id, status: "PRESENT" },
      }),
      prisma.hostelAttendanceRecord.count({ where: { studentId: student.id } }),
      prisma.hostelAttendanceRecord.count({
        where: { studentId: student.id, status: "PRESENT" },
      }),
      prisma.hostelAttendanceRecord.count({
        where: { studentId: student.id, status: "APPROVED_OUTPASS" },
      }),
      prisma.outpassRequest.count({
        where: {
          studentId: student.id,
          status: { in: ["SUBMITTED", "PENDING_MENTOR", "PENDING_SRA", "PENDING_BOTH"] },
        },
      }),
      prisma.complaint.count({
        where: {
          studentId: student.id,
          status: { in: ["SUBMITTED", "ACKNOWLEDGED", "ASSIGNED", "IN_PROGRESS"] },
        },
      }),
      prisma.notice.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { author: { select: { fullName: true, role: true } } },
      }),
      prisma.notification.findMany({
        where: { userId: student.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.outpassRequest.findFirst({
        where: { studentId: student.id },
        orderBy: { createdAt: "desc" },
        include: { formType: true },
      }),
    ]);

    // Current roommates
    const roommates = student.currentRoom?.beds
      .filter((b) => b.currentStudent && b.currentStudent.id !== student.id)
      .map((b) => ({
        id: b.currentStudent!.id,
        fullName: b.currentStudent!.user.fullName,
        identifier: b.currentStudent!.user.identifier,
        bedCode: b.bedCode,
        programme: b.currentStudent!.programme,
      })) || [];

    const calculatedAcademicPct =
      academicTotalSessions > 0
        ? Number(((academicAttendedSessions / academicTotalSessions) * 100).toFixed(2))
        : student.classAttendancePct;

    return NextResponse.json({
      student: {
        id: student.id,
        userId: student.userId,
        fullName: student.user.fullName,
        identifier: student.user.identifier,
        email: student.user.email,
        phone: student.user.phone,
        avatarUrl: student.user.avatarUrl,
        programme: student.programme,
        department: student.department,
        academicYear: student.academicYear,
        semester: student.semester,
        section: student.section,
        cgpa: student.cgpa,
        arrearsCount: student.arrearsCount,
        classAttendancePct: calculatedAcademicPct,
        assemblyAttendancePct: student.assemblyAttendancePct,
        isVerified: student.isVerified,
        residence: {
          hostelName: student.currentHostel?.name || "Not Allocated",
          wingName: student.currentWing?.name || "N/A",
          roomNumber: student.currentRoom?.roomNumber || "N/A",
          bedCode: student.currentBed?.bedCode || "N/A",
          roomType: student.currentRoom?.roomType || "N/A",
          isAc: student.currentRoom?.isAc || false,
          capacity: student.currentRoom?.capacity || 0,
          currentOccupancy: student.currentRoom?.currentOccupancy || 0,
          mentorName: student.mentor?.user.fullName || "Unassigned",
          mentorEmail: student.mentor?.user.email,
          sraName: sraScope?.staff.user.fullName || "Unassigned",
          wardenName: student.currentHostel?.warden?.user.fullName || "Unassigned",
        },
        roommates,
      },
      stats: {
        academicAttendancePct: calculatedAcademicPct,
        assemblyAttendancePct: student.assemblyAttendancePct,
        arrearsCount: student.arrearsCount,
        cgpa: student.cgpa,
        totalAcademicSessions: academicTotalSessions,
        attendedAcademicSessions: academicAttendedSessions,
        absentAcademicSessions: academicTotalSessions - academicAttendedSessions,
        totalHostelRecordedDays: hostelTotalDays,
        hostelPresentDays,
        hostelOutpassDays,
        hostelAbsentDays: Math.max(0, hostelTotalDays - hostelPresentDays - hostelOutpassDays),
        pendingOutpassesCount,
        unresolvedComplaintsCount,
        roomOccupancyRatio: `${student.currentRoom?.currentOccupancy || 0}/${student.currentRoom?.capacity || 0}`,
      },
      recentActivity: {
        latestOutpass: activeOutpass,
        notices: recentNotices,
        notifications: recentNotifications,
      },
    });
  } catch (error) {
    console.error("Student dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load student dashboard" }, { status: 500 });
  }
}

