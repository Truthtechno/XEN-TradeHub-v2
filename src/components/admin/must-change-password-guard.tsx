"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
    mustChangePassword: boolean;
    children: React.ReactNode;
};

export const MustChangePasswordGuard = ({ mustChangePassword, children }: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!mustChangePassword) return;
        if (pathname === "/admin/change-password") return;
        router.replace("/admin/change-password");
    }, [mustChangePassword, pathname, router]);

    return <>{children}</>;
};
