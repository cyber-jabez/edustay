import { Role } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";

export function isStaffRole(role: Role): boolean {
  const staffRoles: Role[] = [
    Role.MENTOR,
    Role.SRA,
    Role.WARDEN,
    Role.HOSTEL_ADMIN,
    Role.SYSTEM_ADMIN,
  ];
  return staffRoles.includes(role);
}

export function canAccessStudentArea(session: SessionPayload | null): boolean {
  if (!session) return false;
  return session.role === Role.STUDENT || isStaffRole(session.role);
}

export function canAccessStaffArea(session: SessionPayload | null): boolean {
  if (!session) return false;
  return isStaffRole(session.role);
}

export function canMarkAttendance(session: SessionPayload | null): boolean {
  if (!session) return false;
  const authorized: Role[] = [Role.SRA, Role.WARDEN, Role.HOSTEL_ADMIN, Role.SYSTEM_ADMIN];
  return authorized.includes(session.role);
}

export function canManageHostels(session: SessionPayload | null): boolean {
  if (!session) return false;
  const authorized: Role[] = [Role.HOSTEL_ADMIN, Role.SYSTEM_ADMIN, Role.WARDEN];
  return authorized.includes(session.role);
}

export function canManageUsers(session: SessionPayload | null): boolean {
  if (!session) return false;
  return session.role === Role.SYSTEM_ADMIN;
}

export function canDecideOutpass(
  session: SessionPayload | null,
  assignedMentorId: string | null | undefined,
  assignedSraId: string | null | undefined
): { canMentorDecide: boolean; canSraDecide: boolean } {
  if (!session) {
    return { canMentorDecide: false, canSraDecide: false };
  }

  // System Admin and Warden can override for administrative resolution if needed
  const isSuper = session.role === Role.SYSTEM_ADMIN || session.role === Role.WARDEN;

  const canMentorDecide =
    (session.role === Role.MENTOR && session.staffProfileId === assignedMentorId) ||
    isSuper;

  const canSraDecide =
    (session.role === Role.SRA && session.staffProfileId === assignedSraId) ||
    isSuper;

  return { canMentorDecide, canSraDecide };
}
