import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { PortalRole } from "@prisma/client";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = (await req.json()) as { role?: PortalRole; isActive?: boolean };
        const updated = await db.portalUser.update({
            where: { id: params.id },
            data: {
                role: body.role,
                isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
            },
        });
        return NextResponse.json(updated);
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
