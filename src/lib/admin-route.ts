import { getAdminSession } from "./admin-session";

export const ensureAdmin = () => {
    const session = getAdminSession();
    if (!session) {
        return { authorized: false as const };
    }
    return { authorized: true as const, session };
};
