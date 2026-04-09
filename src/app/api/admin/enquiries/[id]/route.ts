import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { EnquiryStatus } from "@prisma/client";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = (await req.json()) as { status?: EnquiryStatus };
        if (!body.status) return NextResponse.json({ error: "Status is required." }, { status: 400 });

        const updated = await db.enquiry.update({
            where: { id: params.id },
            data: { status: body.status },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Unable to update enquiry." }, { status: 400 });
    }
}
