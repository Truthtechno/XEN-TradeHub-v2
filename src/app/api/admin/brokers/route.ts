import { ensureAdmin } from "@/lib/admin-route";
import { seedDefaultBrokersIfEmpty } from "@/lib/brokers";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedDefaultBrokersIfEmpty();
    const brokers = await db.broker.findMany({
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
        include: { benefits: { orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json(brokers);
}

export async function POST(req: Request) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = (await req.json()) as {
            name?: string;
            description?: string;
            ctaLabel?: string;
            ctaUrl?: string;
            logoUrl?: string;
            highlighted?: boolean;
            isActive?: boolean;
            benefits?: string[];
        };

        if (!body.name || !body.description || !body.ctaUrl) {
            return NextResponse.json({ error: "Name, description and broker link are required." }, { status: 400 });
        }

        const maxOrder = await db.broker.aggregate({ _max: { orderIndex: true } });
        const created = await db.broker.create({
            data: {
                name: body.name.trim(),
                description: body.description.trim(),
                ctaLabel: body.ctaLabel?.trim() || "Open Account",
                ctaUrl: body.ctaUrl.trim(),
                logoUrl: body.logoUrl?.trim() || null,
                highlighted: Boolean(body.highlighted),
                isActive: body.isActive ?? true,
                orderIndex: (maxOrder._max.orderIndex ?? -1) + 1,
                benefits: {
                    create: (body.benefits || [])
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .map((text) => ({ text })),
                },
            },
            include: { benefits: true },
        });

        return NextResponse.json(created);
    } catch {
        return NextResponse.json({ error: "Unable to create broker." }, { status: 400 });
    }
}
