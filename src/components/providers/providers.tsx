"use client";

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

const hasValidClerkPublishableKey = () => {
    const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "";
    return /^pk_(test|live)_[A-Za-z0-9]+$/.test(publishable);
};

const Providers = ({ children }: Props) => {

    const client = new QueryClient();
    const clerkEnabled = hasValidClerkPublishableKey();

    return (
        <QueryClientProvider client={client}>
            {clerkEnabled ? (
                <ClerkProvider>
                    {children}
                </ClerkProvider>
            ) : (
                children
            )}
        </QueryClientProvider>
    )
};

export default Providers
