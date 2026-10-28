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

    const student = await prisma.studentProfile.findFirst({
      where: session.role === Role.STUDENT ? { userId: session.userId } : { user: { identifier: "URK25CS6015" } },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // 1. Fetch Academic Attendance records with session details
    const academicRecords = await prisma.academicAttendanceRecord.findMany({
      where: { studentId: student.id },
      include: { session: true },
      orderBy: { session: { sessionDate: "desc" } },
    });

    // Calculate subject-wise aggregates
    const subjectMap = new Map<string, { code: string; name: string; total: number; attended: number; absent: number }>();

    for (const rec of academicRecords) {
      const code = rec.session.courseCode;
      if (!subjectMap.has(code)) {
        subjectMap.set(code, {
          code,
          name: rec.session.courseName,
          total: 0,
          attended: 0,
          absent: 0,
        });
      }
      const entry = subjectMap.get(code)!;
      entry.total += 1;
      if (rec.status === "PRESENT" || rec.status === "ON_DUTY") {
        entry.attended += 1;
      } else {
        entry.absent += 1;
      }
    }

    const subjectStats = Array.from(subjectMap.values()).map((sub) => ({
      ...sub,
      percentage: sub.total > 0 ? Number(((sub.attended / sub.total) * 100).toFixed(2)) : 0,
    }));

    const totalAcademicSessions = academicRecords.length;
    const attendedAcademicSessions = academicRecords.filter(
      (r) => r.status === "PRESENT" || r.status === "ON_DUTY"
    ).length;
    const overallAcademicPct =
      totalAcademicSessions > 0
        ? Number(((attendedAcademicSessions / totalAcademicSessions) * 100).toFixed(2))
        : student.classAttendancePct;

    // 2. Fetch Hostel Attendance records
    const hostelRecords = await prisma.hostelAttendanceRecord.findMany({
      where: { studentId: student.id },
      include: {
        session: {
          include: {
            hostel: { select: { name: true } },
            wing: { select: { name: true } },
            markedBy: { include: { user: { select: { fullName: true } } } },
          },
        },
      },
      orderBy: { session: { date: "desc" } },
    });

    const hostelTotalDays = hostelRecords.length;
    const hostelPresentDays = hostelRecords.filter((r) => r.status === "PRESENT").length;
    const hostelOutpassDays = hostelRecords.filter((r) => r.status === "APPROVED_OUTPASS").length;
    const hostelAbsentDays = hostelRecords.filter((r) => r.status === "ABSENT").length;

    return NextResponse.json({
      academic: {
        overallPercentage: overallAcademicPct,
        assemblyAttendancePct: student.assemblyAttendancePct,
        totalSessions: totalAcademicSessions,
        attendedSessions: attendedAcademicSessions,
        absentSessions: totalAcademicSessions - attendedAcademicSessions,
        formula: "Attendance % = (Attended Sessions / Scheduled Eligible Sessions) × 100",
        subjects: subjectStats,
        recentSessions: academicRecords.slice(0, 15).map((r) => ({
          id: r.id,
          courseCode: r.session.courseCode,
          courseName: r.session.courseName,
          date: r.session.sessionDate,
          slot: r.session.sessionSlot,
          status: r.status,
        })),
      },
      hostel: {
        totalDays: hostelTotalDays,
        presentDays: hostelPresentDays,
        outpassDays: hostelOutpassDays,
        absentDays: hostelAbsentDays,
        attendanceRate:
          hostelTotalDays > 0
            ? Number((((hostelPresentDays + hostelOutpassDays) / hostelTotalDays) * 100).toFixed(2))
            : 100,
        recentHistory: hostelRecords.map((hr) => ({
          id: hr.id,
          date: hr.session.date,
          hostelName: hr.session.hostel.name,
          wingName: hr.session.wing.name,
          markedBy: hr.session.markedBy.user.fullName,
          status: hr.status,
          remarks: hr.remarks,
        })),
      },
    });
  } catch (error) {
    console.error("Attendance API error:", error);
    return NextResponse.json({ error: "Failed to load attendance" }, { status: 500 });
  }
}

