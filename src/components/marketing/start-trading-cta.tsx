"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const StartTradingCta = () => {
    return (
        <Button size="lg" className="w-full min-w-0 sm:w-auto sm:min-w-[210px]" asChild>
            <Link href="/#trade-with-us" className="flex items-center justify-center gap-2">
                Start Trading Now
                <ArrowRightIcon className="w-4 h-4" />
            </Link>
        </Button>
    );
};

export default StartTradingCta;
