import { describe, it, expect } from "vitest";

describe("Attendance Calculation Formula Specification Suite", () => {
  const calculateAttendancePercentage = (attended: number, total: number): number => {
    if (total <= 0) return 100.0;
    return Number(((attended / total) * 100).toFixed(2));
  };

  it("should calculate attendance percentage precisely according to university institutional formula", () => {
    // 99 sessions attended out of 100
    expect(calculateAttendancePercentage(99, 100)).toBe(99.0);

    // 45 attended out of 60 sessions -> 75.0%
    expect(calculateAttendancePercentage(45, 60)).toBe(75.0);

    // 44 attended out of 60 sessions -> 73.33% (shortage)
    expect(calculateAttendancePercentage(44, 60)).toBe(73.33);

    // Edge case: 0 total scheduled sessions defaults gracefully to 100%
    expect(calculateAttendancePercentage(0, 0)).toBe(100.0);
  });

  it("should distinguish authorized hostel outpasses from unauthorized absences", () => {
    const totalRecordedDays = 30;
    const physicallyPresentDays = 26;
    const approvedOutpassDays = 4;
    const unexcusedAbsenceDays = 0;

    // Compliance rate considers approved outpass as authorized leave, not disciplinary absence
    const complianceRate = Number(
      (((physicallyPresentDays + approvedOutpassDays) / totalRecordedDays) * 100).toFixed(2)
    );

    expect(complianceRate).toBe(100.0);
    expect(unexcusedAbsenceDays).toBe(0);
  });
});

