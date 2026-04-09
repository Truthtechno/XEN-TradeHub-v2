import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "tradehub_admin_session";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SESSION_TTL_MS = 7 * ONE_DAY_MS;

type SessionPayload = {
    email: string;
    exp: number;
};

const base64url = (value: string) => Buffer.from(value).toString("base64url");
const parseBase64url = (value: string) => Buffer.from(value, "base64url").toString("utf-8");

const getSecret = () => process.env.ADMIN_SESSION_SECRET || "change-this-admin-session-secret";

const sign = (payload: string) =>
    crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

export const createAdminSessionToken = (email: string) => {
    const payload: SessionPayload = {
        email,
        exp: Date.now() + SESSION_TTL_MS,
    };

    const encoded = base64url(JSON.stringify(payload));
    const signature = sign(encoded);
    return `${encoded}.${signature}`;
};

export const verifyAdminSessionToken = (token?: string | null): SessionPayload | null => {
    if (!token) return null;
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const expectedSig = sign(encoded);
    if (signature !== expectedSig) return null;

    try {
        const payload = JSON.parse(parseBase64url(encoded)) as SessionPayload;
        if (!payload.exp || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
};

export const getAdminSession = () => {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    return verifyAdminSessionToken(token);
};

export const getAdminCredentials = () => ({
    email: process.env.ADMIN_EMAIL || "admin@tradehub.com",
    password: process.env.ADMIN_PASSWORD || "admin1234",
});
