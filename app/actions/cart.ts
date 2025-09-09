"use server";

import {
    generateAndSetCustomerCartCookie,
    generateAndSetGuestCartCookie,
    isCustomerCartCookieSet,
    isGuestCartCookieSet,
    isCartCookieSet,
    getCartId
} from "@/lib/cart/cookie";
import {isAuthenticated, getAuthToken} from "@/lib/auth/token";
import {addItemToCustomerCart, addItemToGuestCart, updateCart} from "@/services/cart";
import {CustomerCart} from "@/types/cart";

export async function initializeCart(): Promise<boolean> {
    try {
        const [guestCartExists, customerCartExists] = await Promise.all([
            isGuestCartCookieSet(),
            isCustomerCartCookieSet()
        ]);
        if (guestCartExists || customerCartExists) return true;

        if (await isAuthenticated()) {
            const token = await getAuthToken();
            if (token) {
                await generateAndSetCustomerCartCookie(token);
                return true;
            }
        }
        await generateAndSetGuestCartCookie();
        return true;
    } catch (e: unknown) {
        console.error("Error setting up cart:", e instanceof Error ? e.message : e);
        return false;
    }
}

export async function addProductToCart(sku: string, quantity: number): Promise<CustomerCart> {
    const cartId = await getCartId();
    if (!(await isCartCookieSet()) || !cartId) {
        throw new Error("No cart available. Please refresh the page.");
    }
    if (await isAuthenticated()) {
        const token = await getAuthToken();
        if (!token) throw new Error("Missing auth token");
        return await addItemToCustomerCart(token, cartId, { sku, quantity });
    }
    return await addItemToGuestCart(cartId, { sku, quantity });
}

export async function updateCartItemQty(uid: string, quantity: number): Promise<CustomerCart> {
    const cartId = await getCartId();
    if (!(await isCartCookieSet()) || !cartId) {
        throw new Error("No cart available. Please refresh the page.");
    }

    let token : null|string = null;
    if (await isAuthenticated()) {
        token = await getAuthToken();
    }
    return await updateCart(cartId, { uid, quantity }, token || undefined);
}