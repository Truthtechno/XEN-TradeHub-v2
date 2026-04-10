"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/utils";
import {
    BarChart3Icon,
    BriefcaseBusinessIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    MailIcon,
    Menu,
    Users2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/admin/analytics", label: "Metrics & Graphs", icon: BarChart3Icon },
    { href: "/admin/users", label: "Users & Roles", icon: Users2Icon },
    { href: "/admin/enquiries", label: "Enquiries Inbox", icon: MailIcon },
    { href: "/admin/brokers", label: "Trade With Us", icon: BriefcaseBusinessIcon },
];

const AdminShell = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const logout = async () => {
        setMobileNavOpen(false);
        await fetch("/api/admin/logout", { method: "POST" });
        toast.success("Logged out successfully.");
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-black/95 px-4 backdrop-blur-md lg:hidden">
                <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-2" onClick={() => setMobileNavOpen(false)}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-1.5">
                        <Image src="/icons/logo.svg" alt="" width={28} height={28} priority />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight">XEN TradeHub</p>
                        <p className="text-xs text-muted-foreground">Admin Portal</p>
                    </div>
                </Link>
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Open menu">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-[min(100vw-1.5rem,22rem)] border-l border-border/40 bg-background/95 p-0 backdrop-blur-md"
                    >
                        <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                        <div className="flex h-full max-h-[100dvh] flex-col overflow-y-auto px-4 pb-8 pt-12">
                            <Link
                                href="/admin/dashboard"
                                className="mb-6 flex items-center gap-2 rounded-lg px-1 py-2"
                                onClick={() => setMobileNavOpen(false)}
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl p-2">
                                    <Image src="/icons/logo.svg" alt="XEN TradeHub logo" width={36} height={36} priority />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">XEN TradeHub</p>
                                    <p className="text-xs text-muted-foreground">Admin Portal</p>
                                </div>
                            </Link>

                            <nav className="space-y-1.5">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileNavOpen(false)}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors",
                                                active
                                                    ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-100"
                                                    : "hover:bg-white/[0.03] hover:text-foreground",
                                            )}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                                <p className="text-sm font-medium">Administration</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Use dedicated pages to manage users, brokers, traffic insights, and enquiries.
                                </p>
                                <Button variant="outline" className="mt-3 h-8 w-full" onClick={() => void logout()}>
                                    <LogOutIcon className="mr-1 h-3.5 w-3.5" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </header>

            <div className="grid min-h-0 max-lg:min-h-[calc(100dvh-3.5rem)] grid-cols-1 lg:min-h-screen lg:grid-cols-[260px_1fr]">
                <aside className="hidden flex-col border-r border-white/10 bg-black px-3 py-4 lg:flex">
                    <Link href="/admin/dashboard" className="mb-6 flex items-center gap-2 rounded-lg px-3 py-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl p-2">
                            <Image src="/icons/logo.svg" alt="XEN TradeHub logo" width={36} height={36} priority />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">XEN TradeHub</p>
                            <p className="text-xs text-muted-foreground">Admin Portal</p>
                        </div>
                    </Link>

                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors",
                                        active
                                            ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-100"
                                            : "hover:bg-white/[0.03] hover:text-foreground",
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-sm font-medium">Administration</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Use dedicated pages to manage users, brokers, traffic insights, and enquiries.
                        </p>
                        <Button variant="outline" className="mt-3 h-8 w-full" onClick={() => void logout()}>
                            <LogOutIcon className="mr-1 h-3.5 w-3.5" />
                            Logout
                        </Button>
                    </div>
                </aside>

                <div className="min-w-0">
                    <header className="sticky top-14 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-background/70 px-4 backdrop-blur-md md:px-6 lg:top-0">
                        <p className="text-sm text-muted-foreground">Professional admin operations workspace</p>
                        <div className="hidden text-xs text-muted-foreground md:block">Admin Access</div>
                    </header>
                    <main className="px-4 py-6 md:px-6">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default AdminShell;
