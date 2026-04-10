"use client";

import { EnquiryStatus } from "@/components/admin/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ChevronDownIcon, ClockIcon, InboxIcon, Loader2Icon, MailIcon, SearchIcon, SlidersHorizontalIcon, UserIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type EnquiryRecord = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: EnquiryStatus;
    createdAt: string;
};

type EnquiriesPayload = {
    enquiries?: EnquiryRecord[];
    nextCursor?: string | null;
    total?: number;
    error?: string;
};

const PAGE_SIZE = 40;
const STATUS_FILTER = ["ALL", "NEW", "IN_PROGRESS", "RESOLVED"] as const;
type StatusFilter = (typeof STATUS_FILTER)[number];
const PERIOD_FILTER = ["ALL", "TODAY", "WEEK", "MONTH", "YEAR"] as const;
type PeriodFilter = (typeof PERIOD_FILTER)[number];
const SORT_FILTER = ["NEWEST", "OLDEST"] as const;
type SortFilter = (typeof SORT_FILTER)[number];

const STATUS_LABEL: Record<EnquiryStatus, string> = {
    NEW: "New",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
};

const PERIOD_LABEL: Record<PeriodFilter, string> = {
    ALL: "All time",
    TODAY: "Date (Today)",
    WEEK: "This week",
    MONTH: "This month",
    YEAR: "This year",
};

function statusBadgeClass(status: EnquiryStatus) {
    switch (status) {
        case "NEW":
            return "border-amber-500/40 bg-amber-500/10 text-amber-200";
        case "IN_PROGRESS":
            return "border-sky-500/35 bg-sky-500/10 text-sky-200";
        case "RESOLVED":
            return "border-emerald-500/35 bg-emerald-500/10 text-emerald-200";
        default:
            return "";
    }
}

const EnquiryDetail = ({
    enquiry,
    onStatusChange,
}: {
    enquiry: EnquiryRecord;
    onStatusChange: (status: EnquiryStatus) => void;
}) => (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-black/30">
        <div className="shrink-0 border-b border-white/10 bg-black/40 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                    <h2 className="text-lg font-semibold leading-tight tracking-tight">{enquiry.subject || "(No subject)"}</h2>
                    <p className="text-xs text-muted-foreground">
                        Received{" "}
                        {(() => {
                            try {
                                return format(parseISO(enquiry.createdAt), "PPpp");
                            } catch {
                                return enquiry.createdAt;
                            }
                        })()}
                    </p>
                </div>
                <div className="shrink-0 sm:pt-0.5">
                    <Select value={enquiry.status} onValueChange={onStatusChange}>
                        <SelectTrigger className="h-9 w-full border-white/15 bg-black/50 sm:w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        <ScrollArea className="min-h-[320px] flex-1 lg:min-h-0">
            <div className="space-y-6 p-5">
                <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <UserIcon className="h-3.5 w-3.5" />
                        Contact
                    </h3>
                    <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-2">
                        <div>
                            <p className="text-[11px] uppercase text-muted-foreground">Name</p>
                            <p className="mt-0.5 text-sm">{enquiry.firstName} {enquiry.lastName}</p>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase text-muted-foreground">Email</p>
                            <a href={`mailto:${enquiry.email}`} className="mt-0.5 block break-all text-sm text-amber-200/90 underline-offset-2 hover:underline">
                                {enquiry.email}
                            </a>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-[11px] uppercase text-muted-foreground">Phone</p>
                            <p className="mt-0.5 text-sm">{enquiry.phone || "—"}</p>
                        </div>
                    </div>
                </div>

                <Separator className="bg-white/10" />

                <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <MailIcon className="h-3.5 w-3.5" />
                        Message
                    </h3>
                    <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/95">{enquiry.message}</p>
                    </div>
                </div>
            </div>
        </ScrollArea>
    </div>
);

