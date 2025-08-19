import "server-only";
import { cookies } from 'next/headers';
import {decryptToken, encryptToken} from "@/lib/utils/cookies";
import {generateCustomerToken} from "@/services/auth";
import {ActionResult} from "@/app/actions/auth";

export const PRODUCTION_ENV = "production";
const AUTH_COOKIE_SECRET = process.env.AUTH_COOKIE_SECRET;
export const ALGO = 'aes-256-gcm';
export const IV_LENGTH = 12;
export const AUTH_COOKIE_NAME =
    process.env.NODE_ENV === PRODUCTION_ENV
        ? "__Host-auth"
        : "auth";

export async function getAuthCookie() {
    "use server";

    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!authCookie) {
        return null;
    }

    return authCookie.value;
}

export async function getAuthToken(): Promise<string> {
    "use server";

    const cookieStore = await cookies();
    const signedCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!signedCookie) {
        throw new Error("User is not authenticated");
    }

    return decryptToken(signedCookie.value, getAuthCookieSecret());
}

export function getAuthCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === PRODUCTION_ENV,
        sameSite: "strict" as const,
        path: '/',
        maxAge: 60 * 60 * 4 // 4 hours,
    };
}

export async function clearAuthCookie(): Promise<void> {
    "use server";

    const store = await cookies();
    store.set(AUTH_COOKIE_NAME, "", {
        ...getAuthCookieOptions(),
        maxAge: 0,
        expires: new Date(0),
    });
}

export async function authenticateAndSetCookie(email: string, password: string): Promise<ActionResult> {
    try {
        const token = await generateCustomerToken(email, password);
        const secret = getAuthCookieSecret();

        if (!secret) {
            return {
                ok: false,
                error: new Error(`Server misconfiguration: missing \`AUTH_COOKIE_SECRET`)
            };
        }

        await setAuthenticationCookie(encryptToken(token, secret));

        return { ok: true };
    } catch (e: unknown) {
        return {
            ok: false,
            error: e instanceof Error ? e : new Error('Authentication failed')
        };
    }
}

export async function setAuthenticationCookie(encryptedToken: string): Promise<void> {
    const store = await cookies();
    store.set(AUTH_COOKIE_NAME, encryptedToken, getAuthCookieOptions());
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.has(AUTH_COOKIE_NAME);
}

export function getAuthCookieSecret()
{
    if (!AUTH_COOKIE_SECRET) {
        throw new Error(`Server misconfiguration: missing \`AUTH_COOKIE_SECRET\``);
    }
    return AUTH_COOKIE_SECRET;
}