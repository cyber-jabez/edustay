import { describe, it, expect } from "vitest";
import { isStaffRole, canAccessStaffArea, canMarkAttendance, canDecideOutpass } from "@/lib/permissions/rbac";
import { Role } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";

describe("Role-Based Access Control (RBAC) Test Suite", () => {
  it("should distinguish student roles from staff roles", () => {
    expect(isStaffRole(Role.STUDENT)).toBe(false);
    expect(isStaffRole(Role.MENTOR)).toBe(true);
    expect(isStaffRole(Role.SRA)).toBe(true);
    expect(isStaffRole(Role.WARDEN)).toBe(true);
    expect(isStaffRole(Role.HOSTEL_ADMIN)).toBe(true);
    expect(isStaffRole(Role.SYSTEM_ADMIN)).toBe(true);
  });

  it("should prevent students from accessing staff operational areas", () => {
    const studentSession: SessionPayload = {
      userId: "stu-1",
      email: "stu@karunya.edu",
      identifier: "URK25CS6015",
      role: Role.STUDENT,
      fullName: "Student User",
    };

    expect(canAccessStaffArea(studentSession)).toBe(false);
    expect(canMarkAttendance(studentSession)).toBe(false);
  });

  it("should permit SRAs and Wardens to mark daily hostel roll call", () => {
    const sraSession: SessionPayload = {
      userId: "sra-1",
      email: "sra@karunya.edu",
      identifier: "SRA001",
      role: Role.SRA,
      fullName: "SRA Officer",
      staffProfileId: "staff-sra-1",
    };

    expect(canAccessStaffArea(sraSession)).toBe(true);
    expect(canMarkAttendance(sraSession)).toBe(true);
  });

  it("should enforce record-level outpass authorization boundaries", () => {
    const mentorId = "mentor-philip";
    const sraId = "sra-joseph";

    const assignedMentorSession: SessionPayload = {
      userId: "u-mentor",
      email: "philip@karunya.edu",
      identifier: "MNT01",
      role: Role.MENTOR,
      fullName: "Dr. Philip",
      staffProfileId: mentorId,
    };

    const unassignedMentorSession: SessionPayload = {
      userId: "u-other-mentor",
      email: "other@karunya.edu",
      identifier: "MNT02",
      role: Role.MENTOR,
      fullName: "Dr. Other",
      staffProfileId: "different-mentor-id",
    };

    // Assigned mentor can decide
    const resultAssigned = canDecideOutpass(assignedMentorSession, mentorId, sraId);
    expect(resultAssigned.canMentorDecide).toBe(true);
    expect(resultAssigned.canSraDecide).toBe(false);

    // Unassigned mentor CANNOT decide
    const resultUnassigned = canDecideOutpass(unassignedMentorSession, mentorId, sraId);
    expect(resultUnassigned.canMentorDecide).toBe(false);
    expect(resultUnassigned.canSraDecide).toBe(false);
  });
});

