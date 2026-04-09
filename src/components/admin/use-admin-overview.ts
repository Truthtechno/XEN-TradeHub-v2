"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminOverview } from "./types";

export const useAdminOverview = () => {
    const [data, setData] = useState<AdminOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/overview", { cache: "no-store" });
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                setError(payload?.error || "Unable to load admin data.");
                setLoading(false);
                return null;
            }
            const payload = (await res.json()) as AdminOverview;
            setData(payload);
            setLoading(false);
            return payload;
        } catch {
            setError("Unable to load admin data.");
            setLoading(false);
            return null;
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return { data, loading, error, reload: load };
};
