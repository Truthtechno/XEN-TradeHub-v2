import { getBrokerCards } from "@/lib/brokers";
import { NextResponse } from "next/server";

export async function GET() {
    const brokers = await getBrokerCards();
    return NextResponse.json(brokers);
}
