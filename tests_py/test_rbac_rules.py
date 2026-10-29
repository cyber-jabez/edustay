from enum import Enum
import pytest


class Role(str, Enum):
    STUDENT = "STUDENT"
    MENTOR = "MENTOR"
    SRA = "SRA"
    WARDEN = "WARDEN"
    HOSTEL_ADMIN = "HOSTEL_ADMIN"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"


ROLE_PERMISSIONS = {
    Role.STUDENT: {
        "view_own_dashboard",
        "submit_outpass",
        "submit_complaint",
        "view_mess_schedule",
        "submit_room_preference",
        "view_own_attendance",
    },
    Role.MENTOR: {
        "view_assigned_students",
        "review_mentor_outpass",
        "view_academic_attendance",
    },
    Role.SRA: {
        "mark_hostel_roll_call",
        "review_sra_outpass",
        "view_wing_occupancy",
        "inspect_maintenance_tickets",
    },
    Role.WARDEN: {
        "approve_emergency_outpass",
        "manage_hostel_rules",
        "view_all_wing_occupancy",
        "assign_room_allocations",
    },
    Role.HOSTEL_ADMIN: {
        "configure_hostels",
        "manage_mess_menus",
        "manage_staff_assignments",
        "generate_institutional_reports",
    },
    Role.SYSTEM_ADMIN: {
        "configure_hostels",
        "manage_mess_menus",
        "manage_staff_assignments",
        "generate_institutional_reports",
        "manage_user_accounts",
        "view_audit_logs",
        "system_configuration",
    },
}


def check_permission(role: Role, action: str) -> bool:
    return action in ROLE_PERMISSIONS.get(role, set())


class TestRoleBasedAccessControl:
    def test_student_permissions(self):
        # Allowed
        assert check_permission(Role.STUDENT, "submit_outpass") is True
        assert check_permission(Role.STUDENT, "view_own_dashboard") is True
        assert check_permission(Role.STUDENT, "submit_complaint") is True

        # Forbidden
        assert check_permission(Role.STUDENT, "mark_hostel_roll_call") is False
        assert check_permission(Role.STUDENT, "review_mentor_outpass") is False
        assert check_permission(Role.STUDENT, "assign_room_allocations") is False
        assert check_permission(Role.STUDENT, "manage_user_accounts") is False

    def test_sra_permissions(self):
        assert check_permission(Role.SRA, "mark_hostel_roll_call") is True
        assert check_permission(Role.SRA, "review_sra_outpass") is True
        assert check_permission(Role.SRA, "view_wing_occupancy") is True

        # SRA cannot do mentor reviews or system admin actions
        assert check_permission(Role.SRA, "review_mentor_outpass") is False
        assert check_permission(Role.SRA, "manage_user_accounts") is False

    def test_mentor_permissions(self):
        assert check_permission(Role.MENTOR, "review_mentor_outpass") is True
        assert check_permission(Role.MENTOR, "view_academic_attendance") is True

        # Mentor cannot mark hostel evening roll-call
        assert check_permission(Role.MENTOR, "mark_hostel_roll_call") is False

    def test_system_admin_has_superuser_privileges(self):
        assert check_permission(Role.SYSTEM_ADMIN, "manage_user_accounts") is True
        assert check_permission(Role.SYSTEM_ADMIN, "view_audit_logs") is True
        assert check_permission(Role.SYSTEM_ADMIN, "system_configuration") is True

