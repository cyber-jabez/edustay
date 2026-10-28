import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { canManageHostels } from "@/lib/permissions/rbac";
import { AllocationStatus } from "@prisma/client";
import { z } from "zod";

const allocateBedSchema = z.object({
  studentId: z.string().min(1),
  bedId: z.string().min(1),
  remarks: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !canManageHostels(session)) {
      return NextResponse.json({ error: "Forbidden: Hostel Administrator authorization required" }, { status: 403 });
    }

    const [hostels, pendingPreferences, recentAllocations] = await Promise.all([
      prisma.hostel.findMany({
        include: {
          wings: {
            include: {
              floors: {
                include: {
                  rooms: {
                    include: {
                      beds: {
                        include: {
                          currentStudent: {
                            include: { user: { select: { fullName: true, identifier: true } } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.roomPreference.findMany({
        include: {
          student: { include: { user: { select: { fullName: true, identifier: true } } } },
          window: true,
        },
      }),
      prisma.roomAllocation.findMany({
        take: 20,
        orderBy: { allocationDate: "desc" },
        include: {
          student: { include: { user: { select: { fullName: true, identifier: true } } } },
          room: true,
          bed: true,
          hostel: true,
        },
      }),
    ]);

    return NextResponse.json({
      hostels,
      pendingPreferences,
      recentAllocations,
    });
  } catch (error) {
    console.error("Allocations GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve allocations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !canManageHostels(session)) {
      return NextResponse.json({ error: "Forbidden: Hostel Administrator authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const result = allocateBedSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid allocation data", details: result.error.flatten() }, { status: 400 });
    }

    const { studentId, bedId, remarks } = result.data;

    // Concurrency and constraint validation
    const allocation = await prisma.$transaction(async (tx) => {
      // 1. Fetch target bed and room
      const bed = await tx.bed.findUnique({
        where: { id: bedId },
        include: {
          room: {
            include: {
              floor: {
                include: {
                  wing: {
                    include: { hostel: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!bed) {
        throw new Error("Target bed not found");
      }

      if (bed.isOccupied) {
        throw new Error(`Bed ${bed.bedCode} in Room ${bed.room.roomNumber} is already occupied.`);
      }

      if (bed.room.currentOccupancy >= bed.room.capacity) {
        throw new Error(`Room ${bed.room.roomNumber} has reached its maximum capacity of ${bed.room.capacity}.`);
      }

      // 2. Fetch student
      const student = await tx.studentProfile.findUnique({
        where: { id: studentId },
        include: { user: true, currentBed: true, currentRoom: true },
      });

      if (!student) {
        throw new Error("Student record not found");
      }

      // If student was in another bed, vacate previous bed & record history
      if (student.currentBedId && student.currentHostelId && student.currentRoom) {
        await tx.bed.update({
          where: { id: student.currentBedId },
          data: { isOccupied: false },
        });

        await tx.room.update({
          where: { id: student.currentRoom.id },
          data: { currentOccupancy: Math.max(0, student.currentRoom.currentOccupancy - 1) },
        });

        // Close previous active allocation
        await tx.roomAllocation.updateMany({
          where: { studentId: student.id, status: AllocationStatus.ACTIVE },
          data: { status: AllocationStatus.TRANSFERRED, vacatedDate: new Date() },
        });
      }

      // 3. Mark bed as occupied
      await tx.bed.update({
        where: { id: bed.id },
        data: { isOccupied: true },
      });

      // 4. Increment room occupancy
      await tx.room.update({
        where: { id: bed.room.id },
        data: { currentOccupancy: bed.room.currentOccupancy + 1 },
      });

      // 5. Update student current residence pointer
      const updatedStudent = await tx.studentProfile.update({
        where: { id: student.id },
        data: {
          currentHostelId: bed.room.floor.wing.hostel.id,
          currentWingId: bed.room.floor.wing.id,
          currentRoomId: bed.room.id,
          currentBedId: bed.id,
        },
      });

      // 6. Create RoomAllocation record
      const createdAlloc = await tx.roomAllocation.create({
        data: {
          studentId: student.id,
          bedId: bed.id,
          roomId: bed.room.id,
          hostelId: bed.room.floor.wing.hostel.id,
          status: AllocationStatus.ACTIVE,
          remarks: remarks || "Administrative allocation by Hostel Administrator",
        },
      });

      // 7. Record Residential History
      await tx.residentialHistory.create({
        data: {
          studentId: student.id,
          hostelName: bed.room.floor.wing.hostel.name,
          wingName: bed.room.floor.wing.name,
          floorNumber: bed.room.floor.floorNumber,
          roomNumber: bed.room.roomNumber,
          bedCode: bed.bedCode,
          roomType: bed.room.roomType,
          academicYear: student.academicYear,
          semester: student.semester,
          checkInDate: new Date(),
          transferNotes: remarks || "Allocated via EduStay portal",
        },
      });

      // 8. Audit log
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "ROOM_BED_ALLOCATED",
          entityType: "RoomAllocation",
          entityId: createdAlloc.id,
          detailsJson: JSON.stringify({
            studentId,
            bedId,
            roomNumber: bed.room.roomNumber,
            hostelName: bed.room.floor.wing.hostel.name,
          }),
        },
      });

      // 9. Notification to student
      await tx.notification.create({
        data: {
          userId: student.userId,
          title: "Confirmed Room Allocation",
          message: `You have been officially allocated Bed ${bed.bedCode} in Room ${bed.room.roomNumber}, ${bed.room.floor.wing.hostel.name}.`,
          type: "SUCCESS",
          link: "/student/hostel-allocation",
        },
      });

      return createdAlloc;
    });

    return NextResponse.json({
      success: true,
      message: "Room and bed allocated successfully with verified relational constraints.",
      allocation,
    });
  } catch (error: unknown) {
    console.error("Allocation error:", error);
    const msg = error instanceof Error ? error.message : "Failed to allocate room";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

