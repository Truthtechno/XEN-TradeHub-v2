// export const PLANS = [
//     {
//         name: "Free",
//         info: "For most individuals",
//         price: {
//             monthly: 0,
//             yearly: 0,
//         },
//         features: [
//             { text: "Shorten links" },
//             { text: "Up to 100 tags", limit: "100 tags" },
//             { text: "Customizable branded links" },
//             { text: "Track clicks", tooltip: "1K clicks/month" },
//             { text: "Community support", tooltip: "Get answers your questions on discord" },
//             { text: "AI powered suggestions", tooltip: "Get up to 100 AI powered suggestions" },
//         ],
//         btn: {
//             text: "Start for free",
//             href: "/auth/sign-up?plan=free",
//             variant: "default",
//         }
//     },
//     {
//         name: "Pro",
//         info: "For small businesses",
//         price: {
//             monthly: 9,
//             yearly: 90,
//         },
//         features: [
//             { text: "Shorten links" },
//             { text: "Up to 500 tags", limit: "500 tags" },
//             { text: "Customizable branded links" },
//             { text: "Track clicks", tooltip: "20K clicks/month" },
//             { text: "Export click data", tooltip: "Upto 1K links" },
//             { text: "Priority support", tooltip: "Get 24/7 chat support" },
//             { text: "AI powered suggestions", tooltip: "Get up to 500 AI powered suggestions" },
//         ],
//         btn: {
//             text: "Get started",
//             href: "/auth/sign-up?plan=pro",
//             variant: "purple",
//         }
//     },
//     {
//         name: "Business",
//         info: "For large organizations",
//         price: {
//             monthly: 49,
//             yearly: 490,
//         },
//         features: [
//             { text: "Shorten links" },
//             { text: "Unlimited tags" },
//             { text: "Customizable branded links"},
//             { text: "Track clicks", tooltip: "Unlimited clicks" },
//             { text: "Export click data", tooltip: "Unlimited clicks" },
//             { text: "Dedicated manager", tooltip: "Get priority support from our team" },
//             { text: "AI powered suggestions", tooltip: "Get unlimited AI powered suggestions" },
//         ],
//         btn: {
//             text: "Contact team",
//             href: "/auth/sign-up?plan=business",
//             variant: "default",
//         }
//     }
// ];

// export const PRICING_FEATURES = [
//     {
//         text: "Shorten links",
//         tooltip: "Create shortened links",
//     },
//     {
//         text: "Track clicks",
//         tooltip: "Track clicks on your links",
//     },
//     {
//         text: "See top countries",
//         tooltip: "See top countries where your links are clicked",
//     },
//     {
//         text: "Upto 10 tags",
//         tooltip: "Add upto 10 tags to your links",
//     },
//     {
//         text: "Community support",
//         tooltip: "Community support is available for free users",
//     },
//     {
//         text: "Priority support",
//         tooltip: "Get priority support from our team",
//     },
//     {
//         text: "AI powered suggestions",
//         tooltip: "Get AI powered suggestions for your links",
//     },
// ];

// export const WORKSPACE_LIMIT = 2;
export const PLANS = [
    {
        name: "Free",
        info: "For most individuals",
        price: {
            monthly: 0,
            yearly: 0,
        },
        features: [
            { text: "Broker onboarding support" },
            { text: "Up to 100 watchlist items", limit: "100 items" },
            { text: "Structured strategy guidance" },
            { text: "Trade activity insights", tooltip: "Basic monthly insights" },
            { text: "Community support", tooltip: "Get answers your questions on discord" },
            { text: "AI powered insights", tooltip: "Get up to 100 AI-powered insights" },
        ],
        btn: {
            text: "Start for free",
            href: "/auth/sign-up?plan=free",
            variant: "default",
        }
    },
    {
        name: "Pro",
        info: "For small businesses",
        price: {
            monthly: 9,
            yearly: Math.round(9 * 12 * (1 - 0.12)),
        },
        features: [
            { text: "Broker onboarding support" },
            { text: "Up to 500 watchlist items", limit: "500 items" },
            { text: "Structured strategy guidance" },
            { text: "Trade activity insights", tooltip: "Advanced monthly insights" },
            { text: "Export performance data", tooltip: "Up to 1K records" },
            { text: "Priority support", tooltip: "Get 24/7 chat support" },
            { text: "AI powered insights", tooltip: "Get up to 500 AI-powered insights" },
        ],
        btn: {
            text: "Get started",
            href: "/auth/sign-up?plan=pro",
            variant: "purple",
        }
    },
    {
        name: "Business",
        info: "For large organizations",
        price: {
            monthly: 49,
            yearly: Math.round(49 * 12 * (1 - 0.12)),
        },
        features: [
            { text: "Broker onboarding support" },
            { text: "Unlimited watchlist items" },
            { text: "Structured strategy guidance" },
            { text: "Trade activity insights", tooltip: "Unlimited insights" },
            { text: "Export performance data", tooltip: "Unlimited exports" },
            { text: "Dedicated manager", tooltip: "Get priority support from our team" },
            { text: "AI powered insights", tooltip: "Get unlimited AI-powered insights" },
        ],
        btn: {
            text: "Contact team",
            href: "/auth/sign-up?plan=business",
            variant: "default",
        }
    }
];

export const PRICING_FEATURES = [
    {
        text: "Broker onboarding support",
        tooltip: "Guided setup with trusted broker partners",
    },
    {
        text: "Trade activity insights",
        tooltip: "Track your strategy and trading activity data",
    },
    {
        text: "Market region insights",
        tooltip: "View market activity by region",
    },
    {
        text: "Up to 10 watchlist tags",
        tooltip: "Tag and organize key setups",
    },
    {
        text: "Community support",
        tooltip: "Community support is available for free users",
    },
    {
        text: "Priority support",
        tooltip: "Get priority support from our team",
    },
    {
        text: "AI powered insights",
        tooltip: "Get AI-powered insights for trading ideas",
    },
];

export const WORKSPACE_LIMIT = 2;