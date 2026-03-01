import { ApolloClient, InMemoryCache } from '@apollo/client';

type GraphQLResponse<T> = {
    data?: T;
    errors?: GraphQLError[];
};

type GraphQLError = {
    message: string;
    locations?: { line: number; column: number }[];
    path?: (string | number)[];
    extensions?: Record<string, unknown>;
};

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
});

export {
    client,
    type GraphQLError,
    type GraphQLResponse
};