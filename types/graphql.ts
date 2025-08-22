export type GraphQLResponse<T> = {
    data: T;
} | {
    errors: GraphQLError[];
}


export type GraphQLError = {
    message: string;
    locations?: { line: number; column: number }[];
    path?: (string | number)[];
    extensions?: Record<string, any>;
};