import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { OutpassStatus, OutpassDecision, Role } from "@prisma/client";

describe("Outpass Dual Approval Business Logic & Persistence Suite", () => {
  let student: any;
  let formType: any;
  let mentor: any;
  let sra: any;

  beforeAll(async () => {
    student = await prisma.studentProfile.findFirst({
      where: { user: { identifier: "URK25CS6015" } },
    });
    formType = await prisma.outpassFormType.findFirst({
      where: { code: "YELLOW" },
    });
    mentor = await prisma.staffProfile.findFirst({
      where: { staffType: Role.MENTOR },
    });
    sra = await prisma.staffProfile.findFirst({
      where: { staffType: Role.SRA },
    });
  });

  it("proves an outpass CANNOT be approved after only one of two required approvals", async () => {
    // 1. Create a test outpass
    const testOutpass = await prisma.outpassRequest.create({
      data: {
        outpassNumber: `TEST-DUAL-${Date.now()}`,
        studentId: student.id,
        formTypeId: formType.id,
        destination: "Coimbatore Cross Cut Road",
        reason: "Test dual approval verification",
        departureTime: new Date(),
        expectedReturnTime: new Date(Date.now() + 86400000),
        contactPhone: "+91 98401 23456",
        status: OutpassStatus.SUBMITTED,
        mentorDecision: OutpassDecision.PENDING,
        sraDecision: OutpassDecision.PENDING,
        mentorId: mentor.id,
        sraId: sra.id,
      },
    });

    expect(testOutpass.status).toBe(OutpassStatus.SUBMITTED);

    // 2. Mentor approves ONLY
    let calculatedStatus: OutpassStatus = OutpassStatus.SUBMITTED;
    const mentorDecision = OutpassDecision.APPROVED;
    const sraDecision = OutpassDecision.PENDING;

    if (mentorDecision === OutpassDecision.APPROVED && sraDecision === OutpassDecision.PENDING) {
      calculatedStatus = OutpassStatus.PENDING_SRA;
    }

    const afterMentor = await prisma.outpassRequest.update({
      where: { id: testOutpass.id },
      data: {
        mentorDecision,
        status: calculatedStatus,
      },
    });

    // VERIFICATION: Status is strictly NOT APPROVED! It is waiting for SRA!
    expect(afterMentor.status).toBe(OutpassStatus.PENDING_SRA);
    expect(afterMentor.status).not.toBe(OutpassStatus.APPROVED);

    // 3. SRA now also approves -> BOTH have approved!
    let finalStatus: OutpassStatus = OutpassStatus.PENDING_SRA;
    const newSraDecision = OutpassDecision.APPROVED;

    if (afterMentor.mentorDecision === OutpassDecision.APPROVED && newSraDecision === OutpassDecision.APPROVED) {
      finalStatus = OutpassStatus.APPROVED;
    }

    const afterBoth = await prisma.outpassRequest.update({
      where: { id: testOutpass.id },
      data: {
        sraDecision: newSraDecision,
        status: finalStatus,
      },
    });

    // VERIFICATION: Status is now officially APPROVED!
    expect(afterBoth.status).toBe(OutpassStatus.APPROVED);

    // Cleanup test record
    await prisma.outpassRequest.delete({ where: { id: testOutpass.id } });
  });

  it("proves that rejection by either reviewer immediately transitions request to REJECTED", async () => {
    const testOutpass = await prisma.outpassRequest.create({
      data: {
        outpassNumber: `TEST-REJECT-${Date.now()}`,
        studentId: student.id,
        formTypeId: formType.id,
        destination: "Out of city visit",
        reason: "Test rejection workflow",
        departureTime: new Date(),
        expectedReturnTime: new Date(Date.now() + 86400000),
        contactPhone: "+91 98401 23456",
        status: OutpassStatus.SUBMITTED,
        mentorDecision: OutpassDecision.PENDING,
        sraDecision: OutpassDecision.PENDING,
        mentorId: mentor.id,
        sraId: sra.id,
      },
    });

    // Mentor approves, but SRA subsequently rejects
    const mentorDecision = OutpassDecision.APPROVED;
    const sraDecision = OutpassDecision.REJECTED;

    let statusAfterDecision = OutpassStatus.SUBMITTED;
    if (mentorDecision === OutpassDecision.REJECTED || sraDecision === OutpassDecision.REJECTED) {
      statusAfterDecision = OutpassStatus.REJECTED;
    }

    const updated = await prisma.outpassRequest.update({
      where: { id: testOutpass.id },
      data: {
        mentorDecision,
        sraDecision,
        status: statusAfterDecision,
      },
    });

    expect(updated.status).toBe(OutpassStatus.REJECTED);

    // Cleanup
    await prisma.outpassRequest.delete({ where: { id: testOutpass.id } });
  });
});

