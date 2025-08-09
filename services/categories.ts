// @ts-expect-error import { GraphQLError } from "graphql";
import GET_CATEGORIES_QUERY from "@/graphql/queries/categories/get_all_categories.graphql";
import {CategoriesResponse} from "@/types/Category";
import { GraphQLResponse } from "@/types/apollo"
import {print} from "graphql";

type Category = {
    name: string;
    id: string;
    url_key: string;
};

type CategoriesResponse = {
    categories?: {
        items?: Array<{
            children?: Category[];
        }>;
    };
};


const getAllCategories = async (): Promise<Category[]> => {
    'use cache';
    const queryString = print(GET_CATEGORIES_QUERY);

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: queryString }),
        });

        if (!res.ok) {
            console.error("Error fetching categories:", res.statusText);
            return [];
        }

        const { data, errors }: GraphQLResponse<CategoriesResponse> = await res.json();

        if (errors) {
            console.error("GraphQL errors:", errors);
            return [];
        }

        const items = data?.categories?.items ?? [];
        return items.flatMap((item) =>
            (item.children ?? []).map((child) => ({
                name: child.name,
                id: child.id || child.name,
                slug: child.url_key || child.name.toLowerCase().replace(/\s+/g, '-'),
                url_key: child.url_key
            }))
        );
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export { getAllCategories };