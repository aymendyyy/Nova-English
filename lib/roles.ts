// Pure helpers (safe to import from both server and client components).
export type Role = "member" | "organizer" | "admin";

export const ROLE_LEVEL: Record<Role, number> = {
  member: 1,
  organizer: 2,
  admin: 3,
};

export const ROLE_LABEL: Record<Role, string> = {
  member: "Member",
  organizer: "Organizer",
  admin: "Admin",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in ROLE_LEVEL;
}

export function hasMinRole(role: Role, min: Role): boolean {
  return ROLE_LEVEL[role] >= ROLE_LEVEL[min];
}
