import { GraphQLResponse } from "@/types/apollo";
import { print } from "graphql";
import GENERATE_CUSTOMER_TOKEN from "@/graphql/mutations/customers/generate_customer_token.graphql";
import CREATE_CUSTOMER from "@/graphql/mutations/customers/create_customer.graphql";
import GET_CUSTOMER_DATA from "@/graphql/queries/customer/get_customer_data.graphql";
import { User } from "@/types/customer";

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
  const res = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { email, password } }),
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Auth error: ${res.status} ${res.statusText}`);
  }

  const { data, errors }: GraphQLResponse<{ generateCustomerToken?: { token?: string } }> = await res.json();
  if (errors?.length) {
    throw new Error(errors.map(e => e.message).join("; "));
  }
  const token = data?.generateCustomerToken?.token;
  if (!token) throw new Error("No token returned");
  return token;
}

export async function createCustomer(input: CustomerCreateInput): Promise<CustomerLight | undefined> {
  const query = print(CREATE_CUSTOMER);
  const res = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { input } }),
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Signup error: ${res.status} ${res.statusText}`);
  }

  const { data, errors }: GraphQLResponse<{ createCustomer?: { customer?: CustomerLight } }> = await res.json();
  if (errors?.length) {
    throw new Error(errors.map(e => e.message).join("; "));
  }
  return data?.createCustomer?.customer;
}

export async function getCustomerData(userToken: string): Promise<User> {
    const query = print(GET_CUSTOMER_DATA);
    const res = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ query }),
        next: {
            tags: ["customer-data"]
        }
    });

    if (!res.ok) {
        throw new Error(`Auth error: ${res.status} ${res.statusText}`);
    }

    const { data, errors }: GraphQLResponse<{ customer?: User }> = await res.json();
    if (errors?.length) {
        throw new Error(errors.map(e => e.message).join("; "));
    }
    const userData = data?.customer;
    if (!userData) throw new Error("No userData returned");
    return userData;
}