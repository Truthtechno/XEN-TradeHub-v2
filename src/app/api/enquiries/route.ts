import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

const MIN_SUBMISSION_MS = 2000;
const ENQUIRY_WINDOW_MINUTES = 15;
const MAX_ENQUIRIES_PER_WINDOW = 3;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\d\s\-()]{7,20}$/;

const hashValue = (value: string) => createHash("sha256").update(value).digest("hex");

const getClientIp = (req: Request) => {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (!forwardedFor) return "unknown";
    return forwardedFor.split(",")[0]?.trim() || "unknown";
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as {
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            subject?: string;
            message?: string;
            company?: string;
            formStartedAt?: string;
        };

        const firstName = body.firstName?.trim();
        const lastName = body.lastName?.trim();
        const email = body.email?.trim().toLowerCase();
        const phone = body.phone?.trim();
        const subject = body.subject?.trim();
        const message = body.message?.trim();
        const company = body.company?.trim();
        const formStartedAt = body.formStartedAt?.trim();

        if (!firstName || !lastName || !email || !phone || !subject || !message) {
            return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
        }

        if (company) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
        }

        if (!phoneRegex.test(phone)) {
            return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
        }

        const now = Date.now();
        const startedAt = formStartedAt ? Date.parse(formStartedAt) : NaN;
        if (!startedAt || Number.isNaN(startedAt) || now - startedAt < MIN_SUBMISSION_MS) {
            return NextResponse.json({ error: "Please wait a moment and try again." }, { status: 429 });
        }

        const ip = getClientIp(req);
        const sourceIpHash = hashValue(ip);
        const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;
        const windowStart = new Date(now - ENQUIRY_WINDOW_MINUTES * 60 * 1000);

        const recentCount = await db.enquiry.count({
            where: {
                createdAt: { gte: windowStart },
                OR: [{ email }, { sourceIpHash }],
            },
        });

        if (recentCount >= MAX_ENQUIRIES_PER_WINDOW) {
            return NextResponse.json(
                { error: "Too many enquiries submitted recently. Please try again later." },
                { status: 429 }
            );
        }

        const enquiry = await db.enquiry.create({
            data: { firstName, lastName, email, phone, subject, message, sourceIpHash, userAgent },
        });

        return NextResponse.json(enquiry);
    } catch {
        return NextResponse.json({ error: "Unable to submit enquiry." }, { status: 400 });
    }
}
