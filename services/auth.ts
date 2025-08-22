"use server";

import "server-only";
import {GraphQLResponse} from "@/types/graphql";
import {print} from "graphql";
import GENERATE_CUSTOMER_TOKEN from "@/graphql/mutations/customers/generate_customer_token.graphql";
import CREATE_CUSTOMER from "@/graphql/mutations/customers/create_customer.graphql";
import GET_CUSTOMER_DATA from "@/graphql/queries/customer/get_customer_data.graphql";
import {User} from "@/types/customer";
import {getAuthToken} from "@/lib/auth/token";

export type CustomerCreateInput = {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
};

type CustomerLight = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
};

export async function generateCustomerToken(email: string, password: string): Promise<string> {
    const query = print(GENERATE_CUSTOMER_TOKEN);
    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query, variables: {email, password}}),
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Auth error: ${response.status} ${response.statusText}`);
    }

    const res: GraphQLResponse<{ generateCustomerToken: { token: string } }> = await response.json();

    if ('errors' in res && res.errors.length) {
        throw new Error(res.errors.map(e => e.message).join("; "));
    }

    if ("data" in res && !res.data?.generateCustomerToken) {
        const token = res.data.generateCustomerToken?.token;
        if (!token) throw new Error("No token returned : Login failed");
        return token;
    }

    throw new Error("Unexpected response format");
}

export async function createCustomer(input: CustomerCreateInput): Promise<CustomerLight | undefined> {
    const query = print(CREATE_CUSTOMER);
    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query, variables: {input}}),
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Signup error: ${response.status} ${response.statusText}`);
    }

    const res: GraphQLResponse<{ createCustomer: { customer: CustomerLight } }> = await response.json();

    if ('errors' in res && res.errors.length) {
        throw new Error(res.errors.map(e => e.message).join("; "));
    }

    if ('data' in res)
        return res.data.createCustomer.customer;

    throw new Error("Unexpected response format");
}

export async function getCustomerData(): Promise<User> {
    const userToken = await getAuthToken();

    if (!userToken) {
        throw new Error("User is not authenticated");
    }

    const query = print(GET_CUSTOMER_DATA);
    const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({query}),
        next: {
            tags: ["customer-data"]
        }
    });

    if (!response.ok) {
        throw new Error(`Auth error: ${response.status} ${response.statusText}`);
    }

    const res: GraphQLResponse<{ customer: User }> = await response.json();

    if ('errors' in res && res.errors.length) {
        throw new Error(res.errors.map(e => e.message).join("; "));
    }

    if ('data' in res && !res.data?.customer) {
        return res.data.customer;
    }

    throw new Error("Unexpected response format");
}