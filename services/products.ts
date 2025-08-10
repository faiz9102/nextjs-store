import GET_PRODUCTS_QUERY from "@/graphql/queries/products/get_products_by_category.graphql";
import { GraphQLResponse } from "@/types/apollo";
import { ProductItem } from "@/types/product";
import { print } from "graphql";

interface ProductsResponse {
    products: {
        total_count: number;
        items: ProductItem[];
    };
}

const getProductsByCategory = async (category_uid: string): Promise<ProductItem[]> => {
    "use cache";
    const queryString = print(GET_PRODUCTS_QUERY);

    try {
        const res = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST", // ✅ GraphQL POST
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: { "cat" : category_uid }, // ✅ Correct placement
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

        return data?.products?.items ?? []; // ✅ Return products directly
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export { getProductsByCategory };
