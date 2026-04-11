"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AdminLoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const payload = (await res.json().catch(() => ({}))) as { error?: string; mustChangePassword?: boolean };

            if (!res.ok) {
                toast.error(payload.error || "Invalid email or password.");
                return;
            }

            if (payload.mustChangePassword) {
                toast.success("Signed in. Choose a permanent password to continue.");
                router.push("/admin/change-password");
            } else {
                toast.success("Signed in successfully.");
                router.push("/admin/dashboard");
            }
            router.refresh();
        } catch {
            toast.error("Unable to sign in right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-background/90 p-6 shadow-xl backdrop-blur-md md:p-8">
                <h1 className="mb-6 text-3xl font-semibold tracking-tight">Sign in</h1>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-400" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <p className="mt-6 text-xs text-muted-foreground">
                    Return to{" "}
                    <Link href="/" className="text-primary hover:underline">
                        home page
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
};

export default AdminLoginPage;
