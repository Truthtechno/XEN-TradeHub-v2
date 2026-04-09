import { getAdminSession } from "@/lib/admin-session";
import { redirect } from "next/navigation";

const AdminPage = () => {
    const session = getAdminSession();
    if (session) {
        redirect("/admin/dashboard");
    }
    redirect("/admin/login");
};

export default AdminPage;
