import AdminShell from "@/components/admin/admin-shell";
import { MustChangePasswordGuard } from "@/components/admin/must-change-password-guard";
import { getAdminSession } from "@/lib/admin-session";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

const AdminPortalLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = getAdminSession();
    if (!session) {
        redirect("/admin/login");
    }

    let mustChangePassword = false;
    if (session.portalUserId) {
        const row = await db.portalUser.findUnique({
            where: { id: session.portalUserId },
            select: { mustChangePassword: true, isActive: true },
        });
        if (!row?.isActive) {
            redirect("/admin/login");
        }
        mustChangePassword = Boolean(row?.mustChangePassword);
    }

    return (
        <AdminShell>
            <MustChangePasswordGuard mustChangePassword={mustChangePassword}>{children}</MustChangePasswordGuard>
        </AdminShell>
    );
};

export default AdminPortalLayout;
