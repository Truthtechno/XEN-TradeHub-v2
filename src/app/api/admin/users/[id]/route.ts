import { ensureAdmin } from "@/lib/admin-route";
import { isAssignablePortalRole } from "@/lib/portal-assignable-roles";
import { db } from "@/lib/prisma";
import { toPublicPortalUser } from "@/lib/portal-user-public";
import { PortalRole } from "@prisma/client";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = (await req.json()) as { role?: PortalRole; isActive?: boolean };
        if (body.role !== undefined && !isAssignablePortalRole(body.role)) {
            return NextResponse.json({ error: "Role must be User or Admin." }, { status: 400 });
        }
        const updated = await db.portalUser.update({
            where: { id: params.id },
            data: {
                role: body.role,
                isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
            },
        });
        return NextResponse.json(toPublicPortalUser(updated));
    } catch {
        return NextResponse.json({ error: "Unable to update user." }, { status: 400 });
    }
}

export async function DELETE(_: Request, { params }: Ctx) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await db.portalUser.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Unable to remove user." }, { status: 400 });
    }
}
