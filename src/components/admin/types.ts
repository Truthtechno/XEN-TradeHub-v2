export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED";
export type PortalRole = "USER" | "MANAGER" | "ANALYST" | "ADMIN";

export type AdminOverview = {
    totalVisits: number;
    deviceStats: { deviceType: string; _count: { _all: number } }[];
    countryStats: { country: string | null; _count: { _all: number } }[];
    enquiries: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
        status: EnquiryStatus;
        createdAt: string;
        updatedAt: string;
    }[];
    users: {
        id: string;
        fullName: string;
        email: string;
        role: PortalRole;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        hasPassword: boolean;
        mustChangePassword: boolean;
    }[];
    brokers: {
        id: string;
        name: string;
        description: string;
        ctaLabel: string;
        ctaUrl: string;
        logoUrl: string | null;
        highlighted: boolean;
        isActive: boolean;
        orderIndex: number;
        benefits: { id: string; text: string }[];
    }[];
    recentVisits: {
        id: string;
        path: string;
        deviceType: string;
        country: string | null;
        createdAt: string;
    }[];
};
