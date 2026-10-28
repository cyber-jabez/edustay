import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Role, OutpassStatus, OutpassDecision } from "@prisma/client";
import { canDecideOutpass } from "@/lib/permissions/rbac";
import { z } from "zod";

const outpassDecisionSchema = z.object({
  outpassId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED"]),
  comments: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === Role.STUDENT) {
      return NextResponse.json(
        { error: "Forbidden: Students are not authorized to decide outpass applications" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = outpassDecisionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid decision parameters", details: result.error.flatten() }, { status: 400 });
    }

    const { outpassId, decision, comments } = result.data;

    // Fetch outpass with student and reviewer assignments
    const outpass = await prisma.outpassRequest.findUnique({
      where: { id: outpassId },
      include: {
        student: { include: { user: true } },
        formType: true,
      },
    });

    if (!outpass) {
      return NextResponse.json({ error: "Outpass record not found" }, { status: 404 });
    }

    // Check authorization to decide this outpass
    const { canMentorDecide, canSraDecide } = canDecideOutpass(
      session,
      outpass.mentorId,
      outpass.sraId
    );

    if (!canMentorDecide && !canSraDecide) {
      return NextResponse.json(
        { error: "Forbidden: You are neither the assigned Mentor nor the assigned SRA for this student's outpass" },
        { status: 403 }
      );
    }

    const isMentorActing = session.role === Role.MENTOR || (canMentorDecide && !canSraDecide);

    // Execute atomic transition in transaction
    const updated = await prisma.$transaction(async (tx) => {
      let newMentorDecision = outpass.mentorDecision;
      let newMentorDecisionAt = outpass.mentorDecisionAt;
      let newMentorComments = outpass.mentorComments;

      let newSraDecision = outpass.sraDecision;
      let newSraDecisionAt = outpass.sraDecisionAt;
      let newSraComments = outpass.sraComments;

      if (isMentorActing) {
        newMentorDecision = decision === "APPROVED" ? OutpassDecision.APPROVED : OutpassDecision.REJECTED;
        newMentorDecisionAt = new Date();
        newMentorComments = comments || "Decision recorded by Mentor";
      } else {
        newSraDecision = decision === "APPROVED" ? OutpassDecision.APPROVED : OutpassDecision.REJECTED;
        newSraDecisionAt = new Date();
        newSraComments = comments || "Decision recorded by SRA";
      }

      // Dual approval calculation
      let calculatedStatus: OutpassStatus = outpass.status;

      if (newMentorDecision === OutpassDecision.REJECTED || newSraDecision === OutpassDecision.REJECTED) {
        calculatedStatus = OutpassStatus.REJECTED;
      } else if (newMentorDecision === OutpassDecision.APPROVED && newSraDecision === OutpassDecision.APPROVED) {
        // Both required reviewers have granted approval!
        calculatedStatus = OutpassStatus.APPROVED;
      } else if (newMentorDecision === OutpassDecision.APPROVED && newSraDecision === OutpassDecision.PENDING) {
        calculatedStatus = OutpassStatus.PENDING_SRA;
      } else if (newSraDecision === OutpassDecision.APPROVED && newMentorDecision === OutpassDecision.PENDING) {
        calculatedStatus = OutpassStatus.PENDING_MENTOR;
      }

      const res = await tx.outpassRequest.update({
        where: { id: outpassId },
        data: {
          mentorDecision: newMentorDecision,
          mentorDecisionAt: newMentorDecisionAt,
          mentorComments: newMentorComments,
          sraDecision: newSraDecision,
          sraDecisionAt: newSraDecisionAt,
          sraComments: newSraComments,
          status: calculatedStatus,
        },
      });

      // Record in OutpassApproval history table
      if (session.staffProfileId) {
        await tx.outpassApproval.create({
          data: {
            requestId: outpass.id,
            reviewerId: session.staffProfileId,
            reviewerRole: session.role,
            decision: decision === "APPROVED" ? OutpassDecision.APPROVED : OutpassDecision.REJECTED,
            comments,
          },
        });
      }

      // Record Status History transition
      await tx.outpassStatusHistory.create({
        data: {
          requestId: outpass.id,
          fromStatus: outpass.status,
          toStatus: calculatedStatus,
          changedById: session.userId,
          remarks: `${session.role} decided ${decision}: ${comments || "No comments"}`,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: `OUTPASS_${decision}`,
          entityType: "OutpassRequest",
          entityId: outpass.id,
          detailsJson: JSON.stringify({
            reviewerRole: session.role,
            decision,
            calculatedStatus,
            outpassNumber: outpass.outpassNumber,
          }),
        },
      });

      // Notification to Student
      await tx.notification.create({
        data: {
          userId: outpass.student.userId,
          title: `Outpass Update: ${outpass.outpassNumber}`,
          message:
            calculatedStatus === OutpassStatus.APPROVED
              ? `Your outpass ${outpass.outpassNumber} is now FULLY APPROVED by both Mentor & SRA.`
              : calculatedStatus === OutpassStatus.REJECTED
              ? `Your outpass ${outpass.outpassNumber} was rejected by ${session.role}. Reason: ${comments || "Not specified"}`
              : `Your outpass was approved by ${session.role}. Awaiting secondary authorization.`,
          type: calculatedStatus === OutpassStatus.APPROVED ? "SUCCESS" : calculatedStatus === OutpassStatus.REJECTED ? "ALERT" : "INFO",
          link: "/student/outpass",
        },
      });

      return res;
    });

    return NextResponse.json({
      success: true,
      message: `Outpass decision recorded: ${decision}. Current status is now ${updated.status}.`,
      outpass: updated,
    });
  } catch (error) {
    console.error("Outpass decide error:", error);
    return NextResponse.json({ error: "Failed to record outpass decision" }, { status: 500 });
  }
}

