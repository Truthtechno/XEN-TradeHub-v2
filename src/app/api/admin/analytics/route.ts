import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

const LANDING_PATH = "/";

const getDateKey = (date: Date) => date.toISOString().slice(0, 10);

export async function GET() {
    const auth = ensureAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = Date.now();
        const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        const [
            landingVisitsLast30,
            landingVisitsLast14,
            landingDeviceStats,
            landingCountryStats,
            landingCookieStats,
            recentLandingVisits,
            totalUsers,
            totalAdminUsers,
        ] = await Promise.all([
            db.siteVisit.count({
                where: { path: LANDING_PATH, createdAt: { gte: thirtyDaysAgo } },
            }),
            db.siteVisit.findMany({
                where: { path: LANDING_PATH, createdAt: { gte: fourteenDaysAgo } },
                select: { createdAt: true },
                orderBy: { createdAt: "asc" },
            }),
            db.siteVisit.groupBy({
                by: ["deviceType"],
                where: { path: LANDING_PATH, createdAt: { gte: thirtyDaysAgo } },
                _count: { _all: true },
                orderBy: { _count: { deviceType: "desc" } },
            }),
            db.siteVisit.groupBy({
                by: ["country"],
                where: { path: LANDING_PATH, createdAt: { gte: thirtyDaysAgo } },
                _count: { _all: true },
                orderBy: { _count: { country: "desc" } },
                take: 8,
            }),
            db.siteVisit.groupBy({
                by: ["cookieEnabled"],
                where: { path: LANDING_PATH, createdAt: { gte: thirtyDaysAgo } },
                _count: { _all: true },
            }),
            db.siteVisit.findMany({
                where: { path: LANDING_PATH },
                orderBy: { createdAt: "desc" },
                take: 20,
                select: {
                    id: true,
                    createdAt: true,
                    deviceType: true,
                    country: true,
                    ipHash: true,
                    visitSession: true,
                    cookieEnabled: true,
                },
            }),
            db.portalUser.count(),
            db.portalUser.count({ where: { role: "ADMIN" } }),
        ]);

        const [loginEventsLast30, recentLoginEvents, uniqueLandingVisitors] = await Promise.all([
            db.adminLoginEvent
                .findMany({
                    where: { createdAt: { gte: thirtyDaysAgo } },
                    orderBy: { createdAt: "desc" },
                })
                .catch(() => []),
            db.adminLoginEvent
                .findMany({
                    orderBy: { createdAt: "desc" },
                    take: 30,
                })
                .catch(() => []),
            db.siteVisit
                .findMany({
                    where: { path: LANDING_PATH, createdAt: { gte: thirtyDaysAgo }, ipHash: { not: null } },
                    distinct: ["ipHash"],
                    select: { ipHash: true },
                })
                .catch(() => []),
        ]);

        const bucketMap = new Map<string, number>();
        for (let idx = 13; idx >= 0; idx -= 1) {
            const d = new Date();
            d.setDate(d.getDate() - idx);
            bucketMap.set(getDateKey(d), 0);
        }
        for (const item of landingVisitsLast14) {
            const key = getDateKey(item.createdAt);
            if (bucketMap.has(key)) {
                bucketMap.set(key, (bucketMap.get(key) || 0) + 1);
            }
        }

        const loginsByEmail = loginEventsLast30.reduce<Record<string, number>>((acc, event) => {
            acc[event.email] = (acc[event.email] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            landing: {
                totalVisitsLast30: landingVisitsLast30,
                uniqueVisitorsLast30: uniqueLandingVisitors.filter((v) => v.ipHash).length,
                visitsTrend14Days: Array.from(bucketMap.entries()).map(([date, count]) => ({ date, count })),
                deviceStats: landingDeviceStats,
                countryStats: landingCountryStats,
                cookieStats: landingCookieStats,
                recentVisits: recentLandingVisits,
            },
            backendAccess: {
                totalUsers,
                totalAdminUsers,
                totalLoginsLast30: loginEventsLast30.length,
                loginsByEmail,
                recentLogins: recentLoginEvents,
            },
        });
    } catch {
        return NextResponse.json({ error: "Unable to load analytics data." }, { status: 503 });
    }
}
