import { Metadata } from "next";

const getMetadataBase = () => {
    const raw =
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        process.env.NEXT_PUBLIC_APP_DOMAIN?.trim();

    if (!raw) return new URL("http://localhost:3000");

    const normalized =
        raw.startsWith("http://") || raw.startsWith("https://")
            ? raw
            : `https://${raw}`;

    try {
        return new URL(normalized);
    } catch {
        return new URL("http://localhost:3000");
    }
};

export const generateMetadata = ({
    title = `${process.env.NEXT_PUBLIC_APP_NAME} - Smart Trading & Asset Management Platform`,
    description = `${process.env.NEXT_PUBLIC_APP_NAME} is an independent asset management service provider offering trading services on predefined strategies and agreed terms.`,
    image = "/thumbnail.png",
    icons = [
        {
            rel: "apple-touch-icon",
            sizes: "32x32",
            url: "/apple-touch-icon.png"
        },
        {
            rel: "icon",
            sizes: "32x32",
            url: "/favicon-32x32.png"
        },
        {
            rel: "icon",
            sizes: "16x16",
            url: "/favicon-16x16.png"
        },
    ],
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => ({
    title,
    description,
    metadataBase: getMetadataBase(),
    icons,
    openGraph: {
        title,
        description,
        ...(image && { images: [{ url: image }] }),
    },
    twitter: {
        title,
        description,
        ...(image && { card: "summary_large_image", images: [image] }),
        creator: "@shreyassihasane",
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
});
