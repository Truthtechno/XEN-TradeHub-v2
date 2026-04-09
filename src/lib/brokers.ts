import { db } from "@/lib/prisma";
import { DEFAULT_BROKERS } from "./default-brokers";

export type BrokerCard = {
    id?: string;
    name: string;
    description: string;
    cta: string;
    ctaUrl: string;
    highlighted: boolean;
    logoUrl: string | null;
    benefits: string[];
};

export const seedDefaultBrokersIfEmpty = async () => {
    const existingCount = await db.broker.count();
    if (existingCount > 0) return;

    for (let index = 0; index < DEFAULT_BROKERS.length; index += 1) {
        const broker = DEFAULT_BROKERS[index];
        await db.broker.create({
            data: {
                name: broker.name,
                description: broker.description,
                ctaLabel: broker.ctaLabel,
                ctaUrl: broker.ctaUrl,
                highlighted: broker.highlighted,
                isActive: true,
                orderIndex: index,
                benefits: {
                    create: broker.benefits.map((text) => ({ text })),
                },
            },
        });
    }
};

export const getBrokerCards = async (): Promise<BrokerCard[]> => {
    try {
        await seedDefaultBrokersIfEmpty();
        const brokers = await db.broker.findMany({
            where: { isActive: true },
            orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
            include: {
                benefits: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        return brokers.map((broker) => ({
            id: broker.id,
            name: broker.name,
            description: broker.description,
            cta: broker.ctaLabel,
            ctaUrl: broker.ctaUrl,
            highlighted: broker.highlighted,
            logoUrl: broker.logoUrl || null,
            benefits: broker.benefits.map((benefit) => benefit.text),
        }));
    } catch {
        // DB unavailable fallback keeps homepage functional.
        return DEFAULT_BROKERS.map((broker) => ({
            name: broker.name,
            description: broker.description,
            cta: broker.ctaLabel,
            ctaUrl: broker.ctaUrl,
            highlighted: broker.highlighted,
            logoUrl: null,
            benefits: broker.benefits,
        }));
    }
};
