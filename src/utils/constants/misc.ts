import { HeadsetIcon, ShieldCheckIcon, TrendingUpIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
    {
        name: "Asana",
        logo: "/assets/company-01.svg",
    },
    {
        name: "Tidal",
        logo: "/assets/company-02.svg",
    },
    {
        name: "Innovaccer",
        logo: "/assets/company-03.svg",
    },
    {
        name: "Linear",
        logo: "/assets/company-04.svg",
    },
    {
        name: "Raycast",
        logo: "/assets/company-05.svg",
    },
    {
        name: "Labelbox",
        logo: "/assets/company-06.svg",
    }
] as const;

export const PROCESS = [
    {
        title: "Daily Support",
        description: "Get dedicated support from our team to help you with your trading.",
        icon: HeadsetIcon,
    },
    {
        title: "Trading Signals",
        description: "Access to premium trading signals and market analysis.",
        icon: TrendingUpIcon,
    },
    {
        title: "DIFC Verified Brokers",
        description: "All partners are regulated and trusted around the world.",
        icon: ShieldCheckIcon,
    },
] as const;

export const FEATURES = [
    {
        title: "Broker onboarding support",
        description: "Get guided account setup with trusted global broker partners.",
    },
    {
        title: "Market insights",
        description: "Access market commentary and directional trading insights.",
    },
    {
        title: "Risk-first approach",
        description: "Trade on predefined strategies and agreed risk parameters.",
    },
    {
        title: "Signal support",
        description: "Receive curated trade ideas with clear entry and risk context.",
    },
    {
        title: "Multi-market access",
        description: "Trade Gold, Crypto, Forex, and Commodities in one place.",
    },
    {
        title: "Dedicated client assistance",
        description: "Get responsive support to help you stay on track.",
    },
] as const;

export const REVIEWS = [
    {
        name: "Michael Smith",
        username: "@michaelsmith",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        review: "The broker onboarding was smooth and the support team was always available when I needed help."
    },
    {
        name: "Emily Johnson",
        username: "@emilyjohnson",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        rating: 4,
        review: "Useful platform with practical market insights. Overall a good experience and easy to navigate."
    },
    {
        name: "Daniel Williams",
        username: "@danielwilliams",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        rating: 5,
        review: "I have been using this daily for months. The trading signals and structure have been very helpful."
    },
    {
        name: "Sophia Brown",
        username: "@sophiabrown",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4,
        review: "This platform offers what I need to manage my trading activity with better confidence."
    },
    {
        name: "James Taylor",
        username: "@jamestaylor",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        review: "Intuitive and feature-rich platform. It has improved how I approach market opportunities."
    },
    {
        name: "Olivia Martinez",
        username: "@oliviamartinez",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        rating: 4,
        review: "Great platform with a lot of potential. The team keeps improving the experience."
    },
    {
        name: "William Garcia",
        username: "@williamgarcia",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5,
        review: "A game-changer for structured trading support. Easy to use and highly recommended."
    },
    {
        name: "Mia Rodriguez",
        username: "@miarodriguez",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        rating: 4,
        review: "I have tried several trading communities, but this one stands out. It is simple and effective."
    },
    {
        name: "Henry Lee",
        username: "@henrylee",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        rating: 5,
        review: "This platform transformed my routine. Reviewing setups and managing trades is far more organized now."
    },
] as const;
