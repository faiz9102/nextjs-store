import GET_FILTERED_PRODUCTS_QUERY from "@/graphql/queries/products/get_filtered_products.graphql";
import { GraphQLResponse } from "@/types/apollo";
import { ProductItem } from "@/types/product";
import { print } from "graphql";
import { type ProductFilter, ProductPageProduct } from "@/types/product";
import GET_PRODUCTS_BY_CATEGORY_QUERY from "@/graphql/queries/products/get_products_by_category.graphql";
import GET_PRODUCT_FOR_PRODUCT_PAGE_QUERY from "@/graphql/queries/products/get_product_for_product_page.graphql";

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

interface ProductPageProductsResponse {
    products: {
        total_count: number;
        items: ProductPageProduct[];
    };
}

const getProductByUrlKey = async (url_key: string): Promise<ProductPageProduct | null> => {
    "use cache";
    const queryString = print(GET_PRODUCT_FOR_PRODUCT_PAGE_QUERY);

    const filter: ProductFilter = {
        "url_key":  { eq: url_key }
    }

    try {
        const res = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: { filter: filter },
            }),
        });

        if (!res.ok) {
            console.error("Error fetching product:", res.statusText , "   " ,url_key);
            return null;
        }

        const { data, errors }: GraphQLResponse<ProductPageProductsResponse> = await res.json();

        if (errors) {
            console.error("GraphQL errors:", errors);
            return null;
        }

        return data?.products?.items[0] ?? null;
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        return null;
    }
};

export { getProductsByCategory, getFilteredProducts, getProductByUrlKey};
