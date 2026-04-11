import { PortalRole } from "@prisma/client";

/** Roles that can be chosen when creating or editing portal users in the admin UI. */
export const ASSIGNABLE_PORTAL_ROLES: PortalRole[] = [PortalRole.USER, PortalRole.ADMIN];

export function isAssignablePortalRole(role: PortalRole): boolean {
    return ASSIGNABLE_PORTAL_ROLES.includes(role);
}

export const ASSIGNABLE_PORTAL_ROLE_OPTIONS: { value: PortalRole; label: string }[] = [
    { value: PortalRole.USER, label: "User" },
    { value: PortalRole.ADMIN, label: "Admin" },
];
