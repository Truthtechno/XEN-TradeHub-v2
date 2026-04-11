"use client";

import { PortalRole } from "@/components/admin/types";
import { useAdminOverview } from "@/components/admin/use-admin-overview";
import { ASSIGNABLE_PORTAL_ROLE_OPTIONS } from "@/lib/portal-assignable-roles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyRoundIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TempPasswordResponse = {
    temporaryPassword?: string;
    error?: string;
};

function PortalRoleSelectItems({ currentRole }: { currentRole?: PortalRole }) {
    const legacy =
        currentRole === "MANAGER" || currentRole === "ANALYST" ? currentRole : null;
    return (
        <>
            {legacy === "MANAGER" ? <SelectItem value="MANAGER">Manager</SelectItem> : null}
            {legacy === "ANALYST" ? <SelectItem value="ANALYST">Analyst</SelectItem> : null}
            {ASSIGNABLE_PORTAL_ROLE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                    {label}
                </SelectItem>
            ))}
        </>
    );
}

const UsersPage = () => {
    const { data, loading, error, reload } = useAdminOverview();
    const [form, setForm] = useState({ fullName: "", email: "", role: "USER" as PortalRole });
    const [saving, setSaving] = useState(false);
    const [tempDialog, setTempDialog] = useState<{ open: boolean; title: string; password: string; hint: string }>({
        open: false,
        title: "",
        password: "",
        hint: "",
    });

    const showTempPassword = (title: string, password: string, hint: string) => {
        setTempDialog({ open: true, title, password, hint });
    };

    const copyTempPassword = async () => {
        try {
            await navigator.clipboard.writeText(tempDialog.password);
            toast.success("Copied to clipboard.");
        } catch {
            toast.error("Could not copy — select the password and copy manually.");
        }
    };

    const addUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: form.fullName,
                email: form.email,
                role: form.role,
            }),
        });
        const payload = (await res.json()) as TempPasswordResponse;
        if (!res.ok) {
            toast.error(payload.error || "Failed to add user");
            setSaving(false);
            return;
        }
        if (payload.temporaryPassword) {
            showTempPassword(
                "Temporary password",
                payload.temporaryPassword,
                "Copy and send this to the user securely. After they sign in, they must create a new password before using the admin portal.",
            );
            toast.success("User created — copy the temporary password from the dialog.");
        } else {
            toast.success("User created.");
        }
        setForm({ fullName: "", email: "", role: "USER" });
        await reload();
        setSaving(false);
    };

    const issueTemporaryPassword = async (userId: string) => {
        const res = await fetch(`/api/admin/users/${userId}/temporary-password`, { method: "POST" });
        const payload = (await res.json()) as TempPasswordResponse;
        if (!res.ok) {
            toast.error(payload.error || "Could not reset password");
            return;
        }
        if (payload.temporaryPassword) {
            showTempPassword(
                "New temporary password",
                payload.temporaryPassword,
                "Share this with the user. Their old password no longer works. They will choose a new password after signing in.",
            );
            toast.success("Temporary password ready — copy from the dialog.");
        }
        await reload();
    };

    if (loading && !data) {
        return <Skeleton className="h-[420px] rounded-xl" />;
    }

    if (!data) {
        return (
            <Card className="border-red-500/40 bg-black/40">
                <CardHeader>
                    <CardTitle>Unable to load users</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{error || "Please try again in a moment."}</p>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => void reload()}>Retry</Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/login">Sign in again</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            <Dialog open={tempDialog.open} onOpenChange={(open) => setTempDialog((s) => ({ ...s, open }))}>
                <DialogContent className="border-white/10 bg-background/95 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{tempDialog.title}</DialogTitle>
                        <DialogDescription>{tempDialog.hint}</DialogDescription>
                    </DialogHeader>
                    <Input
                        readOnly
                        value={tempDialog.password}
                        className="font-mono text-sm tracking-wide"
                        onFocus={(e) => e.target.select()}
                    />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => void copyTempPassword()}>
                            Copy password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Users & Roles</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    New users receive a random temporary password to share manually. After first sign-in they are required to set a
                    permanent password. Forgot-password requests: issue a new temporary password here (automated email can be
                    added later).
                </p>
            </section>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={addUser}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_minmax(8rem,10rem)_auto] lg:items-end"
                    >
                        <Input
                            placeholder="Full name"
                            value={form.fullName}
                            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                            required
                            className="min-h-10"
                        />
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                            className="min-h-10"
                        />
                        <Select value={form.role} onValueChange={(value: PortalRole) => setForm((prev) => ({ ...prev, role: value }))}>
                            <SelectTrigger className="min-h-10 w-full">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <PortalRoleSelectItems />
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={saving} className="min-h-10 w-full shrink-0 lg:w-auto">
                            {saving ? "Creating..." : "Create User"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/40">
                <CardHeader className="space-y-1 pb-2">
                    <CardTitle>User Directory</CardTitle>
                    <p className="text-sm font-normal text-muted-foreground">
                        Manage roles, access, and password recovery for portal accounts.
                    </p>
                </CardHeader>
                <CardContent className="space-y-0 px-2 pb-4 pt-0 sm:px-6">
                    {data.users.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">No users yet. Create one above.</p>
                    ) : (
                        <>
                            {/* Mobile: stacked cards */}
                            <div className="space-y-3 md:hidden">
                                {data.users.map((user) => {
                                    const accessHint = !user.hasPassword
                                        ? "No password set"
                                        : user.mustChangePassword
                                          ? "Must set new password after next sign-in"
                                          : "Ready to sign in";
                                    return (
                                        <div
                                            key={user.id}
                                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium leading-tight">{user.fullName}</p>
                                                    <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        user.isActive
                                                            ? "shrink-0 border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                                                            : "shrink-0 border-white/20 text-muted-foreground"
                                                    }
                                                >
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Role
                                                </label>
                                                <Select
                                                    value={user.role}
                                                    onValueChange={async (value: PortalRole) => {
                                                        await fetch(`/api/admin/users/${user.id}`, {
                                                            method: "PATCH",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ role: value }),
                                                        });
                                                        await reload();
                                                    }}
                                                >
                                                    <SelectTrigger className="h-10 w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <PortalRoleSelectItems currentRole={user.role} />
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <p className="mt-3 text-xs text-muted-foreground">{accessHint}</p>
                                            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                                                <Button
                                                    type="button"
                                                    variant={user.isActive ? "subtle" : "outline"}
                                                    className="h-10 w-full justify-center"
                                                    onClick={async () => {
                                                        await fetch(`/api/admin/users/${user.id}`, {
                                                            method: "PATCH",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ isActive: !user.isActive }),
                                                        });
                                                        await reload();
                                                    }}
                                                >
                                                    {user.isActive ? "Deactivate account" : "Activate account"}
                                                </Button>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="h-10 gap-2 border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:text-amber-100"
                                                        onClick={() => void issueTemporaryPassword(user.id)}
                                                    >
                                                        <KeyRoundIcon className="h-4 w-4 shrink-0" aria-hidden />
                                                        <span className="truncate text-xs font-medium sm:text-sm">Temp password</span>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="h-10 gap-2 border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                                                        onClick={async () => {
                                                            await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
                                                            await reload();
                                                        }}
                                                    >
                                                        <Trash2Icon className="h-4 w-4 shrink-0" aria-hidden />
                                                        <span className="truncate text-xs font-medium sm:text-sm">Remove</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tablet / desktop: table */}
                            <div className="hidden md:block md:overflow-x-auto md:rounded-lg md:border md:border-white/10">
                                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/[0.04] text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            <th className="whitespace-nowrap px-4 py-3">User</th>
                                            <th className="whitespace-nowrap px-4 py-3">Role</th>
                                            <th className="whitespace-nowrap px-4 py-3">Status</th>
                                            <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.users.map((user) => {
                                            const accessHint = !user.hasPassword
                                                ? "No password"
                                                : user.mustChangePassword
                                                  ? "Password change required"
                                                  : "Signed in ready";
                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.02]"
                                                >
                                                    <td className="align-middle px-4 py-3">
                                                        <p className="font-medium leading-tight">{user.fullName}</p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
                                                    </td>
                                                    <td className="align-middle px-4 py-3">
                                                        <Select
                                                            value={user.role}
                                                            onValueChange={async (value: PortalRole) => {
                                                                await fetch(`/api/admin/users/${user.id}`, {
                                                                    method: "PATCH",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({ role: value }),
                                                                });
                                                                await reload();
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-9 w-[min(100%,11rem)]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <PortalRoleSelectItems currentRole={user.role} />
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="align-middle px-4 py-3">
                                                        <div className="flex flex-col gap-1.5">
                                                            <Button
                                                                type="button"
                                                                variant={user.isActive ? "subtle" : "outline"}
                                                                className="h-8 w-fit min-w-[5.5rem] px-3 text-xs"
                                                                onClick={async () => {
                                                                    await fetch(`/api/admin/users/${user.id}`, {
                                                                        method: "PATCH",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ isActive: !user.isActive }),
                                                                    });
                                                                    await reload();
                                                                }}
                                                            >
                                                                {user.isActive ? "Active" : "Inactive"}
                                                            </Button>
                                                            <span className="max-w-[12rem] text-xs leading-snug text-muted-foreground">
                                                                {accessHint}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="align-middle px-4 py-3">
                                                        <div className="flex flex-wrap items-center justify-end gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-9 gap-1.5 px-2 text-amber-200 hover:bg-amber-500/10 hover:text-amber-100"
                                                                title="Issue a temporary password (forgot password)"
                                                                onClick={() => void issueTemporaryPassword(user.id)}
                                                            >
                                                                <KeyRoundIcon className="h-4 w-4" aria-hidden />
                                                                <span className="hidden lg:inline">Temp password</span>
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-9 gap-1.5 px-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                                                title="Delete user"
                                                                onClick={async () => {
                                                                    await fetch(`/api/admin/users/${user.id}`, {
                                                                        method: "DELETE",
                                                                    });
                                                                    await reload();
                                                                }}
                                                            >
                                                                <Trash2Icon className="h-4 w-4" aria-hidden />
                                                                <span className="hidden lg:inline">Remove</span>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersPage;
