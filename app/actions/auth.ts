'use server';

import { createCustomer, generateCustomerToken } from '@/services/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
    AUTH_COOKIE_NAME,
    getAuthCookieOptions,
    encryptToken,
} from '@/lib/auth/cookies';

type ActionOk = { ok: true };
type ActionErr = { ok: false; error: string };
export type ActionResult = ActionOk | ActionErr;


export async function logout(currentPath: string = '/'): Promise<ActionOk> {
    const store = await cookies();
    store.set(AUTH_COOKIE_NAME, '', { ...getAuthCookieOptions(), maxAge: 0 });
    revalidatePath(currentPath, 'layout');
    return { ok: true };
}

export async function createAccountAndLogin(formData: FormData): Promise<ActionResult> {
    try {
        const email = String(formData.get('email') || '');
        const firstname = String(formData.get('firstname') || '');
        const lastname = String(formData.get('lastname') || '');
        const password = String(formData.get('password') || '');

        if (!email || !firstname || !lastname || !password) {
            return { ok: false, error: 'All fields are required' };
        }

        await createCustomer({ email, firstname, lastname, password });

        return await authenticateAndSetCookie(email, password);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Signup failed';
        return { ok: false, error: message };
    }
}

export async function login(formData: FormData): Promise<ActionResult> {
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    return authenticateAndSetCookie(email, password);
}


async function authenticateAndSetCookie(email: string, password: string): Promise<ActionResult> {
    try {
        if (!email || !password) {
            return { ok: false, error: 'Email and password are required' };
        }

        const token = await generateCustomerToken(email, password);
        const secret = process.env.AUTH_COOKIE_SECRET;
        if (!secret) {
            return { ok: false, error: 'Server misconfiguration: missing `AUTH_COOKIE_SECRET`' };
        }

        const encrypted = encryptToken(token, secret);
        const store = await cookies();
        store.set(AUTH_COOKIE_NAME, encrypted, getAuthCookieOptions());

        return { ok: true };
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Authentication failed';
        return { ok: false, error: message };
    }
}