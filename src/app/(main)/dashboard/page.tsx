"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from 'react'
import { useClerk } from "@clerk/nextjs";

const clerkEnabled = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "");

const DashboardPage = () => {

    const router = useRouter();

    if (!clerkEnabled) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-xl font-medium">Authentication not configured</h1>
                <p className="text-gray-500 mt-2">Set valid Clerk keys in `.env` to use the dashboard.</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <Button onClick={() => router.push("/")} variant="outline">
                        Back to home
                    </Button>
                </div>
            </div>
        );
    }

    return <DashboardWithClerk />;
};

const DashboardWithClerk = () => {
    const router = useRouter();
    const { user, signOut } = useClerk();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-medium">
                Welcome {user?.firstName}!
            </h1>
            <p className="text-gray-500 mt-2">
                You are signed in.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
                <Button onClick={() => router.push("/")} variant="outline">
                    Back to home
                </Button>
                <Button onClick={() => signOut()}>
                    Sign Out
                </Button>
            </div>
        </div>
    )
};

export default DashboardPage
