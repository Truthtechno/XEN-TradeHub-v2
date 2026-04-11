"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminOverview } from "./types";

const OVERVIEW_FETCH_MS = 30_000;

export const useAdminOverview = () => {
    const [data, setData] = useState<AdminOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), OVERVIEW_FETCH_MS);
        try {
            const res = await fetch("/api/admin/overview", {
                cache: "no-store",
                signal: controller.signal,
            });
            if (!res.ok) {
                const payload = (await res.json().catch(() => ({}))) as { error?: string };
                if (res.status === 401) {
                    setError("Session expired or unauthorized. Please sign in again.");
                } else {
                    setError(payload?.error || "Unable to load admin data.");
                }
                return null;
            }
            const payload = (await res.json()) as AdminOverview;
            setData(payload);
            return payload;
        } catch (e) {
            const aborted = e instanceof Error && e.name === "AbortError";
            setError(aborted ? "Request timed out. Check your network and database, then retry." : "Unable to load admin data.");
            return null;
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return { data, loading, error, reload: load };
};
