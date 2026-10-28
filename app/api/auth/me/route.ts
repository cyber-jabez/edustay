import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        identifier: true,
        fullName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        studentProfile: {
          select: {
            id: true,
            programme: true,
            department: true,
            academicYear: true,
            semester: true,
            section: true,
            cgpa: true,
            arrearsCount: true,
            classAttendancePct: true,
            assemblyAttendancePct: true,
            currentHostel: { select: { id: true, name: true } },
            currentWing: { select: { id: true, name: true } },
            currentRoom: { select: { id: true, roomNumber: true } },
            currentBed: { select: { id: true, bedCode: true } },
          },
        },
        staffProfile: {
          select: {
            id: true,
            staffCode: true,
            designation: true,
            department: true,
            staffType: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Failed to retrieve user" }, { status: 500 });
  }
}

