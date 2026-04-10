"use client";

import { useAdminOverview } from "@/components/admin/use-admin-overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpRightIcon, MoreHorizontalIcon, PencilIcon, StarIcon, Trash2Icon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const emptyForm = {
    name: "",
    description: "",
    ctaLabel: "Open Account",
    ctaUrl: "",
    logoUrl: "",
    highlighted: false,
    isActive: true,
    benefits: "",
};

const BrokersPage = () => {
    const { data, loading, error, reload } = useAdminOverview();
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dragBrokerId, setDragBrokerId] = useState<string | null>(null);

    const editingBroker = useMemo(
        () => data?.brokers.find((broker) => broker.id === editingId) || null,
        [data?.brokers, editingId],
    );

    const sortedBrokers = useMemo(
        () => [...(data?.brokers || [])].sort((a, b) => a.orderIndex - b.orderIndex),
        [data?.brokers],
    );

    const toDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const getImageSize = (file: File) =>
        new Promise<{ width: number; height: number }>((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new window.Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
                URL.revokeObjectURL(url);
            };
            img.onerror = () => {
                reject(new Error("Invalid image file."));
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });

    const onLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            toast.error("Logo must be less than 1MB.");
            e.target.value = "";
            return;
        }

        const { width, height } = await getImageSize(file);
        if (width !== height) {
            toast.error("Logo must be a square image (same width and height).");
            e.target.value = "";
            return;
        }

        const dataUrl = await toDataUrl(file);
        setForm((prev) => ({ ...prev, logoUrl: dataUrl }));
        toast.success("Logo uploaded.");
        e.target.value = "";
    };

    const startEdit = (broker: (typeof sortedBrokers)[number]) => {
        setEditingId(broker.id);
        setForm({
            name: broker.name,
            description: broker.description,
            ctaLabel: broker.ctaLabel,
            ctaUrl: broker.ctaUrl,
            logoUrl: broker.logoUrl || "",
            highlighted: broker.highlighted,
            isActive: broker.isActive,
            benefits: broker.benefits.map((item) => item.text).join("\n"),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const moveBroker = async (brokerId: string, direction: "up" | "down") => {
        const list = sortedBrokers;
        const currentIndex = list.findIndex((item) => item.id === brokerId);
        if (currentIndex === -1) return;
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= list.length) return;

        const current = list[currentIndex];
        const target = list[targetIndex];

        await fetch(`/api/admin/brokers/${current.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderIndex: target.orderIndex }),
        });
        await fetch(`/api/admin/brokers/${target.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderIndex: current.orderIndex }),
        });

        await reload();
    };

    const reorderBrokers = async (sourceId: string, targetId: string) => {
        if (sourceId === targetId) return;
        const list = sortedBrokers;
        const sourceIdx = list.findIndex((item) => item.id === sourceId);
        const targetIdx = list.findIndex((item) => item.id === targetId);
        if (sourceIdx === -1 || targetIdx === -1) return;

        const reordered = [...list];
        const [moved] = reordered.splice(sourceIdx, 1);
        reordered.splice(targetIdx, 0, moved);

        await Promise.all(
            reordered.map((item, idx) =>
                fetch(`/api/admin/brokers/${item.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderIndex: idx }),
                }),
            ),
        );
        await reload();
    };

    const togglePriority = async (brokerId: string, highlighted: boolean) => {
        await fetch(`/api/admin/brokers/${brokerId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ highlighted: !highlighted }),
        });
        await reload();
    };

    const deleteBroker = async (brokerId: string) => {
        await fetch(`/api/admin/brokers/${brokerId}`, { method: "DELETE" });
        await reload();
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...form,
            benefits: form.benefits
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
        };
        const url = editingId ? `/api/admin/brokers/${editingId}` : "/api/admin/brokers";
        const method = editingId ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json();
            toast.error(err.error || "Unable to save broker.");
            setSaving(false);
            return;
        }

        toast.success(editingId ? "Broker updated." : "Broker created.");
        setForm(emptyForm);
        setEditingId(null);
        await reload();
        setSaving(false);
    };

    if (loading && !data) {
        return <div className="h-40 animate-pulse rounded-xl bg-white/[0.04]" />;
    }

    if (!data) {
        return (
            <Card className="border-red-500/40 bg-black/40">
                <CardHeader>
                    <CardTitle>Unable to load broker data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error || "Please try again in a moment."}</p>
                    <Button className="mt-3" onClick={() => void reload()}>Retry</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            {error && (
                <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100">
                    {error}
                </div>
            )}
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Trade With Us Management</h1>
                <p className="mt-1 text-sm text-muted-foreground">Add, edit, and control broker cards displayed on the home page.</p>
            </section>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>{editingBroker ? `Edit Broker: ${editingBroker.name}` : "Add New Broker"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Broker Name</Label>
                            <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo Upload (square, under 1MB)</Label>
                            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()}>
                                    <UploadIcon className="mr-1 h-4 w-4" />
                                    Upload Logo
                                </Button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onLogoUpload} />
                                {form.logoUrl ? <span className="text-xs text-emerald-300">Logo ready</span> : <span className="text-xs text-muted-foreground">No file selected</span>}
                            </div>
                            <p className="text-xs text-muted-foreground">Tip: you can also paste a logo URL below.</p>
                            <Input value={form.logoUrl} onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))} placeholder="https://... or uploaded image value" />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA Label</Label>
                            <Input value={form.ctaLabel} onChange={(e) => setForm((prev) => ({ ...prev, ctaLabel: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA URL</Label>
                            <Input value={form.ctaUrl} onChange={(e) => setForm((prev) => ({ ...prev, ctaUrl: e.target.value }))} required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Benefits (one per line)</Label>
                            <Textarea value={form.benefits} onChange={(e) => setForm((prev) => ({ ...prev, benefits: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
                            <Button type="button" variant={form.highlighted ? "primary" : "outline"} className="w-full" onClick={() => setForm((prev) => ({ ...prev, highlighted: !prev.highlighted }))}>
                                {form.highlighted ? "Priority Enabled" : "Set Priority (Gold Border)"}
                            </Button>
                            <Button type="button" variant={form.isActive ? "primary" : "outline"} className="w-full" onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}>
                                {form.isActive ? "Active" : "Inactive"}
                            </Button>
                            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : editingBroker ? "Save Changes" : "Add Broker"}</Button>
                            {editingBroker && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setForm(emptyForm);
                                        setEditingId(null);
                                    }}
                                >
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Broker Directory (Edit, Order, Priority)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {sortedBrokers.map((broker, index) => (
                        <div
                            key={broker.id}
                            draggable
                            onDragStart={() => setDragBrokerId(broker.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={async () => {
                                if (!dragBrokerId) return;
                                await reorderBrokers(dragBrokerId, broker.id);
                                setDragBrokerId(null);
                            }}
                            className="rounded-md border border-white/10 bg-white/[0.02] p-3"
                        >
                            <div className="min-w-0">
                                <p className="font-medium">{broker.name}</p>
                                <p className="text-xs text-muted-foreground break-all">
                                    {broker.ctaUrl} - Position {index + 1} - Drag to reorder
                                </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2 sm:mt-2">
                                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                                    <Button variant="outline" className="h-8 w-full sm:w-auto" disabled={index === 0} onClick={() => void moveBroker(broker.id, "up")}>
                                        <ArrowUpIcon className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="outline" className="h-8 w-full sm:w-auto" disabled={index === sortedBrokers.length - 1} onClick={() => void moveBroker(broker.id, "down")}>
                                        <ArrowDownIcon className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                <div className="sm:hidden">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="h-8 w-8 p-0" aria-label="More actions">
                                                <MoreHorizontalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem onClick={() => void togglePriority(broker.id, broker.highlighted)}>
                                                <StarIcon className="mr-2 h-3.5 w-3.5" />
                                                {broker.highlighted ? "Remove Priority" : "Set Priority"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => startEdit(broker)}>
                                                <PencilIcon className="mr-2 h-3.5 w-3.5" />
                                                Edit Broker
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-400 focus:text-red-300"
                                                onClick={() => void deleteBroker(broker.id)}
                                            >
                                                <Trash2Icon className="mr-2 h-3.5 w-3.5" />
                                                Delete Broker
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="mt-2 hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                                <Button
                                    variant={broker.highlighted ? "primary" : "outline"}
                                    className="h-8 w-full sm:w-auto"
                                    onClick={() => void togglePriority(broker.id, broker.highlighted)}
                                >
                                    <StarIcon className="mr-1 h-3.5 w-3.5" />
                                    {broker.highlighted ? "Priority" : "Set Priority"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-full sm:w-auto"
                                    onClick={() => startEdit(broker)}
                                >
                                    <PencilIcon className="mr-1 h-3.5 w-3.5" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-full sm:w-auto text-red-400 hover:text-red-300"
                                    onClick={() => void deleteBroker(broker.id)}
                                >
                                    <Trash2Icon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle>Homepage Preview (Live Broker Cards)</CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedBrokers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No brokers yet. Add a broker above and it will appear here exactly as on the homepage.
                        </p>
                    ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
                        {sortedBrokers.map((broker) => (
                            <div
                                key={broker.id}
                                draggable
                                onDragStart={() => setDragBrokerId(broker.id)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={async () => {
                                    if (!dragBrokerId) return;
                                    await reorderBrokers(dragBrokerId, broker.id);
                                    setDragBrokerId(null);
                                }}
                                className={`rounded-xl border p-5 md:p-6 bg-gradient-to-b from-[#0e1118] to-[#06080f] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] ${
                                    broker.highlighted
                                        ? "border-yellow-500/70 shadow-[0_0_0_1px_rgba(245,158,11,0.4)]"
                                        : "border-white/10"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    {broker.logoUrl ? (
                                        <div className="relative size-12 overflow-hidden rounded-md border border-white/10 bg-white">
                                            <Image src={broker.logoUrl} alt={broker.name} fill className="object-contain p-1" />
                                        </div>
                                    ) : (
                                        <div className="size-12 rounded-md bg-white text-black font-semibold flex items-center justify-center text-sm">
                                            {broker.name}
                                        </div>
                                    )}
                                    <span
                                        className={`text-xs font-medium px-3 py-1 rounded-full border ${
                                            broker.highlighted
                                                ? "border-yellow-400/50 text-yellow-300 bg-yellow-500/10"
                                                : "border-white/15 text-white/80 bg-white/5"
                                        }`}
                                    >
                                        Trusted Partner
                                    </span>
                                </div>
                                <h3 className="mt-5 text-2xl font-semibold text-foreground">{broker.name}</h3>
                                <p className="mt-3 min-h-[84px] text-sm leading-6 text-muted-foreground">{broker.description}</p>
                                <div className="mt-5">
                                    <p className="mb-3 text-sm font-medium text-foreground">Key Benefits:</p>
                                    <ul className="space-y-2">
                                        {broker.benefits.map((benefit) => (
                                            <li key={benefit.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="size-4 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-[10px] text-yellow-400 flex items-center justify-center">
                                                    ✓
                                                </span>
                                                {benefit.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    className={`w-full mt-6 ${
                                        broker.highlighted
                                            ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                                            : "bg-white hover:bg-white/90 text-black"
                                    }`}
                                    asChild
                                >
                                    <a href={broker.ctaUrl} target="_blank" rel="noopener noreferrer">
                                        <span className="flex items-center gap-2">
                                            <ArrowUpRightIcon className="size-4" />
                                            {broker.ctaLabel}
                                        </span>
                                    </a>
                                </Button>
                                <div className="mt-3 flex items-center gap-2">
                                    <Button variant="outline" className="h-8 flex-1" onClick={() => startEdit(broker)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline" className="h-8" onClick={() => void moveBroker(broker.id, "up")}>
                                        <ArrowUpIcon className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="outline" className="h-8" onClick={() => void moveBroker(broker.id, "down")}>
                                        <ArrowDownIcon className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BrokersPage;
