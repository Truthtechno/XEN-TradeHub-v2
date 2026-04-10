"use client";

import { PortalRole } from "@/components/admin/types";
import { useAdminOverview } from "@/components/admin/use-admin-overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const UsersPage = () => {
    const { data, loading, reload } = useAdminOverview();
    const [form, setForm] = useState({ fullName: "", email: "", role: "USER" as PortalRole });
    const [saving, setSaving] = useState(false);

    const addUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (!res.ok) {
            const payload = await res.json();
            toast.error(payload.error || "Failed to add user");
            setSaving(false);
            return;
        }
        toast.success("User created.");
        setForm({ fullName: "", email: "", role: "USER" });
        await reload();
        setSaving(false);
    };

    if (loading || !data) {
        return <Skeleton className="h-[420px] rounded-xl" />;
    }

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Users & Roles</h1>
                <p className="mt-1 text-sm text-muted-foreground">Create and manage internal user access levels.</p>
            </section>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addUser} className="grid gap-3 md:grid-cols-4">
                        <Input
                            placeholder="Full name"
                            value={form.fullName}
                            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                        />
                        <Select value={form.role} onValueChange={(value: PortalRole) => setForm((prev) => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="ANALYST">Analyst</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button disabled={saving}>{saving ? "Creating..." : "Create User"}</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>User Directory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {data.users.map((user) => (
                        <div key={user.id} className="grid gap-2 rounded-md border border-white/10 bg-white/[0.02] p-3 md:grid-cols-[1.2fr_1.2fr_0.8fr_0.8fr_auto]">
                            <p className="text-sm">{user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
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
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                    <SelectItem value="ANALYST">Analyst</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant={user.isActive ? "subtle" : "outline"}
                                className="h-8"
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
                            <Button
                                variant="ghost"
                                className="h-8 text-red-400 hover:text-red-300"
                                onClick={async () => {
                                    await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
                                    await reload();
                                }}
                            >
                                <Trash2Icon className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersPage;
