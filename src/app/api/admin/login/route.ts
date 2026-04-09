import { createAdminSessionToken, getAdminCredentials, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

const getIp = (h: Headers) => {
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
    return h.get("x-real-ip") || "unknown";
};

const getDeviceType = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
    if (/mobi|android|iphone|ipod/.test(ua)) return "mobile";
    return "desktop";
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as { email?: string; password?: string };
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();
        const admin = getAdminCredentials();

        if (email !== admin.email || password !== admin.password) {
            return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
        }

        const token = createAdminSessionToken(admin.email);
        const headers = req.headers;
        const ipAddress = getIp(headers);
        const userAgent = headers.get("user-agent") || "";
        const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "Unknown";

        try {
            await db.adminLoginEvent.create({
                data: {
                    email: admin.email,
                    role: "ADMIN",
                    ipAddress,
                    ipHash: createHash("sha256").update(ipAddress).digest("hex"),
                    country,
                    deviceType: getDeviceType(userAgent),
                    userAgent: userAgent || null,
                },
            });
        } catch {
            // Do not block valid login if audit insert fails.
        }

        const res = NextResponse.json({ success: true });
        res.cookies.set(ADMIN_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        return res;
    } catch {
        return NextResponse.json({ error: "Unable to process login request." }, { status: 400 });
    }
}
