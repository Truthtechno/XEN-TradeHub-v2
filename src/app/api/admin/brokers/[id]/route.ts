import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
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
            orderIndex?: number;
            benefits?: string[];
        };

        await db.broker.update({
            where: { id: params.id },
            data: {
                name: body.name?.trim(),
                description: body.description?.trim(),
                ctaLabel: body.ctaLabel?.trim(),
                ctaUrl: body.ctaUrl?.trim(),
                logoUrl: body.logoUrl?.trim(),
                highlighted: typeof body.highlighted === "boolean" ? body.highlighted : undefined,
                isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
                orderIndex: typeof body.orderIndex === "number" ? body.orderIndex : undefined,
            },
        });

        if (Array.isArray(body.benefits)) {
            await db.brokerBenefit.deleteMany({ where: { brokerId: params.id } });
            const clean = body.benefits.map((item) => item.trim()).filter(Boolean);
            if (clean.length) {
                await db.brokerBenefit.createMany({
                    data: clean.map((text) => ({ brokerId: params.id, text })),
                });
            }
        }

        const updated = await db.broker.findUnique({
            where: { id: params.id },
            include: { benefits: { orderBy: { createdAt: "asc" } } },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Unable to update broker." }, { status: 400 });
    }
}

export async function DELETE(_: Request, { params }: Ctx) {
    const auth = ensureAdmin();
    if (!auth.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await db.broker.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Unable to delete broker." }, { status: 400 });
    }
}