export const EnquiriesInbox = () => {
    const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("ALL");
    const [sortFilter, setSortFilter] = useState<SortFilter>("NEWEST");
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [totalMatches, setTotalMatches] = useState(0);
    const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const loadEnquiries = useCallback(
        async (opts?: { reset?: boolean }) => {
            const reset = opts?.reset ?? false;
            if (reset) {
                setLoading(true);
                setError(null);
            } else {
                if (!nextCursor) return;
                setLoadingMore(true);
            }

            try {
                const params = new URLSearchParams();
                params.set("limit", String(PAGE_SIZE));
                params.set("sort", sortFilter);
                params.set("period", periodFilter);
                if (!reset && nextCursor) params.set("cursor", nextCursor);
                if (searchQuery) params.set("q", searchQuery);
                if (statusFilter !== "ALL") params.set("status", statusFilter);

                const res = await fetch(`/api/admin/enquiries?${params.toString()}`, { cache: "no-store" });
                const payload = (await res.json().catch(() => ({}))) as EnquiriesPayload;

                if (!res.ok) {
                    setError(payload.error || "Unable to load enquiries.");
                    if (reset) setEnquiries([]);
                    return;
                }

                const page = payload.enquiries || [];
                setEnquiries((prev) => {
                    if (reset) return page;
                    const seen = new Set(prev.map((row) => row.id));
                    const merged = [...prev];
                    for (const row of page) {
                        if (!seen.has(row.id)) merged.push(row);
                    }
                    return merged;
                });
                setNextCursor(payload.nextCursor ?? null);
                setTotalMatches(payload.total ?? page.length);
            } catch {
                setError("Unable to load enquiries.");
                if (reset) setEnquiries([]);
            } finally {
                if (reset) setLoading(false);
                setLoadingMore(false);
            }
        },
        [nextCursor, periodFilter, searchQuery, sortFilter, statusFilter],
    );

    useEffect(() => {
        const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), 320);
        return () => window.clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        void loadEnquiries({ reset: true });
    }, [loadEnquiries, searchQuery, statusFilter, periodFilter, sortFilter]);

    useEffect(() => {
        if (!enquiries.length) {
            setSelectedId(null);
            return;
        }
        setSelectedId((prev) => (prev && enquiries.some((e) => e.id === prev) ? prev : enquiries[0].id));
    }, [enquiries]);

    const selected = useMemo(() => enquiries.find((e) => e.id === selectedId) ?? null, [enquiries, selectedId]);

    const handleStatusChange = async (enquiryId: string, status: EnquiryStatus) => {
        const previous = enquiries;
        setEnquiries((prev) => prev.map((item) => (item.id === enquiryId ? { ...item, status } : item)));
        try {
            const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error();
        } catch {
            setEnquiries(previous);
            toast.error("Unable to update enquiry status.");
        }
    };

    const openDetail = (id: string) => {
        setSelectedId(id);
        if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
            setMobileDetailOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-[70dvh] rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button type="button" variant="outline" className="mt-4" onClick={() => void loadEnquiries({ reset: true })}>
                    Try again
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] shadow-sm lg:min-h-[min(760px,calc(100dvh-10.5rem))] lg:flex-row">
                <div className="flex min-h-0 min-w-0 flex-col lg:w-[min(100%,440px)] lg:shrink-0 lg:border-r lg:border-white/10">
                    <div className="shrink-0 space-y-3 border-b border-white/10 bg-black/40 p-4">
                        <div className="relative">
                            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, subject..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="border-white/10 bg-black/50 pl-9"
                            />
                        </div>

                        {/* Mobile: collapsible filters under search */}
                        <div className="lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen((v) => !v)}
                                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-foreground transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontalIcon className="h-4 w-4" />
                                    Filters
                                    <span className="text-xs text-muted-foreground/80">
                                        · {PERIOD_LABEL[periodFilter]} · {sortFilter === "NEWEST" ? "Newest" : "Oldest"}
                                    </span>
                                </span>
                                <ChevronDownIcon className={cn("h-4 w-4 transition-transform", mobileFiltersOpen ? "rotate-180" : "rotate-0")} />
                            </button>

                            {mobileFiltersOpen ? (
                                <div className="mt-2 grid gap-2 rounded-lg border border-white/10 bg-black/40 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-muted-foreground">Period</span>
                                        <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
                                            <SelectTrigger className="h-8 w-[190px] border-white/15 bg-black/50 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PERIOD_FILTER.map((key) => (
                                                    <SelectItem key={key} value={key}>{PERIOD_LABEL[key]}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-muted-foreground">Sort</span>
                                        <Select value={sortFilter} onValueChange={(v) => setSortFilter(v as SortFilter)}>
                                            <SelectTrigger className="h-8 w-[190px] border-white/15 bg-black/50 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NEWEST">Newest first</SelectItem>
                                                <SelectItem value="OLDEST">Oldest first</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Desktop/tablet: inline filters */}
                        <div className="hidden gap-2 sm:grid-cols-2 lg:grid">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontalIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Period</span>
                                <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
                                    <SelectTrigger className="h-8 border-white/15 bg-black/50 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PERIOD_FILTER.map((key) => (
                                            <SelectItem key={key} value={key}>{PERIOD_LABEL[key]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Sort</span>
                                <Select value={sortFilter} onValueChange={(v) => setSortFilter(v as SortFilter)}>
                                    <SelectTrigger className="h-8 border-white/15 bg-black/50 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NEWEST">Newest first</SelectItem>
                                        <SelectItem value="OLDEST">Oldest first</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {STATUS_FILTER.map((key) => {
                                const label = key === "ALL" ? "All" : STATUS_LABEL[key as EnquiryStatus];
                                const active = statusFilter === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setStatusFilter(key)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                                            active
                                                ? "border-amber-500/50 bg-amber-500/10 text-amber-100"
                                                : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/15 hover:text-foreground",
                                        )}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <ScrollArea className="flex-1 min-h-[58dvh] lg:min-h-0">
                        <div className="space-y-1 p-2">
                            {enquiries.length ? (
                                enquiries.map((e) => {
                                    const active = e.id === selectedId;
                                    const snippet = e.message.replace(/\s+/g, " ").trim().slice(0, 110);
                                    let relative = "";
                                    try {
                                        relative = formatDistanceToNow(parseISO(e.createdAt), { addSuffix: true });
                                    } catch {
                                        relative = "";
                                    }
                                    return (
                                        <button
                                            key={e.id}
                                            type="button"
                                            onClick={() => openDetail(e.id)}
                                            className={cn(
                                                "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                                                active
                                                    ? "border-amber-500/40 bg-amber-500/[0.07] shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]"
                                                    : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]",
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="line-clamp-1 font-medium text-foreground">{e.subject || "(No subject)"}</p>
                                                <Badge variant="outline" className={cn("shrink-0 border text-[10px]", statusBadgeClass(e.status))}>
                                                    {STATUS_LABEL[e.status]}
                                                </Badge>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{snippet}{e.message.length > 110 ? "..." : ""}</p>
                                            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                                                <span className="truncate">{e.firstName} {e.lastName}</span>
                                                {relative ? (
                                                    <>
                                                        <span className="text-white/20">·</span>
                                                        <span className="inline-flex shrink-0 items-center gap-0.5">
                                                            <ClockIcon className="h-3 w-3" />
                                                            {relative}
                                                        </span>
                                                    </>
                                                ) : null}
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                                    <InboxIcon className="h-10 w-10 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">No enquiries found for this filter.</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchInput("");
                                            setSearchQuery("");
                                            setStatusFilter("ALL");
                                            setPeriodFilter("ALL");
                                            setSortFilter("NEWEST");
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="shrink-0 border-t border-white/10 bg-black/30 px-4 py-2.5 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between gap-3">
                            <span>
                                Showing <span className="font-medium text-foreground">{enquiries.length}</span>
                                {nextCursor ? "+" : ""} of{" "}
                                <span className="font-medium text-foreground">{totalMatches}</span>
                            </span>
                            {nextCursor ? (
                                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => void loadEnquiries()} disabled={loadingMore}>
                                    {loadingMore ? <Loader2Icon className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
                                    Load more
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="hidden min-h-0 min-w-0 flex-1 lg:flex">
                    {selected ? (
                        <EnquiryDetail enquiry={selected} onStatusChange={(status) => void handleStatusChange(selected.id, status)} />
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
                            <MailIcon className="h-12 w-12 text-muted-foreground/35" />
                            <div>
                                <p className="font-medium text-foreground">No enquiry selected</p>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">Choose an enquiry from the list to read and update status.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
                <SheetContent side="right" className="w-[100vw] max-w-none border-l border-white/10 bg-background/95 p-0 backdrop-blur-md sm:w-[92vw]">
                    <SheetTitle className="sr-only">Enquiry details</SheetTitle>
                    <SheetDescription className="sr-only">Review and update the selected enquiry.</SheetDescription>
                    {selected ? (
                        <EnquiryDetail enquiry={selected} onStatusChange={(status) => void handleStatusChange(selected.id, status)} />
                    ) : (
                        <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">Select an enquiry from the inbox list.</div>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
