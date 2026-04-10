import { ensureAdmin } from "@/lib/admin-route";
import { db } from "@/lib/prisma";
import { EnquiryStatus } from "@prisma/client";
import { startOfDay, subDays, subYears } from "date-fns";
import { NextResponse } from "next/server";

const VALID_STATUS = new Set<EnquiryStatus>(["NEW", "IN_PROGRESS", "RESOLVED"]);
const VALID_PERIOD = new Set(["TODAY", "WEEK", "MONTH", "YEAR", "ALL"]);
const VALID_SORT = new Set(["NEWEST", "OLDEST"]);

export async function GET(req: Request) {
    const auth = ensureAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim() || "";
        const cursor = searchParams.get("cursor") || undefined;
        const requestedStatus = searchParams.get("status");
        const status = requestedStatus && VALID_STATUS.has(requestedStatus as EnquiryStatus)
            ? (requestedStatus as EnquiryStatus)
            : undefined;
        const requestedPeriod = searchParams.get("period") || "ALL";
        const period = VALID_PERIOD.has(requestedPeriod) ? requestedPeriod : "ALL";
        const requestedSort = searchParams.get("sort") || "NEWEST";
        const sort = VALID_SORT.has(requestedSort) ? requestedSort : "NEWEST";
        const requestedLimit = Number(searchParams.get("limit") || 40);
        const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 10), 100) : 40;
        const now = new Date();
        const periodStart = (() => {
            switch (period) {
                case "TODAY":
                    return startOfDay(now);
                case "WEEK":
                    return subDays(now, 7);
                case "MONTH":
                    return subDays(now, 30);
                case "YEAR":
                    return subYears(now, 1);
                default:
                    return undefined;
            }
        })();

        const where = {
            ...(status ? { status } : {}),
            ...(periodStart ? { createdAt: { gte: periodStart } } : {}),
            ...(query
                ? {
                    OR: [
                        { firstName: { contains: query, mode: "insensitive" as const } },
                        { lastName: { contains: query, mode: "insensitive" as const } },
                        { email: { contains: query, mode: "insensitive" as const } },
                        { subject: { contains: query, mode: "insensitive" as const } },
                        { message: { contains: query, mode: "insensitive" as const } },
                    ],
                }
                : {}),
        };

        const enquiries = await db.enquiry.findMany({
            where,
            orderBy: sort === "OLDEST"
                ? [{ createdAt: "asc" }, { id: "asc" }]
                : [{ createdAt: "desc" }, { id: "desc" }],
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        });

        const total = await db.enquiry.count({ where });

        const hasMore = enquiries.length > limit;
        const page = hasMore ? enquiries.slice(0, limit) : enquiries;
        const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null;

        return NextResponse.json({ enquiries: page, nextCursor, total });
    } catch {
        return NextResponse.json({ error: "Unable to load enquiries." }, { status: 503 });
    }
}
