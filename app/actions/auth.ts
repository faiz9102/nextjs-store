'use server';

import "server-only";
import { createCustomer } from '@/services/auth';
import { revalidatePath } from 'next/cache';
import { authenticateAndSetCookie , clearAuthCookie, isAuthenticated } from '@/lib/auth/token';
import { getCustomerData } from '@/services/auth';
import { User } from '@/types/customer';

type ActionOk = { ok: true };
type ActionErr = { ok: false; error: Error };
export type ActionResult = ActionOk | ActionErr;


export async function logout(currentPath: string = '/'): Promise<ActionResult> {
    try {
        await clearAuthCookie();
        revalidatePath(currentPath);
        return { ok: true };
    } catch (e: unknown) {
        return {
            ok: false,
            error: e instanceof Error ? e : new Error('Logout failed')
        };
    }
}

export async function signup(formData: FormData): Promise<ActionResult> {
    if (await isAuthenticated())
        return { ok: true };

    try {
        const email = String(formData.get('email') || '');
        const firstname = String(formData.get('firstname') || '');
        const lastname = String(formData.get('lastname') || '');
        const password = String(formData.get('password') || '');

        if (!email || !firstname || !lastname || !password) {
            return {
                ok: false,
                error: new Error('All fields are required')
            };
        }

        await createCustomer({ email, firstname, lastname, password });

        return { ok: true };
    } catch (e: unknown) {
        return {
            ok: false,
            error: e instanceof Error ? e : new Error('Signup failed')
        };
    }
}

export async function login(formData: FormData): Promise<ActionResult> {
    if (await isAuthenticated())
        return { ok: true };

    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (!email || !password) {
        return {
            ok: false,
            error: new Error('Email and password are required')
        };
    }

    try {
        return authenticateAndSetCookie(email, password);
    } catch (e: unknown) {
        return {
            ok: false,
            error: e instanceof Error ? e : new Error('Login failed')
        };
    }
}

export async function getCustomer(): Promise<ActionErr|{ ok: true; user: User }> {
    if (!(await isAuthenticated())) {
        return { ok: false, error: new Error('Not authenticated') };
    }

    try {
        const user = await getCustomerData();
        return { ok: true, user: user };
    } catch (e: unknown) {
        return {
            ok: false,
            error: e instanceof Error ? e : new Error('Failed to fetch customer data')
        };
    }
}