"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const getDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
    if (/mobi|android|iphone|ipod/.test(ua)) return "mobile";
    return "desktop";
};

const VISIT_SESSION_COOKIE = "xen_visit_session";

const getVisitSession = () => {
    const existing = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${VISIT_SESSION_COOKIE}=`))
        ?.split("=")[1];
    if (existing) return existing;

    const sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    document.cookie = `${VISIT_SESSION_COOKIE}=${sessionId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    return sessionId;
};

const VisitTracker = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;
        const run = async () => {
            try {
                await fetch("/api/visits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        path: pathname,
                        deviceType: getDeviceType(),
                        visitSession: getVisitSession(),
                        cookieEnabled: navigator.cookieEnabled,
                    }),
                });
            } catch {
                // Intentionally ignored to avoid impacting UX.
            }
        };
        void run();
    }, [pathname]);

    return null;
};

export default VisitTracker;
