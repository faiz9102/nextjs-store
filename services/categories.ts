"use strict"
// @ts-expect-error not a TypeScript file
import GET_CATEGORIES_QUERY from "@/graphql/queries/categories/get_all_categories.graphql";
import { print } from "graphql";

type Category = {
    name: string;
    id: string;
    slug: string;
};

type CategoriesResponse = {
    categories?: {
        items?: Array<{
            children?: Category[];
        }>;
    };
}

const getAllCategories = async () => {
    // convert the GraphQL query to a string
    const queryString = print(GET_CATEGORIES_QUERY);

    // @ts-expect-error The environment variable is expected to be set in the Next.js environment
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
    const { data, errors } = await res.json();
    if (errors) {
        console.error("GraphQL errors:", errors);
        return [];
    }

    const items = (data?.categories?.items ?? []) as Array<{ children?: Category[] }>;
    const categories: Category[] = items.flatMap((item) =>
        (item.children ?? []).map((child) => ({
            name: child.name,
            id: child.id || child.name,
            slug: child.slug || child.name.toLowerCase().replace(/\s+/g, '-')
        }))
    );
    return categories;
}

export {
    getAllCategories
};