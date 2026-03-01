"use server";

import "server-only";
import { print } from "graphql";
import { GraphQLResponse } from "@/types/apollo";
import { MagentoCart } from "@/types/cart";

import CREATE_GUEST_CART from "@/graphql/mutations/cart/create_guest_cart.graphql";
import ADD_SIMPLE_TO_CART from "@/graphql/mutations/cart/add_simple_to_cart.graphql";
import ADD_CONFIGURABLE_TO_CART from "@/graphql/mutations/cart/add_configurable_to_cart.graphql";
import REMOVE_CART_ITEM from "@/graphql/mutations/cart/remove_cart_item.graphql";
import UPDATE_CART_ITEM from "@/graphql/mutations/cart/update_cart_item.graphql";
import MERGE_CARTS from "@/graphql/mutations/cart/merge_carts.graphql";
import GET_CART from "@/graphql/queries/cart/get_cart.graphql";
import GET_CUSTOMER_CART from "@/graphql/queries/cart/get_customer_cart.graphql";

const ENDPOINT = process.env.MAGENTO_GRAPHQL_ENDPOINT as string;

/** Generic fetch helper — throws on network errors, returns typed response */
async function gqlFetch<T>(
    query: string,
    variables: Record<string, unknown> = {},
    token?: string
): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
        cache: "no-store", // cart data must always be fresh
    });

    if (!res.ok) throw new Error(`Cart API error: ${res.status} ${res.statusText}`);

    const json: GraphQLResponse<T> = await res.json();
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
    if (!json.data) throw new Error("No data returned from cart API");

    return json.data;
}

// ---------------------------------------------------------------------------
// Guest cart
// ---------------------------------------------------------------------------

/** Creates a new Magento guest cart and returns its ID */
export async function createGuestCart(): Promise<string> {
    const data = await gqlFetch<{ createEmptyCart: string }>(print(CREATE_GUEST_CART));
    if (!data.createEmptyCart) throw new Error("Failed to create guest cart");
    return data.createEmptyCart;
}

// ---------------------------------------------------------------------------
// Cart reads
// ---------------------------------------------------------------------------

/** Fetches a guest/anonymous cart by ID */
export async function getCart(cartId: string): Promise<MagentoCart> {
    const data = await gqlFetch<{ cart: MagentoCart }>(print(GET_CART), { cartId });
    return data.cart;
}

/** Fetches the authenticated customer's cart (token-scoped, no cart ID needed) */
export async function getCustomerCart(token: string): Promise<MagentoCart> {
    const data = await gqlFetch<{ customerCart: MagentoCart }>(print(GET_CUSTOMER_CART), {}, token);
    return data.customerCart;
}

// ---------------------------------------------------------------------------
// Add to cart
// ---------------------------------------------------------------------------

/**
 * Adds a simple product to the cart.
 * Pass `token` for authenticated customer carts — Magento validates ownership.
 */
export async function addSimpleToCart(
    cartId: string,
    sku: string,
    qty: number,
    token?: string
): Promise<MagentoCart> {
    // console.log("Adding to cart:", { cartId, sku, qty, token: token });
    const data = await gqlFetch<{ addSimpleProductsToCart: { cart: MagentoCart } }>(
        print(ADD_SIMPLE_TO_CART),
        { cartId, sku, qty },
        token
    );
    return data.addSimpleProductsToCart.cart;
}

/**
 * Adds a configurable product variant to the cart.
 * parentSku = the configurable product SKU, childSku = the selected variant SKU.
 * Pass `token` for authenticated customer carts.
 */
export async function addConfigurableToCart(
    cartId: string,
    parentSku: string,
    childSku: string,
    qty: number,
    token?: string
): Promise<MagentoCart> {
    const data = await gqlFetch<{ addConfigurableProductsToCart: { cart: MagentoCart } }>(
        print(ADD_CONFIGURABLE_TO_CART),
        { cartId, parentSku, childSku, qty },
        token
    );
    return data.addConfigurableProductsToCart.cart;
}

// ---------------------------------------------------------------------------
// Modify cart items
// ---------------------------------------------------------------------------

/**
 * Removes a cart line by its uid.
 * Pass `token` for authenticated customer carts.
 */
export async function removeCartItem(cartId: string, itemUid: string, token?: string): Promise<MagentoCart> {
    const data = await gqlFetch<{ removeItemFromCart: { cart: MagentoCart } }>(
        print(REMOVE_CART_ITEM),
        { cartId, itemUid },
        token
    );
    return data.removeItemFromCart.cart;
}

/**
 * Updates the quantity of a cart line.
 * Pass `token` for authenticated customer carts.
 */
export async function updateCartItemQty(
    cartId: string,
    itemUid: string,
    qty: number,
    token?: string
): Promise<MagentoCart> {
    const data = await gqlFetch<{ updateCartItems: { cart: MagentoCart } }>(
        print(UPDATE_CART_ITEM),
        { cartId, itemUid, qty },
        token
    );
    return data.updateCartItems.cart;
}

// ---------------------------------------------------------------------------
// Cart merge (guest → customer on login)
// ---------------------------------------------------------------------------

/**
 * Merges the guest cart into the authenticated customer's cart.
 * Fetches the customer's current cart ID first (Magento 2.4.x requires destination_cart_id),
 * then calls mergeCarts. Returns the merged customer MagentoCart.
 */
export async function mergeCarts(guestCartId: string, customerToken: string): Promise<MagentoCart> {
    // Step 1: get the customer's active cart ID (required as destination_cart_id)
    const customerCart = await getCustomerCart(customerToken);
    const customerCartId = customerCart.id;

    // Step 2: merge — source = guest cart, destination = customer cart
    const data = await gqlFetch<{ mergeCarts: MagentoCart }>(
        print(MERGE_CARTS),
        { guestCartId, customerCartId },
        customerToken
    );
    return data.mergeCarts;
}
