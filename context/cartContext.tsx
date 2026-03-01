"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    actionCreateGuestCart,
    actionGetCart,
    actionAddToCart,
    actionRemoveCartItem,
    actionUpdateCartItemQty,
    actionMergeCarts,
} from "@/app/actions/cart";
import { MagentoCart, MagentoCartItem, AddToCartPayload } from "@/types/cart";

// ---------------------------------------------------------------------------
// localStorage key for persisting the guest cart ID.
// Only used for unauthenticated (guest) carts — cleared on login.
// ---------------------------------------------------------------------------
const CART_ID_KEY = "magento_cart_id";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface CartContextValue {
    items: MagentoCartItem[];
    total: { value: number; currency: string } | null;
    itemCount: number;
    loading: boolean;
    error: string | null;

    /** Add a product to the cart (simple or configurable) */
    addToCart: (payload: AddToCartPayload) => Promise<void>;
    /** Remove a line item by its Magento cart item uid */
    removeFromCart: (itemUid: string) => Promise<void>;
    /** Update the quantity of a cart line */
    updateQty: (itemUid: string, qty: number) => Promise<void>;
    /** Called after login: merges guest cart into customer cart, then clears localStorage */
    mergeWithCustomerCart: () => Promise<void>;
    /** Called after logout: drops the current cart and creates a fresh guest cart */
    resetCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<MagentoCart | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Holds the active cart ID (guest or customer). Never stored in localStorage
    // for customer carts — populated from the server response after merge/fetch.
    const cartIdRef = useRef<string | null>(null);

    /** Sync local state and ref from a fresh MagentoCart object */
    const applyCart = useCallback((c: MagentoCart) => {
        cartIdRef.current = c.id;
        setCart(c);
    }, []);

    /**
     * On mount: determine whether the user is already authenticated.
     * - Authenticated → fetch customer cart (no localStorage needed)
     * - Guest         → reuse or create a guest cart ID from localStorage
     */
    useEffect(() => {
        let cancelled = false;

        async function init() {
            setLoading(true);
            try {
                const storedCartId = localStorage.getItem(CART_ID_KEY);

                if (storedCartId) {
                    // Guest path: reuse existing cart ID
                    const cartRes = await actionGetCart(storedCartId);
                    if (!cartRes.ok) {
                        // Stored ID is stale (e.g. expired) — create a fresh guest cart
                        const newRes = await actionCreateGuestCart();
                        if (!newRes.ok) throw new Error(newRes.error.message);
                        localStorage.setItem(CART_ID_KEY, newRes.data);
                        cartIdRef.current = newRes.data;
                        // New cart is empty — nothing to apply
                        return;
                    }
                    if (!cancelled) applyCart(cartRes.data);
                } else {
                    // No guest cart in localStorage — try authenticated customer cart first
                    const customerCartRes = await actionGetCart(); // no cartId → uses auth cookie
                    if (customerCartRes.ok) {
                        // Authenticated: use the customer's cart
                        if (!cancelled) applyCart(customerCartRes.data);
                    } else {
                        // Not authenticated and no stored cart → create a new guest cart
                        const newRes = await actionCreateGuestCart();
                        if (!newRes.ok) throw new Error(newRes.error.message);
                        localStorage.setItem(CART_ID_KEY, newRes.data);
                        cartIdRef.current = newRes.data;
                        // New empty cart — nothing to render yet
                    }
                }
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Cart init failed");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        init();
        return () => { cancelled = true };
    }, [applyCart]);

    // ---------------------------------------------------------------------------
    // Cart operations — cartIdRef.current is always the active cart ID
    // (guest or customer). Server actions auto-attach the bearer token when needed.
    // ---------------------------------------------------------------------------

    const addToCart = useCallback(async (payload: AddToCartPayload) => {
        const cartId = cartIdRef.current;
        if (!cartId) { setError("Cart not ready"); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await actionAddToCart(cartId, payload);
            if (!res.ok) throw new Error(res.error.message);
            applyCart(res.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to add to cart");
        } finally {
            setLoading(false);
        }
    }, [applyCart]);

    const removeFromCart = useCallback(async (itemUid: string) => {
        const cartId = cartIdRef.current;
        if (!cartId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await actionRemoveCartItem(cartId, itemUid);
            if (!res.ok) throw new Error(res.error.message);
            applyCart(res.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to remove item");
        } finally {
            setLoading(false);
        }
    }, [applyCart]);

    const updateQty = useCallback(async (itemUid: string, qty: number) => {
        const cartId = cartIdRef.current;
        if (!cartId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await actionUpdateCartItemQty(cartId, itemUid, qty);
            if (!res.ok) throw new Error(res.error.message);
            applyCart(res.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update quantity");
        } finally {
            setLoading(false);
        }
    }, [applyCart]);

    /**
     * Merges the current guest cart into the authenticated customer's cart.
     *
     * Flow:
     * 1. If there is a guest cart in localStorage, merge it into the customer cart.
     * 2. Clear localStorage — the customer cart is token-scoped, needs no stored ID.
     * 3. applyCart stores the merged cart ID in cartIdRef so subsequent ops work.
     *
     * If there was no guest cart, just fetch the customer's existing cart.
     */
    const mergeWithCustomerCart = useCallback(async () => {
        const guestCartId = localStorage.getItem(CART_ID_KEY);

        setLoading(true);
        setError(null);
        try {
            if (guestCartId) {
                const res = await actionMergeCarts(guestCartId);
                if (!res.ok) throw new Error(res.error.message);
                // Wipe guest cart from localStorage — no longer needed
                localStorage.removeItem(CART_ID_KEY);
                applyCart(res.data); // cartIdRef.current ← merged customer cart ID
            } else {
                // No guest cart to merge — just load the customer's existing cart
                const res = await actionGetCart();
                if (!res.ok) throw new Error(res.error.message);
                applyCart(res.data);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Cart merge failed");
        } finally {
            setLoading(false);
        }
    }, [applyCart]);

    /**
     * Resets the cart to a fresh guest cart on logout.
     * Clears localStorage and in-memory state, then creates a new empty guest cart.
     */
    const resetCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            localStorage.removeItem(CART_ID_KEY);
            cartIdRef.current = null;
            setCart(null);

            const res = await actionCreateGuestCart();
            if (!res.ok) throw new Error(res.error.message);
            localStorage.setItem(CART_ID_KEY, res.data);
            cartIdRef.current = res.data;
            // New cart is empty — no items to display
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to reset cart");
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------------------------------------------------------------------------
    // Derived values
    // ---------------------------------------------------------------------------
    // itemsV2.items holds the actual line items; fall back to empty array when cart is null
    const items = cart?.itemsV2?.items ?? [];
    const total = cart?.prices?.grand_total ?? null;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, total, itemCount, loading, error, addToCart, removeFromCart, updateQty, mergeWithCustomerCart, resetCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}