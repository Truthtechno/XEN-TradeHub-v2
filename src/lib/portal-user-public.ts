import type { PortalUser } from "@prisma/client";

/** Strip secrets before returning portal users from APIs. */
export const toPublicPortalUser = (user: PortalUser) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    hasPassword: Boolean(user.passwordHash),
    mustChangePassword: user.mustChangePassword,
});
