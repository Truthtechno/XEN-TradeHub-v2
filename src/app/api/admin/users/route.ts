import { ensureAdmin } from "@/lib/admin-route";
import { isAssignablePortalRole } from "@/lib/portal-assignable-roles";
import { db } from "@/lib/prisma";
import { generateTemporaryPassword, hashPortalPassword } from "@/lib/portal-password";
import { toPublicPortalUser } from "@/lib/portal-user-public";
import { PortalRole, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await db.portalUser.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(users.map(toPublicPortalUser));
}

export async function POST(req: Request) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = (await req.json()) as { fullName?: string; email?: string; role?: PortalRole };
        const fullName = body.fullName?.trim();
        const email = body.email?.trim().toLowerCase();
        const role = body.role || PortalRole.USER;
        if (!isAssignablePortalRole(role)) {
            return NextResponse.json({ error: "Role must be User or Admin." }, { status: 400 });
        }

        if (!fullName || !email) {
            return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
        }

        const temporaryPassword = generateTemporaryPassword();
        const passwordHash = await hashPortalPassword(temporaryPassword);

        const created = await db.portalUser.create({
            data: {
                fullName,
                email,
                role,
                passwordHash,
                mustChangePassword: true,
            },
        });

        return NextResponse.json({
            user: toPublicPortalUser(created),
            temporaryPassword,
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
        }
        return NextResponse.json({ error: "Unable to create user." }, { status: 400 });
    }
}
