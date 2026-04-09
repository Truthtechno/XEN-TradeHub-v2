"use client";

import { getAuthStatus } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const clerkEnabled = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "");

const AuthCallbackPage = () => {

    const router = useRouter();

    useEffect(() => {
        if (!clerkEnabled) {
            router.push("/");
        }
    }, [router]);

    const { data } = useQuery({
        queryKey: ["auth-status"],
        queryFn: async () => await getAuthStatus(),
        enabled: clerkEnabled,
        retry: true,
        retryDelay: 500,
    });

    if (data?.success) {
        router.push("/dashboard");
    }

    return (
        <div className="flex items-center justify-center flex-col h-screen relative">
            <div className="border-[3px] border-neutral-800 rounded-full border-b-neutral-200 animate-loading w-8 h-8"></div>
            <p className="text-lg font-medium text-center mt-3">
                Verifying your account...
            </p>
        </div>
    )
};

export default AuthCallbackPage;