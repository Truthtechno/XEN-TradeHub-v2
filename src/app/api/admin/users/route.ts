import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { PortalRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await db.portalUser.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = (await req.json()) as { fullName?: string; email?: string; role?: PortalRole };
        const fullName = body.fullName?.trim();
        const email = body.email?.trim().toLowerCase();
        const role = body.role || PortalRole.USER;

        if (!fullName || !email) {
            return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
        }

        const created = await db.portalUser.create({
            data: { fullName, email, role },
        });

        return NextResponse.json(created);
    } catch {
        return NextResponse.json({ error: "Unable to create user." }, { status: 400 });
    }
}
