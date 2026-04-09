import AdminShell from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin-session";
import { redirect } from "next/navigation";
import React from "react";

const AdminPortalLayout = ({ children }: { children: React.ReactNode }) => {
    const session = getAdminSession();
    if (!session) {
        redirect("/admin/login");
    }

    return <AdminShell>{children}</AdminShell>;
};

export default AdminPortalLayout;
