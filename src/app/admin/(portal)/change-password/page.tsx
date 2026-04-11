"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PORTAL_PASSWORD_MIN_LENGTH } from "@/lib/portal-password-constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AdminChangePasswordPage = () => {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirm) {
            toast.error("New passwords do not match.");
            return;
        }
        if (newPassword.length < PORTAL_PASSWORD_MIN_LENGTH) {
            toast.error(`New password must be at least ${PORTAL_PASSWORD_MIN_LENGTH} characters.`);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const payload = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                toast.error(payload.error || "Could not update password.");
                return;
            }
            toast.success("Password updated. You are signed in with your new password.");
            router.push("/admin/dashboard");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Create a new password</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    You signed in with a temporary password. Enter it once more, then choose a permanent password you will use from
                    now on.
                </p>
            </section>

            <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="space-y-2">
                    <Label htmlFor="current">Temporary / current password</Label>
                    <Input
                        id="current"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new">New password</Label>
                    <Input
                        id="new"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={`At least ${PORTAL_PASSWORD_MIN_LENGTH} characters`}
                        required
                        minLength={PORTAL_PASSWORD_MIN_LENGTH}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm new password</Label>
                    <Input
                        id="confirm"
                        type="password"
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        minLength={PORTAL_PASSWORD_MIN_LENGTH}
                    />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-400" disabled={loading}>
                    {loading ? "Saving…" : "Save new password"}
                </Button>
            </form>
        </div>
    );
};

export default AdminChangePasswordPage;
