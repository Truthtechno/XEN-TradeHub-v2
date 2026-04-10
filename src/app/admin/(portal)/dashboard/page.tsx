"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobeIcon, MailIcon, ShieldCheckIcon, Users2Icon } from "lucide-react";
import { useAdminOverview } from "@/components/admin/use-admin-overview";

const DashboardPage = () => {
    const { data, loading } = useAdminOverview();

    if (loading || !data) {
        return (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-32 rounded-xl" />
                ))}
            </div>
        );
    }

    const openEnquiries = data.enquiries.filter((item) => item.status !== "RESOLVED").length;
    const activeUsers = data.users.filter((item) => item.isActive).length;
    const activeBrokers = data.brokers.filter((item) => item.isActive).length;
    const mobileVisits = data.deviceStats.find((d) => d.deviceType === "mobile")?._count._all || 0;
    const desktopVisits = data.deviceStats.find((d) => d.deviceType === "desktop")?._count._all || 0;
    const tabletVisits = data.deviceStats.find((d) => d.deviceType === "tablet")?._count._all || 0;
    const totalRecent = mobileVisits + desktopVisits + tabletVisits || 1;

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Welcome to your admin command center.</p>
            </section>

            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <Card className="border-white/10 bg-black/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Total Website Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{data.totalVisits}</p>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-black/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Open Enquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <p className="text-3xl font-semibold">{openEnquiries}</p>
                        <MailIcon className="h-5 w-5 text-yellow-300" />
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-black/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <p className="text-3xl font-semibold">{activeUsers}</p>
                        <Users2Icon className="h-5 w-5 text-yellow-300" />
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-black/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Active Brokers</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <p className="text-3xl font-semibold">{activeBrokers}</p>
                        <ShieldCheckIcon className="h-5 w-5 text-yellow-300" />
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-white/10 bg-black/40">
                    <CardHeader>
                        <CardTitle>Traffic by Device (Last 30 days)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span>Desktop</span>
                                <span>{desktopVisits}</span>
                            </div>
                            <Progress value={(desktopVisits / totalRecent) * 100} />
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span>Mobile</span>
                                <span>{mobileVisits}</span>
                            </div>
                            <Progress value={(mobileVisits / totalRecent) * 100} />
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span>Tablet</span>
                                <span>{tabletVisits}</span>
                            </div>
                            <Progress value={(tabletVisits / totalRecent) * 100} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40">
                    <CardHeader>
                        <CardTitle>Top Countries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data.countryStats.length ? (
                            data.countryStats.map((country) => (
                                <div key={country.country || "Unknown"} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>{country.country || "Unknown"}</span>
                                    </div>
                                    <span>{country._count._all}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No geo data available yet.</p>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default DashboardPage;
