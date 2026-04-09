import crypto from "crypto";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const getIp = (h: Headers) => {
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
    return h.get("x-real-ip") || "unknown";
};

const hashIp = (ip: string) => crypto.createHash("sha256").update(ip).digest("hex");

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as {
            path?: string;
            deviceType?: string;
            visitSession?: string;
            cookieEnabled?: boolean;
        };
        const h = headers();
        const country = h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || "Unknown";
        const userAgent = h.get("user-agent") || null;
        const ipHash = hashIp(getIp(h));

        await db.siteVisit.create({
            data: {
                path: body.path?.trim() || "/",
                deviceType: body.deviceType?.trim() || "unknown",
                country,
                userAgent,
                ipHash,
                visitSession: body.visitSession?.trim() || null,
                cookieEnabled: typeof body.cookieEnabled === "boolean" ? body.cookieEnabled : null,
            },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false }, { status: 200 });
    }
}
