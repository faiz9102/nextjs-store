import "server-only";
import CREATE_GUEST_CART from '@/graphql/mutations/cart/create_guest_cart.graphql';
import GET_CUSTOMER_CART from '@/graphql/mutations/cart/get_customer_cart.graphql';
import MERGE_GUEST_CART_TO_CUSTOMER_CART from '@/graphql/mutations/cart/merge_guest_cart_to_customer_cart.graphql';
import UPDATE_CART_ITEMS from '@/graphql/mutations/cart/update_cart_items.graphql';
import {GraphQLResponse, GraphQLError} from '@/types/graphqlTypes';
import {print} from "graphql";
import {type CustomerCart, cartErrorCodes} from "@/types/cart";
import ADD_PRODUCT_TO_CART from "@/graphql/mutations/cart/add_product_to_cart.graphql";

interface CreateGuestCartResponse {
    createGuestCart: {
        cart: {
            id: string
        }
    }
}

export async function createGuestCart(): Promise<string> {
    const query = print(CREATE_GUEST_CART);

    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query}),
        cache: "no-store"
    });

    const res: GraphQLResponse<CreateGuestCartResponse> = await response.json();

    if ('errors' in res && res.errors?.length) {
        throw new Error(res.errors.map((e: GraphQLError) => e.message).join("; "));
    }

    if ('data' in res) {
        return res.data.createGuestCart.cart.id;
    }

    throw new Error("Unexpected response format");
}

interface CustomerCartResponse {
    customerCart: CustomerCart;
}

export async function getCustomerCart(authToken: string): Promise<CustomerCart> {
    const query = print(GET_CUSTOMER_CART);

    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({query}),
        cache: "no-store"
    });

    const res: GraphQLResponse<CustomerCartResponse> = await response.json();

    if ('errors' in res && res.errors?.length) {
        throw new Error(res.errors.map((e: GraphQLError) => e.message).join("; "));
    }

    if ('data' in res) {
        return res.data.customerCart;
    }

    throw new Error("Unexpected response format");
}

interface MergeCartsResponse {
    mergeCarts: CustomerCart;
}

/**
 * Merges a guest cart into the customer's cart
 * @param guestCartId The guest cart ID
 * @param customerCartId The customer's cart ID
 * @param authToken The customer's auth token
 */
export async function mergeCarts(
    guestCartId: string,
    customerCartId: string,
    authToken: string
): Promise<CustomerCart> {
    const query = print(MERGE_GUEST_CART_TO_CUSTOMER_CART);

    const variables = {
        source_cart_id: guestCartId,
        destination_cart_id: customerCartId,
    };

    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
    });

    const res: GraphQLResponse<MergeCartsResponse> = await response.json();

    if ("errors" in res && res.errors?.length) {
        throw new Error(res.errors.map((e: GraphQLError) => e.message).join("; "));
    }

    if ("data" in res) {
        return res.data.mergeCarts;
    }

    throw new Error("Unexpected response format");
}

interface AddSimpleProductsToCartResponse {
    addSimpleProductsToCart: { cart: CustomerCart };
}

/**
 * Add product to cart
 */
export async function addItemToGuestCart(cartId: string, item: { sku: string, quantity: number }) {
    const query = print(ADD_PRODUCT_TO_CART);

    const variables = {
        'cart_id' : cartId,
        'sku': item.sku,
        'quantity': item.quantity
    }
    console.log("Adding to cart:", variables);

    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query, variables}),
        cache: "no-store"
    });

    const res: GraphQLResponse<AddSimpleProductsToCartResponse> = await response.json();

    if ('errors' in res && res.errors?.length) {
        throw new Error(res.errors.map((e: GraphQLError) => e.message).join("; "));
    }

    if ('data' in res) {
        return res.data.addSimpleProductsToCart.cart;
    }

    throw new Error("Unexpected response format");
}

export async function addItemToCustomerCart(token : string ,cartId: string, item: { sku: string, quantity: number }) {
    const query = print(ADD_PRODUCT_TO_CART);

    const variables = {
        'cart_id' : cartId,
        'sku': item.sku,
        'quantity': item.quantity
    }

    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({query, variables}),
        cache: "no-store"
    });

    const res: GraphQLResponse<AddSimpleProductsToCartResponse> = await response.json();

    if ('errors' in res && res.errors?.length) {
        throw new Error(res.errors.map((e: GraphQLError) => e.message).join("; "));
    }

    if ('data' in res) {
        return res.data.addSimpleProductsToCart.cart;
    }

    throw new Error("Unexpected response format");
}

export async function updateCart(
    cartId: string,
    item: { uid: string; quantity: number },
    token?: string
): Promise<CustomerCart> {
    const query = print(UPDATE_CART_ITEMS);

    const input: UpdateCart = {
        cart_id: cartId,
        cart_items: [
            {
                cart_item_uid: item.uid,
                quantity: item.quantity,
            },
        ],
    };
    const variables = {
        input,
    };

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
    });

    const res: GraphQLResponse<UpdateCartItemsResponse> = await response.json();

    if ("errors" in res && res.errors?.length) {
        throw new Error(res.errors.map((e: GraphQLError) => e.message).join("; "));
    }

    if ("data" in res) {
        const payload = res.data.updateCartItems;
        if (payload.errors && payload.errors.length) {
            throw new Error(payload.errors.map(e => e.message).join("; "));
        }
        return payload.cart;
    }

    throw new Error("Unexpected response format");
}

type UpdateCartItemsResponse = {
    updateCartItems: {
        cart: CustomerCart,
        errors: { message: string , code : cartErrorCodes}[]
    };
}

type UpdateCart = {
    cart_id: string,
    cart_items: {
        cart_item_uid: string,
        quantity: number
    }[]
}