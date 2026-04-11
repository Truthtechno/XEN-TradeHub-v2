import {
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken,
    getAdminCredentials,
} from "@/lib/admin-session";
import { db } from "@/lib/prisma";
import { verifyPortalPassword } from "@/lib/portal-password";
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
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        const admin = getAdminCredentials();
        const headers = req.headers;
        const ipAddress = getIp(headers);
        const userAgent = headers.get("user-agent") || "";
        const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "Unknown";

        const logLogin = async (logEmail: string, role: string) => {
            try {
                await db.adminLoginEvent.create({
                    data: {
                        email: logEmail,
                        role,
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
        };

        // Portal lookup must not block bootstrap login if DB is down or schema is behind migrations.
        let portal: Awaited<ReturnType<typeof db.portalUser.findUnique>> = null;
        try {
            portal = await db.portalUser.findUnique({ where: { email } });
        } catch (err) {
            console.error("[admin/login] portalUser lookup failed (check DATABASE_URL and prisma migrate deploy):", err);
        }

        if (portal?.isActive && portal.passwordHash) {
            const ok = await verifyPortalPassword(password, portal.passwordHash);
            if (ok) {
                await logLogin(portal.email, portal.role);
                const token = createAdminSessionToken(portal.email, {
                    role: portal.role,
                    portalUserId: portal.id,
                    mustChangePassword: portal.mustChangePassword,
                });
                const res = NextResponse.json({
                    success: true,
                    mustChangePassword: portal.mustChangePassword,
                });
                res.cookies.set(ADMIN_SESSION_COOKIE, token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7,
                    path: "/",
                });
                return res;
            }
        }

        if (portal?.isActive && !portal.passwordHash) {
            return NextResponse.json(
                {
                    error:
                        "No password is set for this account. Ask an admin to issue a temporary password from Users & Roles.",
                },
                { status: 401 },
            );
        }

        if (email === admin.email?.trim().toLowerCase() && password === admin.password) {
            await logLogin(admin.email, "ADMIN");
            const token = createAdminSessionToken(admin.email, { role: "ADMIN" });
            const res = NextResponse.json({ success: true, mustChangePassword: false });
            res.cookies.set(ADMIN_SESSION_COOKIE, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });
            return res;
        }

        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    } catch {
        return NextResponse.json({ error: "Unable to process login request." }, { status: 400 });
    }
}
