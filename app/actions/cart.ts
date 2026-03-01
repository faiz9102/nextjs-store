"use server";

import "server-only";
import {
    createGuestCart,
    getCart,
    getCustomerCart,
    addSimpleToCart,
    addConfigurableToCart,
    removeCartItem,
    updateCartItemQty,
    mergeCarts,
} from "@/services/cart";
import { MagentoCart } from "@/types/cart";
import { AddToCartPayload } from "@/types/cart";
import { getAuthToken, isAuthenticated } from "@/lib/auth/token";

// ---------------------------------------------------------------------------
// Typed result helpers (mirror the pattern in app/actions/auth.ts)
// ---------------------------------------------------------------------------

type Ok<T> = { ok: true; data: T };
type Err = { ok: false; error: Error };
export type CartActionResult<T = void> = Ok<T> | Err;

function ok<T>(data: T): Ok<T> { return { ok: true, data }; }
function err(e: unknown): Err {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
}

/** Safely retrieves the auth token without throwing — returns undefined for guests */
async function tryGetToken(): Promise<string | undefined> {
    try {
        if (await isAuthenticated()) return await getAuthToken();
    } catch {
        // not authenticated — fall through
    }
    return undefined;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/** Creates a new Magento guest cart and returns its ID */
export async function actionCreateGuestCart(): Promise<CartActionResult<string>> {
    try {
        const cartId = await createGuestCart();
        return ok(cartId);
    } catch (e) {
        return err(e);
    }
}

/**
 * Fetches cart by ID (guest) or via bearer token (authenticated customer).
 * If cartId is omitted and the user is authenticated, fetches the customer cart.
 */
export async function actionGetCart(cartId?: string): Promise<CartActionResult<MagentoCart>> {
    try {
        if (cartId) {
            const cart = await getCart(cartId);
            return ok(cart);
        }

        // No cart ID — must be a logged-in customer
        if (!(await isAuthenticated())) throw new Error("Not authenticated and no cart ID provided");
        const token = await getAuthToken();
        const cart = await getCustomerCart(token);
        return ok(cart);
    } catch (e) {
        return err(e);
    }
}

/**
 * Adds a product to the cart — auto-branches between simple and configurable.
 * Automatically attaches the bearer token when the user is authenticated so
 * Magento can validate ownership of the customer cart.
 */
export async function actionAddToCart(
    cartId: string,
    payload: AddToCartPayload
): Promise<CartActionResult<MagentoCart>> {
    try {
        // Transparently attach auth token when the user is logged in
        const token = await tryGetToken();

        let cart: MagentoCart;
        if (payload.parentSku) {
            cart = await addConfigurableToCart(cartId, payload.parentSku, payload.sku, payload.qty, token);
        } else {
            cart = await addSimpleToCart(cartId, payload.sku, payload.qty, token);
        }
        return ok(cart);
    } catch (e) {
        return err(e);
    }
}

/**
 * Removes a line item from the cart by its uid.
 * Attaches the bearer token when authenticated.
 */
export async function actionRemoveCartItem(
    cartId: string,
    itemUid: string
): Promise<CartActionResult<MagentoCart>> {
    try {
        const token = await tryGetToken();
        const cart = await removeCartItem(cartId, itemUid, token);
        return ok(cart);
    } catch (e) {
        return err(e);
    }
}

/**
 * Updates the quantity of a cart line item.
 * Attaches the bearer token when authenticated.
 */
export async function actionUpdateCartItemQty(
    cartId: string,
    itemUid: string,
    qty: number
): Promise<CartActionResult<MagentoCart>> {
    try {
        const token = await tryGetToken();
        const cart = await updateCartItemQty(cartId, itemUid, qty, token);
        return ok(cart);
    } catch (e) {
        return err(e);
    }
}

/**
 * Merges the guest cart into the customer's cart on login.
 * Reads the auth token from the cookie automatically.
 * Returns the merged customer cart.
 */
export async function actionMergeCarts(guestCartId: string): Promise<CartActionResult<MagentoCart>> {
    try {
        if (!(await isAuthenticated())) throw new Error("Cannot merge carts: user is not authenticated");
        const token = await getAuthToken();
        const cart = await mergeCarts(guestCartId, token);
        return ok(cart);
    } catch (e) {
        return err(e);
    }
}
