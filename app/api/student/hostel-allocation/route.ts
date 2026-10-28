import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Role, RoomType } from "@prisma/client";
import { z } from "zod";

const preferenceSubmissionSchema = z.object({
  windowId: z.string().min(1),
  preferredHostelId: z.string().min(1),
  preferredRoomType: z.nativeEnum(RoomType),
  isAcPreferred: z.boolean(),
  preferredRoommateIdentifier: z.string().optional(),
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
        currentHostel: true,
        currentRoom: true,
        currentBed: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // 1. Available Open Allocation Windows
    const windows = await prisma.allocationWindow.findMany({
      where: { status: "OPEN" },
      orderBy: { endDate: "asc" },
    });

    // 2. Hostels matching student gender
    const hostels = await prisma.hostel.findMany({
      where: {
        isActive: true,
        OR: [{ genderCategory: student.gender }, { genderCategory: "COED" }],
      },
      include: {
        wings: {
          include: {
            floors: {
              include: {
                rooms: {
                  select: {
                    id: true,
                    roomNumber: true,
                    roomType: true,
                    isAc: true,
                    capacity: true,
                    currentOccupancy: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 3. Existing preferences submitted by student
    const studentPreferences = await prisma.roomPreference.findMany({
      where: { studentId: student.id },
      include: { window: true },
    });

    const roommatePreferences = await prisma.roommatePreference.findMany({
      where: { requesterStudentId: student.id },
      include: {
        preferredStudent: { include: { user: { select: { fullName: true, identifier: true } } } },
      },
    });

    // 4. Current confirmed allocation
    const currentAllocation = await prisma.roomAllocation.findFirst({
      where: { studentId: student.id, status: "ACTIVE" },
      include: {
        hostel: true,
        room: true,
        bed: true,
      },
    });

    return NextResponse.json({
      windows,
      hostels: hostels.map((h) => ({
        id: h.id,
        name: h.name,
        buildingCode: h.buildingCode,
        description: h.description,
        facilities: h.facilities,
        rules: h.rules,
        genderCategory: h.genderCategory,
        totalWings: h.wings.length,
        totalRooms: h.wings.flatMap((w) => w.floors.flatMap((f) => f.rooms)).length,
      })),
      preferences: {
        room: studentPreferences,
        roommates: roommatePreferences,
      },
      currentAllocation,
    });
  } catch (error) {
    console.error("Hostel allocation GET error:", error);
    return NextResponse.json({ error: "Failed to load allocation data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const result = preferenceSubmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid preference data", details: result.error.flatten() }, { status: 400 });
    }

    const { windowId, preferredHostelId, preferredRoomType, isAcPreferred, preferredRoommateIdentifier } = result.data;

    // Check window is open
    const window = await prisma.allocationWindow.findUnique({ where: { id: windowId } });
    if (!window || window.status !== "OPEN") {
      return NextResponse.json({ error: "The allocation window is not currently open." }, { status: 400 });
    }

    // Save or update room preference in transaction
    await prisma.$transaction(async (tx) => {
      // Upsert room preference
      await tx.roomPreference.upsert({
        where: {
          studentId_windowId_rankOrder: {
            studentId: student.id,
            windowId,
            rankOrder: 1,
          },
        },
        create: {
          studentId: student.id,
          windowId,
          preferredHostelId,
          preferredRoomType,
          isAcPreferred,
          rankOrder: 1,
        },
        update: {
          preferredHostelId,
          preferredRoomType,
          isAcPreferred,
        },
      });

      // Handle preferred roommate request if identifier specified
      if (preferredRoommateIdentifier && preferredRoommateIdentifier.trim().length > 0) {
        const cleanId = preferredRoommateIdentifier.trim().toUpperCase();
        const preferredStudent = await tx.studentProfile.findFirst({
          where: { user: { identifier: cleanId } },
          include: { user: true },
        });

        if (preferredStudent && preferredStudent.id !== student.id) {
          // Check gender compatibility
          if (preferredStudent.gender === student.gender) {
            await tx.roommatePreference.upsert({
              where: {
                requesterStudentId_preferredStudentId_windowId: {
                  requesterStudentId: student.id,
                  preferredStudentId: preferredStudent.id,
                  windowId,
                },
              },
              create: {
                requesterStudentId: student.id,
                preferredStudentId: preferredStudent.id,
                windowId,
                priorityOrder: 1,
                status: "PENDING",
              },
              update: {
                status: "PENDING",
              },
            });

            // In-app notification to the requested roommate
            await tx.notification.create({
              data: {
                userId: preferredStudent.userId,
                title: "New Roommate Request",
                message: `${session.fullName} (${session.identifier}) requested you as a preferred roommate.`,
                type: "INFO",
                link: "/student/roommates",
              },
            });
          }
        }
      }

      // Record audit log
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "ROOM_PREFERENCE_SUBMITTED",
          entityType: "RoomPreference",
          entityId: student.id,
          detailsJson: JSON.stringify({ preferredHostelId, preferredRoomType, isAcPreferred }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Room and roommate preferences recorded successfully into PostgreSQL database.",
    });
  } catch (error) {
    console.error("Preference submit error:", error);
    return NextResponse.json({ error: "Failed to submit room preferences" }, { status: 500 });
  }
}

