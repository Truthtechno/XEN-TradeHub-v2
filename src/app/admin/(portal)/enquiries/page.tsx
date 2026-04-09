"use client";

import { EnquiryStatus } from "@/components/admin/types";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type EnquiryRecord = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: EnquiryStatus;
};

const EnquiriesPage = () => {
    const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEnquiries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/enquiries", { cache: "no-store" });
            const payload = (await res.json().catch(() => ({}))) as { enquiries?: EnquiryRecord[]; error?: string };

            if (!res.ok) {
                setError(payload.error || "Unable to load enquiries.");
                setEnquiries([]);
                return;
            }

            setEnquiries(payload.enquiries || []);
        } catch {
            setError("Unable to load enquiries.");
            setEnquiries([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadEnquiries();
    }, [loadEnquiries]);

    if (loading) {
        return <Skeleton className="h-[420px] rounded-xl" />;
    }

    if (error) {
        return (
            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Unable to load enquiries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button type="button" variant="outline" onClick={() => void loadEnquiries()}>
                        Try again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Enquiries Inbox</h1>
                <p className="mt-1 text-sm text-muted-foreground">Review and process incoming website enquiries.</p>
            </section>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>All Enquiries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {enquiries.length ? (
                        enquiries.map((enquiry) => (
                            <div key={enquiry.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <p className="font-medium">{enquiry.subject}</p>
                                        <div className="text-sm text-muted-foreground">
                                            <p>{enquiry.firstName} {enquiry.lastName}</p>
                                            <p className="break-all">{enquiry.email}</p>
                                            <p>{enquiry.phone || "Phone not provided (legacy enquiry)"}</p>
                                        </div>
                                    </div>
                                    <Select
                                        value={enquiry.status}
                                        onValueChange={async (value: EnquiryStatus) => {
                                            await fetch(`/api/admin/enquiries/${enquiry.id}`, {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ status: value }),
                                            });
                                            await loadEnquiries();
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEW">New</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <p className="mt-3 text-sm">{enquiry.message}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EnquiriesPage;
