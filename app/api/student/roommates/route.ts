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
        currentRoom: {
          include: {
            beds: {
              include: {
                currentStudent: {
                  include: { user: { select: { fullName: true, identifier: true, email: true } } },
                },
              },
            },
          },
        },
        currentBed: true,
        requestedRoommates: {
          include: {
            preferredStudent: {
              include: { user: { select: { fullName: true, identifier: true } } },
            },
          },
        },
        receivedRoommateRequests: {
          include: {
            requesterStudent: {
              include: { user: { select: { fullName: true, identifier: true } } },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Filter current roommates sharing the room
    const currentRoommates = student.currentRoom?.beds
      .filter((b) => b.currentStudent && b.currentStudent.id !== student.id)
      .map((b) => ({
        id: b.currentStudent!.id,
        fullName: b.currentStudent!.user.fullName,
        identifier: b.currentStudent!.user.identifier,
        programme: b.currentStudent!.programme,
        bedCode: b.bedCode,
        academicYear: b.currentStudent!.academicYear,
        semester: b.currentStudent!.semester,
      })) || [];

    // Historical roommates derived from residential history
    const pastHistories = await prisma.residentialHistory.findMany({
      where: { studentId: student.id },
      orderBy: { checkInDate: "desc" },
    });

    return NextResponse.json({
      currentRoom: {
        hostelName: student.currentHostel?.name || "Not Allocated",
        wingName: student.currentWing?.name || "N/A",
        roomNumber: student.currentRoom?.roomNumber || "N/A",
        roomType: student.currentRoom?.roomType || "N/A",
        myBedCode: student.currentBed?.bedCode || "N/A",
        totalBeds: student.currentRoom?.capacity || 0,
        currentOccupancy: student.currentRoom?.currentOccupancy || 0,
      },
      currentRoommates,
      requestsSent: student.requestedRoommates.map((r) => ({
        id: r.id,
        targetName: r.preferredStudent.user.fullName,
        targetId: r.preferredStudent.user.identifier,
        status: r.status,
      })),
      requestsReceived: student.receivedRoommateRequests.map((r) => ({
        id: r.id,
        fromName: r.requesterStudent.user.fullName,
        fromId: r.requesterStudent.user.identifier,
        status: r.status,
      })),
      pastHistories,
    });
  } catch (error) {
    console.error("Roommates GET error:", error);
    return NextResponse.json({ error: "Failed to load roommate details" }, { status: 500 });
  }
}

