import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
    return res;
}
