import GET_FILTERED_PRODUCTS_QUERY from "@/graphql/queries/products/get_filtered_products.graphql";
import { GraphQLResponse } from "@/types/apollo";
import { ProductItem } from "@/types/product";
import { print } from "graphql";
import { type ProductFilter } from "@/types/product";
import GET_PRODUCTS_BY_CATEGORY_QUERY from "@/graphql/queries/products/get_products_by_category.graphql";

interface ProductsResponse {
    products: {
        total_count: number;
        items: ProductItem[];
    };
}

/**
 * Fetch products by category UID
 */
const getProductsByCategory = async (category_uid: string): Promise<ProductItem[]> => {
    "use cache";
    const queryString = print(GET_PRODUCTS_BY_CATEGORY_QUERY);

    try {
        const res = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: { cat: category_uid },
            }),
        });

        if (!res.ok) {
            console.error("Error fetching products:", res.statusText);
            return [];
        }

        const { data, errors }: GraphQLResponse<ProductsResponse> = await res.json();

        if (errors) {
            console.error("GraphQL errors:", errors);
            return [];
        }

        return data?.products?.items ?? [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

/**
 * Fetch products by arbitrary Magento filters
 */
const getFilteredProducts = async (filters: ProductFilter): Promise<ProductItem[]> => {
    "use cache";
    const queryString = print(GET_FILTERED_PRODUCTS_QUERY);

    try {
        const res = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: { filter: filters },
            }),
        });

        if (!res.ok) {
            console.error("Error fetching filtered products:", res.statusText);
            return [];
        }

        const { data, errors }: GraphQLResponse<ProductsResponse> = await res.json();

        if (errors) {
            console.error("GraphQL errors:", errors);
            return [];
        }

        return data?.products?.items ?? [];
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        return [];
    }
};

export { getProductsByCategory, getFilteredProducts };
