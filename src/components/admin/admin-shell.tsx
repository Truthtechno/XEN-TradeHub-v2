"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import {
    BarChart3Icon,
    BriefcaseBusinessIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    MailIcon,
    Users2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
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

    const logout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        toast.success("Logged out successfully.");
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
            <aside className="border-r border-white/10 bg-black px-3 py-4">
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
                                    active ? "bg-yellow-500/10 text-yellow-100 border border-yellow-500/30" : "hover:bg-white/[0.03] hover:text-foreground",
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
                    <Button variant="outline" className="mt-3 h-8 w-full" onClick={logout}>
                        <LogOutIcon className="mr-1 h-3.5 w-3.5" />
                        Logout
                    </Button>
                </div>
            </aside>

            <div>
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-background/70 px-4 backdrop-blur-md md:px-6">
                    <p className="text-sm text-muted-foreground">Professional admin operations workspace</p>
                    <div className="hidden text-xs text-muted-foreground md:block">Admin Access</div>
                </header>
                <main className="px-4 py-6 md:px-6">{children}</main>
            </div>
        </div>
    );
};

export default AdminShell;
