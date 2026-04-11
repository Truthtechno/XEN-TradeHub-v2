import {
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken,
} from "@/lib/admin-session";
import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import {
    hashPortalPassword,
    isPasswordStrongEnough,
    portalPasswordMinLength,
    verifyPortalPassword,
} from "@/lib/portal-password";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const portalUserId = auth.session.portalUserId;
    if (!portalUserId) {
        return NextResponse.json(
            { error: "Only portal accounts can use this page. Bootstrap admin has no password rotation here." },
            { status: 400 },
        );
    }

    try {
        const body = (await req.json()) as { currentPassword?: string; newPassword?: string };
        const currentPassword = body.currentPassword?.trim() ?? "";
        const newPassword = body.newPassword?.trim() ?? "";

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Current and new passwords are required." }, { status: 400 });
        }
        if (!isPasswordStrongEnough(newPassword)) {
            return NextResponse.json(
                { error: `New password must be at least ${portalPasswordMinLength} characters.` },
                { status: 400 },
            );
        }

        const user = await db.portalUser.findUnique({ where: { id: portalUserId } });
        if (!user?.passwordHash || !user.isActive) {
            return NextResponse.json({ error: "Account not found or inactive." }, { status: 400 });
        }

        const currentOk = await verifyPortalPassword(currentPassword, user.passwordHash);
        if (!currentOk) {
            return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
        }

        const newHash = await hashPortalPassword(newPassword);

        await db.portalUser.update({
            where: { id: portalUserId },
            data: {
                passwordHash: newHash,
                mustChangePassword: false,
            },
        });

        const token = createAdminSessionToken(user.email, {
            role: user.role,
            portalUserId: user.id,
            mustChangePassword: false,
        });

        const res = NextResponse.json({ success: true });
        res.cookies.set(ADMIN_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        return res;
    } catch {
        return NextResponse.json({ error: "Unable to change password." }, { status: 400 });
    }
}
