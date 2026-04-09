import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = ensureAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const enquiries = await db.enquiry.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json({ enquiries });
    } catch {
        return NextResponse.json({ error: "Unable to load enquiries." }, { status: 503 });
    }
}
