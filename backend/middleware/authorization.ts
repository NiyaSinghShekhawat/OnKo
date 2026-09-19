import type { AuthUser, UserRole } from "../types/auth";

export function requireRole(
  user: AuthUser | null,
  allowedRoles: UserRole[],
): AuthUser {
  if (!user) {
    throw new Error("Authentication required.");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("You are not authorized to perform this action.");
  }

  return user;
}
