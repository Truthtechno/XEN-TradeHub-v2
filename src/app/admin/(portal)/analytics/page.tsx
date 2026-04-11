"use client";

import { useCallback, useEffect, useState } from "react";
import { LandingVisitsTrendChart } from "@/components/admin/landing-visits-trend-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type TrendPoint = { date: string; count: number };
type CountGroup = { _count: { _all: number } };
type DeviceGroup = CountGroup & { deviceType: string };
type CountryGroup = CountGroup & { country: string | null };
type CookieGroup = CountGroup & { cookieEnabled: boolean | null };

type AnalyticsPayload = {
    landing: {
        totalVisitsLast30: number;
        uniqueVisitorsLast30: number;
        visitsTrend14Days: TrendPoint[];
        deviceStats: DeviceGroup[];
        countryStats: CountryGroup[];
        cookieStats: CookieGroup[];
        recentVisits: {
            id: string;
            createdAt: string;
            deviceType: string;
            country: string | null;
            ipHash: string | null;
            visitSession: string | null;
            cookieEnabled: boolean | null;
        }[];
    };
    backendAccess: {
        totalUsers: number;
        totalAdminUsers: number;
        totalLoginsLast30: number;
        loginsByEmail: Record<string, number>;
        recentLogins: {
            id: string;
            email: string;
            role: string | null;
            ipAddress: string | null;
            ipHash: string | null;
            country: string | null;
            deviceType: string | null;
            userAgent: string | null;
            createdAt: string;
        }[];
    };
};

const AnalyticsPage = () => {
    const [data, setData] = useState<AnalyticsPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        try {
            const res = await fetch("/api/admin/analytics", { cache: "no-store", signal: controller.signal });
            const payload = (await res.json().catch(() => ({}))) as AnalyticsPayload & { error?: string };
            if (!res.ok) {
                setError(payload.error || "Unable to load analytics data.");
                setData(null);
                return;
            }
            setData(payload);
        } catch (error) {
            if ((error as { name?: string })?.name === "AbortError") {
                setError("Analytics request timed out. Please retry.");
            } else {
                setError("Unable to load analytics data.");
            }
            setData(null);
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadAnalytics();
    }, [loadAnalytics]);

    if (loading) {
        return <Skeleton className="h-[420px] rounded-xl" />;
    }

    if (error || !data) {
        return (
            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Unable to load metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{error || "Please try again."}</p>
                    <Button type="button" variant="outline" onClick={() => void loadAnalytics()}>
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const cookieYes = data.landing.cookieStats.find((s) => s.cookieEnabled === true)?._count._all || 0;
    const cookieNo = data.landing.cookieStats.find((s) => s.cookieEnabled === false)?._count._all || 0;
    const cookieUnknown = data.landing.cookieStats.find((s) => s.cookieEnabled === null)?._count._all || 0;
    const loginRows = Object.entries(data.backendAccess.loginsByEmail).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Metrics & Graphs</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Landing page traffic intelligence and backend admin access audit logs.
                </p>
            </section>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card className="border-white/10 bg-black/40 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Landing Visits (30d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{data.landing.totalVisitsLast30}</p>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-black/40 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Unique Visitors (30d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{data.landing.uniqueVisitorsLast30}</p>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-black/40 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Portal Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{data.backendAccess.totalUsers}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{data.backendAccess.totalAdminUsers} admin users</p>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-black/40 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Admin Logins (30d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{data.backendAccess.totalLoginsLast30}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Landing Visits Trend (Last 14 days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-white/10 bg-gradient-to-b from-black/50 to-black/80 p-2 sm:p-4">
                        <LandingVisitsTrendChart points={data.landing.visitsTrend14Days} />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Tracks only the marketing landing page path (`/`).</p>
                </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-3">
                <Card className="border-white/10 bg-black/40">
                    <CardHeader>
                        <CardTitle>Landing Visit Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="min-h-0 max-h-[min(50vh,28rem)] space-y-2 overflow-y-auto overscroll-contain pr-1">
                            {data.landing.recentVisits.map((visit) => (
                                <div key={visit.id} className="grid grid-cols-[1fr_0.8fr_0.8fr] gap-2 rounded-md bg-white/[0.03] px-3 py-2 text-sm">
                                    <span className="truncate text-muted-foreground">{new Date(visit.createdAt).toLocaleString()}</span>
                                    <span className="capitalize text-muted-foreground">{visit.deviceType}</span>
                                    <span className="truncate text-muted-foreground">{visit.country || "Unknown"}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40">
                    <CardHeader>
                        <CardTitle>Cookie Signal (Landing, 30d)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { label: "Cookies Enabled", count: cookieYes },
                            { label: "Cookies Disabled", count: cookieNo },
                            { label: "Unknown", count: cookieUnknown },
                        ].map((row) => {
                            const total = Math.max(cookieYes + cookieNo + cookieUnknown, 1);
                            const pct = (row.count / total) * 100;
                            return (
                                <div key={row.label}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span>{row.label}</span>
                                        <span>{row.count}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/10">
                                        <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40">
                    <CardHeader>
                        <CardTitle>Top Admin Logins (30d)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {loginRows.length ? (
                            loginRows.map(([email, count]) => (
                                <div key={email} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2 text-sm">
                                    <span className="truncate">{email}</span>
                                    <span className="text-muted-foreground">{count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No backend login activity recorded yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Backend Login Audit Trail</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.backendAccess.recentLogins.length ? (
                        <div className="max-h-[15rem] space-y-2 overflow-y-auto pr-1">
                            {data.backendAccess.recentLogins.map((event) => (
                                <div
                                    key={event.id}
                                    className="grid gap-2 rounded-md bg-white/[0.03] px-3 py-2 text-xs text-muted-foreground md:grid-cols-[1.2fr_1fr_0.7fr_0.7fr_1fr]"
                                >
                                    <span className="truncate">{event.email}</span>
                                    <span>{new Date(event.createdAt).toLocaleString()}</span>
                                    <span className="capitalize">{event.deviceType || "unknown"}</span>
                                    <span>{event.country || "Unknown"}</span>
                                    <span className="truncate">{event.ipAddress || event.ipHash || "N/A"}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No login events yet.</p>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-white/10 bg-black/40">
                    <CardHeader>
                        <CardTitle>Landing Device Mix (30d)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data.landing.deviceStats.map((row) => (
                            <div key={row.deviceType} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2 text-sm">
                                <span className="capitalize">{row.deviceType}</span>
                                <span className="text-muted-foreground">{row._count._all}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40">
                    <CardHeader>
                        <CardTitle>Landing Top Locations (30d)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data.landing.countryStats.map((row) => (
                            <div key={row.country || "unknown"} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2 text-sm">
                                <span>{row.country || "Unknown"}</span>
                                <span className="text-muted-foreground">{row._count._all}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
