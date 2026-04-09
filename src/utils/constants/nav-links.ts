import { HelpCircleIcon, LineChartIcon, Link2Icon, LockIcon, NewspaperIcon, QrCodeIcon } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Features",
        href: "/features",
        menu: [
            {
                title: "Broker Onboarding",
                tagline: "Start trading with trusted global broker partners.",
                href: "/features/link-shortening",
                icon: Link2Icon,
            },
            {
                title: "Risk Controls",
                tagline: "Apply clear safeguards to protect your capital.",
                href: "/features/password-protection",
                icon: LockIcon,
            },
            {
                title: "Advanced Analytics",
                tagline: "Gain actionable insights into market behavior.",
                href: "/features/analytics",
                icon: LineChartIcon,
            },
            {
                title: "Strategy Playbooks",
                tagline: "Use structured plans to improve trade execution.",
                href: "/features/qr-codes",
                icon: QrCodeIcon,
            },
        ],
    },
    {
        title: "Pricing",
        href: "/pricing",
    },
    {
        title: "Enterprise",
        href: "/enterprise",
    },
    {
        title: "Resources",
        href: "/resources",
        menu: [
            {
                title: "Blog",
                tagline: "Read articles on the latest trends in tech.",
                href: "/resources/blog",
                icon: NewspaperIcon,
            },
            {
                title: "Help",
                tagline: "Get answers to your questions.",
                href: "/resources/help",
                icon: HelpCircleIcon,
            },
        ]
    },
    {
        title: "Changelog",
        href: "/changelog",
    },
];
