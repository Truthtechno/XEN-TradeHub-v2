import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { generateTemporaryPassword, hashPortalPassword } from "@/lib/portal-password";
import { toPublicPortalUser } from "@/lib/portal-user-public";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** Admin issues a new random password; user must change it after next sign-in. */
export async function POST(_req: Request, { params }: Ctx) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const user = await db.portalUser.findUnique({ where: { id: params.id } });
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        if (!user.isActive) {
            return NextResponse.json({ error: "Cannot reset password for an inactive user." }, { status: 400 });
        }

        const temporaryPassword = generateTemporaryPassword();
        const passwordHash = await hashPortalPassword(temporaryPassword);

        const updated = await db.portalUser.update({
            where: { id: user.id },
            data: {
                passwordHash,
                mustChangePassword: true,
            },
        });

        return NextResponse.json({
            user: toPublicPortalUser(updated),
            temporaryPassword,
        });
    } catch {
        return NextResponse.json({ error: "Unable to reset password." }, { status: 400 });
    }
}
