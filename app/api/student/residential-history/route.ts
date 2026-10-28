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
      include: {
        currentHostel: true,
        currentWing: true,
        currentRoom: true,
        currentBed: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Chronological past residence history
    const history = await prisma.residentialHistory.findMany({
      where: { studentId: student.id },
      orderBy: { checkInDate: "desc" },
    });

    return NextResponse.json({
      current: {
        hostelName: student.currentHostel?.name || "Not Allocated",
        wingName: student.currentWing?.name || "N/A",
        roomNumber: student.currentRoom?.roomNumber || "N/A",
        bedCode: student.currentBed?.bedCode || "N/A",
        roomType: student.currentRoom?.roomType || "DOUBLE",
        academicYear: student.academicYear,
        semester: student.semester,
        checkInDate: "2025-07-01",
      },
      history,
    });
  } catch (error) {
    console.error("Residential history GET error:", error);
    return NextResponse.json({ error: "Failed to load residential history" }, { status: 500 });
  }
}

