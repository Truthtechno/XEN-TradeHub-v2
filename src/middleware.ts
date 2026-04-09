import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasValidClerkKeys = () => {
    const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "";
    const secret = process.env.CLERK_SECRET_KEY?.trim() || "";

    return /^pk_(test|live)_[A-Za-z0-9]+$/.test(publishable) && /^sk_(test|live)_[A-Za-z0-9]+$/.test(secret);
};

const authMiddleware = clerkMiddleware((auth, req) => {
    const url = req.nextUrl.pathname;

    const { userId } = auth();

    // Protect /dashboard and sub-routes
    if (!userId && url.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    // Redirect authenticated users away from auth routes
    if (userId && (url.startsWith("/auth/sign-in") || url.startsWith("/auth/sign-up"))) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
});

export default function middleware(req: Request) {
    if (!hasValidClerkKeys()) {
        const url = new URL(req.url).pathname;

        if (url.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    }

    return authMiddleware(req as any);
}

export const config = {
    matcher: [
        "/((?!.*\\..*|_next).*)",
        "/(api|trpc)(.*)",
        "/dashboard(.*)",
        "/",
        "/auth/sign-in",
        "/auth/sign-up",
    ],
};