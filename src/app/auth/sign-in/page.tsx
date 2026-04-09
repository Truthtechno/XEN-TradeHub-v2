import { Icons, SignInForm } from "@/components";
import { ArrowUpRightIcon, CheckCircle2Icon, LockKeyholeIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";

const clerkEnabled = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "");

const trustPoints = [
    "Secure sign-in powered by Clerk",
    "Fast access to your trader dashboard",
    "Encrypted session and data protection",
];

const SignInPage = () => {
    return (
        <main className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(35%_180px_at_50%_0%,theme(colors.white/10),transparent)]" />
            <div className="absolute -top-16 left-1/2 h-48 w-[32rem] -translate-x-1/2 rounded-full bg-yellow-500/15 blur-3xl" />

            <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:px-8 md:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
                <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f1420] to-[#090d16] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:p-8">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/#home" className="inline-flex items-center gap-2">
                            <Icons.logo className="h-6 w-6" />
                            <span className="text-lg font-semibold">XEN TradeHub</span>
                        </Link>
                        <Link
                            href="/#trade-with-us"
                            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Start Trading
                            <ArrowUpRightIcon className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="mt-10 space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/35 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-200">
                            <ShieldCheckIcon className="h-3.5 w-3.5" />
                            Secure Client Access
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                            Welcome back to your <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">trading portal</span>
                        </h1>
                        <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                            Sign in to continue tracking positions, reviewing broker performance, and accessing your strategy updates in one place.
                        </p>
                    </div>

                    <div className="mt-8 space-y-3">
                        {trustPoints.map((point) => (
                            <div
                                key={point}
                                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-3"
                            >
                                <CheckCircle2Icon className="h-4.5 w-4.5 text-yellow-400" />
                                <p className="text-sm text-muted-foreground">{point}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-border/70 bg-background/90 p-6 shadow-xl backdrop-blur-md md:p-8">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <LockKeyholeIcon className="h-4 w-4 text-yellow-400" />
                        Account Sign In
                    </div>

                    {clerkEnabled ? (
                        <SignInForm />
                    ) : (
                        <div className="py-6">
                            <p className="text-sm text-muted-foreground">
                                Authentication is disabled in local mode. Add valid Clerk keys in `.env` to enable sign in.
                            </p>
                        </div>
                    )}

                    <div className="mt-2 border-t border-border/80 pt-5">
                        <p className="text-sm text-muted-foreground">
                            By signing in, you agree to our{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>

                    <div className="mt-6 border-t border-border/80 pt-5">
                        <p className="text-sm text-muted-foreground">
                            New user accounts are created by administrators only.{" "}
                            <Link href="/admin/login" className="text-primary hover:underline">
                                Admin login
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default SignInPage;
