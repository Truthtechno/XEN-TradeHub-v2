"use server";

import { db } from "@/lib";
import { currentUser } from "@clerk/nextjs/server";

const getAuthStatus = async () => {
    const clerkEnabled = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "") &&
        /^sk_(test|live)_[A-Za-z0-9]+$/.test(process.env.CLERK_SECRET_KEY?.trim() || "");

    if (!clerkEnabled) {
        return { error: "Authentication is not configured" };
    }

    const user = await currentUser();

    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
        return { error: "User not found" };
    }

    let clerkId = user.id;

    const existingUser = await db.user.findFirst({
        where: {
            clerkId,
        },
    });

    console.log("existingUser", existingUser);

    if (!existingUser) {
        await db.user.create({
            data: {
                clerkId,
                email: user.primaryEmailAddress.emailAddress,
                name: user.fullName || user.firstName,
                image: user.imageUrl,
            },
        });
    }

    return { success: true };
};

export default getAuthStatus;
