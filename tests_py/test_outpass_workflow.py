from enum import Enum
import pytest


class FormTypeCode(str, Enum):
    YELLOW = "YELLOW"
    GREEN = "GREEN"
    WHITE = "WHITE"


class OutpassDecision(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class OutpassStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    PENDING_MENTOR = "PENDING_MENTOR"
    PENDING_SRA = "PENDING_SRA"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


FORM_TYPE_LIMITS = {
    FormTypeCode.YELLOW: 1,    # Day leave
    FormTypeCode.GREEN: 5,     # Up to 5 days
    FormTypeCode.WHITE: 14,    # Up to 14 days
}


def validate_outpass_duration(form_type: FormTypeCode, duration_days: int) -> bool:
    max_days = FORM_TYPE_LIMITS.get(form_type, 0)
    return 0 < duration_days <= max_days


def calculate_outpass_status(
    mentor_decision: OutpassDecision, sra_decision: OutpassDecision
) -> OutpassStatus:
    """
    Computes overall outpass status from mentor and SRA decisions.
    Rules:
    - If either rejects, status is REJECTED.
    - If both approve, status is APPROVED.
    - If mentor approved and SRA pending, status is PENDING_SRA.
    - If SRA approved and mentor pending, status is PENDING_MENTOR.
    - Otherwise, status remains SUBMITTED.
    """
    if (
        mentor_decision == OutpassDecision.REJECTED
        or sra_decision == OutpassDecision.REJECTED
    ):
        return OutpassStatus.REJECTED

    if (
        mentor_decision == OutpassDecision.APPROVED
        and sra_decision == OutpassDecision.APPROVED
    ):
        return OutpassStatus.APPROVED

    if (
        mentor_decision == OutpassDecision.APPROVED
        and sra_decision == OutpassDecision.PENDING
    ):
        return OutpassStatus.PENDING_SRA

    if (
        sra_decision == OutpassDecision.APPROVED
        and mentor_decision == OutpassDecision.PENDING
    ):
        return OutpassStatus.PENDING_MENTOR

    return OutpassStatus.SUBMITTED


class TestOutpassDualApprovalWorkflow:
    def test_form_duration_validation(self):
        # Yellow form: 1 day allowed, >1 day rejected
        assert validate_outpass_duration(FormTypeCode.YELLOW, 1) is True
        assert validate_outpass_duration(FormTypeCode.YELLOW, 2) is False

        # Green form: up to 5 days
        assert validate_outpass_duration(FormTypeCode.GREEN, 5) is True
        assert validate_outpass_duration(FormTypeCode.GREEN, 6) is False

        # White form: up to 14 days
        assert validate_outpass_duration(FormTypeCode.WHITE, 14) is True
        assert validate_outpass_duration(FormTypeCode.WHITE, 15) is False

    def test_initial_submission_status(self):
        status = calculate_outpass_status(
            mentor_decision=OutpassDecision.PENDING,
            sra_decision=OutpassDecision.PENDING,
        )
        assert status == OutpassStatus.SUBMITTED

    def test_mentor_approval_alone_does_not_approve(self):
        status = calculate_outpass_status(
            mentor_decision=OutpassDecision.APPROVED,
            sra_decision=OutpassDecision.PENDING,
        )
        assert status == OutpassStatus.PENDING_SRA
        assert status != OutpassStatus.APPROVED

    def test_sra_approval_alone_does_not_approve(self):
        status = calculate_outpass_status(
            mentor_decision=OutpassDecision.PENDING,
            sra_decision=OutpassDecision.APPROVED,
        )
        assert status == OutpassStatus.PENDING_MENTOR
        assert status != OutpassStatus.APPROVED

    def test_both_approved_yields_full_approval(self):
        status = calculate_outpass_status(
            mentor_decision=OutpassDecision.APPROVED,
            sra_decision=OutpassDecision.APPROVED,
        )
        assert status == OutpassStatus.APPROVED

    def test_mentor_rejection_overrides_to_rejected(self):
        status = calculate_outpass_status(
            mentor_decision=OutpassDecision.REJECTED,
            sra_decision=OutpassDecision.APPROVED,
        )
        assert status == OutpassStatus.REJECTED

    def test_sra_rejection_overrides_to_rejected(self):
        status = calculate_outpass_status(
            mentor_decision=OutpassDecision.APPROVED,
            sra_decision=OutpassDecision.REJECTED,
        )
        assert status == OutpassStatus.REJECTED

