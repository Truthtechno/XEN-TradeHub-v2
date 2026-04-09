import { ensureAdmin } from "@/lib/admin-route";
import { seedDefaultBrokersIfEmpty } from "@/lib/brokers";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = ensureAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await seedDefaultBrokersIfEmpty();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [totalVisits, deviceStats, countryStats, enquiries, users, brokers, recentVisits] = await Promise.all([
            db.siteVisit.count(),
            db.siteVisit.groupBy({
                by: ["deviceType"],
                _count: { _all: true },
                where: { createdAt: { gte: thirtyDaysAgo } },
            }),
            db.siteVisit.groupBy({
                by: ["country"],
                _count: { _all: true },
                where: { createdAt: { gte: thirtyDaysAgo } },
                orderBy: { _count: { country: "desc" } },
                take: 8,
            }),
            db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
            db.portalUser.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
            db.broker.findMany({
                orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
                include: { benefits: { orderBy: { createdAt: "asc" } } },
            }),
            db.siteVisit.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
        ]);

        return NextResponse.json({
            totalVisits,
            deviceStats,
            countryStats,
            enquiries,
            users,
            brokers,
            recentVisits,
        });
    } catch {
        return NextResponse.json({ error: "Database unavailable. Please try again." }, { status: 503 });
    }
}
