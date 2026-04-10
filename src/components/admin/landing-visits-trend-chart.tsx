"use client";

import { format, parseISO } from "date-fns";
import { useId, useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Point = { date: string; count: number };

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ payload?: { label: string; count: number; fullDate: string } }>;
}) => {
    if (!active || !payload?.length) return null;
    const row = payload[0]?.payload;
    if (!row) return null;
    return (
        <div className="rounded-lg border border-white/10 bg-neutral-950/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
            <p className="font-medium text-foreground">{row.count} visits</p>
            <p className="mt-0.5 text-muted-foreground">
                {(() => {
                    try {
                        return format(parseISO(row.fullDate), "MMM d, yyyy");
                    } catch {
                        return row.label;
                    }
                })()}
            </p>
        </div>
    );
};

export const LandingVisitsTrendChart = ({ points }: { points: Point[] }) => {
    const gradientId = useId().replace(/:/g, "");

    const data = useMemo(
        () =>
            points.map((p) => ({
                label: (() => {
                    try {
                        return format(parseISO(p.date), "MMM d");
                    } catch {
                        return p.date.slice(0, 10);
                    }
                })(),
                fullDate: p.date,
                count: p.count,
            })),
        [points],
    );

    if (!data.length) {
        return (
            <div className="flex h-[280px] items-center justify-center rounded-lg border border-white/10 bg-black/20 text-sm text-muted-foreground">
                No visit data for this period yet.
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 12, right: 8, left: 4, bottom: 4 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
                            <stop offset="55%" stopColor="#f59e0b" stopOpacity={0.12} />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        interval={0}
                        height={40}
                    />
                    <YAxis
                        tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                        allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(251,191,36,0.35)", strokeWidth: 1 }} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                        dot={{ r: 2, fill: "#fcd34d", stroke: "#fbbf24", strokeWidth: 1 }}
                        activeDot={{ r: 4, fill: "#fde68a", stroke: "#f59e0b" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
