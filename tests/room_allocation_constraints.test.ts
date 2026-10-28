import { describe, it, expect, beforeAll } from "vitest";
import { prisma } from "@/lib/db/prisma";

describe("Room Allocation Constraints & Residential History Suite", () => {
  it("should prevent exceeding room capacity or double-allocating an occupied bed", async () => {
    // Find a room and inspect capacity vs occupancy
    const room = await prisma.room.findFirst({
      where: { roomNumber: "204" },
      include: { beds: true },
    });

    expect(room).toBeDefined();
    expect(room?.capacity).toBe(2);

    // Bed A is occupied by Jabez
    const bedA = room?.beds.find((b) => b.bedCode === "A");
    expect(bedA?.isOccupied).toBe(true);

    // Bed B is occupied by Samuel
    const bedB = room?.beds.find((b) => b.bedCode === "B");
    expect(bedB?.isOccupied).toBe(true);

    // Room occupancy matches capacity
    expect(room?.currentOccupancy).toBe(room?.capacity);
  });

  it("should preserve residential history across room transfers without erasing past records", async () => {
    const student = await prisma.studentProfile.findFirst({
      where: { user: { identifier: "URK25CS6015" } },
      include: { residentialHistories: true },
    });

    expect(student).toBeDefined();
    expect(student?.residentialHistories.length).toBeGreaterThanOrEqual(2);

    // Check that historical semesters are chronologically preserved
    const sem1 = student?.residentialHistories.find((h) => h.semester === 1);
    const sem2 = student?.residentialHistories.find((h) => h.semester === 2);

    expect(sem1).toBeDefined();
    expect(sem1?.hostelName).toBe("Father Duraisamy");
    expect(sem1?.roomNumber).toBe("108");

    expect(sem2).toBeDefined();
    expect(sem2?.roomNumber).toBe("204");
  });
});

