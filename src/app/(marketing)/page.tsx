import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";
import Marquee from "@/components/ui/marquee";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import ContactForm from "@/components/contact/contact-form";
import { getBrokerCards } from "@/lib/brokers";
import { PROCESS } from "@/utils";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeftRightIcon, ArrowRightIcon, ArrowUpRightIcon, BitcoinIcon, CoinsIcon, DownloadIcon, MailIcon, MessageCircleIcon, SendIcon, WheatIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {
    const clerkEnabled = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "") &&
        /^sk_(test|live)_[A-Za-z0-9]+$/.test(process.env.CLERK_SECRET_KEY?.trim() || "");
    const user = clerkEnabled ? await currentUser() : null;
    const brokerCards: Awaited<ReturnType<typeof getBrokerCards>> = await getBrokerCards();
    const marketItems = [
        { name: "Gold", icon: CoinsIcon },
        { name: "Crypto", icon: BitcoinIcon },
        { name: "Forex", icon: ArrowLeftRightIcon },
        { name: "Commodities", icon: WheatIcon },
    ];
    const marqueeMarkets = [...marketItems, marketItems[0], marketItems[1]];

    return (
        <div id="home" className="overflow-x-hidden scrollbar-hide size-full">
            {/* Hero Section */}
            <MaxWidthWrapper>
                <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
                    <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
                        <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                            <span>
                                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                            </span>
                            <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                            <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
                            <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1">
                                XEN TradeHub V2
                                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </span>
                        </button>
                        <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
                            Trade Smarter with <span className="text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text inline-block">
                                Smart Trading
                            </span>
                        </h1>
                        <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
                            An Independent Asset Management Service Provider 
                            <br className="hidden md:block" />
                            <span className="hidden md:block">Offering Trading services on predefined strategies and agreed terms..</span>
                        </p>
                        <div className="flex items-center justify-center whitespace-nowrap gap-3 z-50">
                            <Button size="lg" className="min-w-[210px]" asChild>
                                <Link href={user ? "/dashboard" : "/auth/sign-in"} className="flex items-center justify-center gap-2">
                                    Start Trading Now
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="min-w-[210px] border-white/20 bg-white/[0.03] text-white hover:bg-white/10"
                                asChild
                            >
                                <a href="/assets/smart-trading-flyer.pdf" download className="flex items-center justify-center gap-2">
                                    Learn More
                                    <DownloadIcon className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </AnimationContainer>

                    <AnimationContainer delay={0.2} className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full">
                        <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
                        <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
                            <BorderBeam
                                size={250}
                                duration={12}
                                delay={9}
                                colorFrom="#fff9e6"
                                colorTo="#ffbf1f"
                            />
                            <Image
                                src="/assets/smart-trading.jpeg"
                                alt="Dashboard"
                                width={1200}
                                height={1200}
                                quality={100}
                                className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
                            />
                            <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
                            <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
                        </div>
                    </AnimationContainer>
                </div>
            </MaxWidthWrapper >

            {/* Companies Section */}
            <section
                id="markets"
                className="relative border-t border-border bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]"
            >
                <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>
                <MaxWidthWrapper>
                <AnimationContainer delay={0.4}>
                    <div className="py-14">
                        <div className="mx-auto px-4 md:px-8">
                            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground">
                                Markets We Trade In
                            </h2>
                            <div className="mt-8">
                                <Marquee className="[--duration:26s] [--gap:0rem] py-1">
                                    {marqueeMarkets.map((market, index) => {
                                        const Icon = market.icon;
                                        return (
                                            <div
                                                key={`${market.name}-${index}`}
                                                className="w-[180px] md:w-[190px] lg:w-[205px] flex items-center justify-center gap-3 text-white/95"
                                            >
                                                <Icon className="size-6 text-amber-400" strokeWidth={1.8} />
                                                <span className="text-[1.35rem] md:text-[1.55rem] leading-none font-semibold tracking-tight text-white">
                                                    {market.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </Marquee>
                            </div>
                        </div>
                    </div>
                </AnimationContainer>
                </MaxWidthWrapper>
            </section>

            {/* Process Section */}
            <section id="why-choose-us">
                <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Why Choose Us" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                        Why Trade With Our Partners?
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                           Get access to exclusive benefits, daily support, and professional signals.
                        </p>
                    </div>
                </AnimationContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
                    {PROCESS.map((process, id) => (
                        <AnimationContainer delay={0.2 * id} key={id}>
                            <MagicCard className="group md:py-8">
                                <div className="flex flex-col items-start justify-center w-full">
                                    <process.icon strokeWidth={1.5} className="w-10 h-10 text-foreground" />
                                    <div className="flex flex-col relative items-start">
                                        <span className="absolute -top-6 right-0 border-2 border-border text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5">
                                            {id + 1}
                                        </span>
                                        <h3 className="text-base mt-6 font-medium text-foreground">
                                            {process.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {process.description}
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>
                </MaxWidthWrapper>
            </section>

            {/* Pricing Section */}
            <section id="trade-with-us">
                <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Trade With Us" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                        Trade With Trusted Global Brokers
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                        Start trading through verified partners with full onboarding support.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto w-full">
                        {brokerCards.map((broker: Awaited<ReturnType<typeof getBrokerCards>>[number]) => (
                            <div
                                key={broker.name}
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
                                <p className="mt-3 text-sm text-muted-foreground leading-6 min-h-[84px]">
                                    {broker.description}
                                </p>
                                <div className="mt-5">
                                    <p className="text-sm font-medium text-foreground mb-3">Key Benefits:</p>
                                    <ul className="space-y-2">
                                        {broker.benefits.map((benefit: string) => (
                                            <li key={benefit} className="text-sm text-muted-foreground flex items-center gap-2">
                                                <span className="size-4 rounded-full bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 flex items-center justify-center text-[10px]">
                                                    ✓
                                                </span>
                                                {benefit}
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
                                            {broker.cta}
                                        </span>
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                </AnimationContainer>
                </MaxWidthWrapper>
            </section>

            {/* Contact Showcase Section */}
            <section id="contact">
                <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Get In Touch" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            Need help or have questions?
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Our team is here to help you get the most out of XEN TradeHub.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2} className="w-full py-8">
                    <div className="-m-2 rounded-xl p-2 lg:-m-4 lg:rounded-2xl">
                        <div className="rounded-md lg:rounded-xl bg-black p-4 md:p-5">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    <div className="rounded-xl bg-neutral-950 p-5">
                                        <div className="flex items-center gap-2 text-white">
                                            <MailIcon className="size-4" />
                                            <h3 className="font-semibold">Email Us</h3>
                                        </div>
                                        <p className="mt-4 text-sm leading-6 text-white/65">
                                            Reach out for support, sales inquiries, or any general questions about XEN TradeHub.
                                        </p>
                                        <Button variant="outline" className="mt-5 h-8 border-white/0 bg-white/[0.02] text-white hover:bg-white/10" asChild>
                                            <a href="mailto:info@xen-hub.com">
                                                Email Us
                                            </a>
                                        </Button>
                                    </div>

                                    <div className="rounded-xl bg-neutral-950 p-5">
                                        <div className="flex items-center gap-2 text-white">
                                            <MessageCircleIcon className="size-4" />
                                            <h3 className="font-semibold">WhatsApp Us</h3>
                                        </div>
                                        <p className="mt-4 text-sm leading-6 text-white/65">
                                            Chat with our team directly on WhatsApp for quick responses and real-time assistance.
                                        </p>
                                        <Button variant="outline" className="mt-5 h-8 border-white/0 bg-white/[0.02] text-white hover:bg-white/10" asChild>
                                            <a href="https://wa.me/971521122924" target="_blank" rel="noopener noreferrer">
                                                Open WhatsApp
                                            </a>
                                        </Button>
                                    </div>

                                    <div className="rounded-xl bg-neutral-950 p-5">
                                        <div className="flex items-center gap-2 text-white">
                                            <SendIcon className="size-4" />
                                            <h3 className="font-semibold">Join Telegram Group</h3>
                                        </div>
                                        <p className="mt-4 text-sm leading-6 text-white/65">
                                            Join our Telegram group to stay updated and connect with our broader trading community.
                                        </p>
                                        <Button variant="outline" className="mt-5 h-8 border-white/0 bg-white/[0.02] text-white hover:bg-white/10" asChild>
                                            <a href="https://t.me/+971504311789" target="_blank" rel="noopener noreferrer">
                                                Join Telegram
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                <div className="lg:col-span-8 rounded-xl bg-neutral-950 p-5 md:p-6">
                                    <div className="flex items-center gap-2 text-white">
                                        <MailIcon className="size-4" />
                                        <h3 className="font-semibold">Send us a message</h3>
                                    </div>

                                    <ContactForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimationContainer>
                </MaxWidthWrapper>
            </section>

            {/* CTA Section */}
            <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
                <AnimationContainer delay={0.1}>
                    <LampContainer className="[&>div:last-child]:-translate-y-40 md:[&>div:last-child]:-translate-y-56 xl:[&>div:last-child]:-translate-y-64">
                        <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-400 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                                Start Making Your Money 
                                <br />Work For You Today! <span className="text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text inline-block"></span>
                            </h2>
                            <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                            All trading activity takes place within your own account held with the broker, ensuring transparency and control at all times.
                            </p>
                            <div className="mt-6">
                                <Button asChild>
                                    <Link href="#trade-with-us">
                                        Get Started Today
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </LampContainer>
                </AnimationContainer>
            </MaxWidthWrapper>

        </div>
    )
};

export default HomePage
