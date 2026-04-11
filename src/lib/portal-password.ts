import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { PORTAL_PASSWORD_MIN_LENGTH } from "./portal-password-constants";

const scryptAsync = promisify(scrypt);

export const portalPasswordMinLength = PORTAL_PASSWORD_MIN_LENGTH;

/** Readable temp password for admin to copy (avoids ambiguous 0/O, 1/l/I). */
const TEMP_PASSWORD_ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateTemporaryPassword(length = 14): string {
    const bytes = randomBytes(length);
    let out = "";
    for (let i = 0; i < length; i++) {
        out += TEMP_PASSWORD_ALPHABET[bytes[i]! % TEMP_PASSWORD_ALPHABET.length]!;
    }
    return out;
}

export async function hashPortalPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPortalPassword(password: string, stored: string): Promise<boolean> {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    try {
        return timingSafeEqual(Buffer.from(hash, "hex"), derived);
    } catch {
        return false;
    }
}

export function isPasswordStrongEnough(password: string): boolean {
    return password.length >= PORTAL_PASSWORD_MIN_LENGTH;
}
