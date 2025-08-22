import "server-only";
import CREATE_GUEST_CART from '@/graphql/mutations/cart/create_guest_cart.graphql';
import {GraphQLResponse, GraphQLError} from '@/types/graphqlTypes';
import {print} from "graphql";

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