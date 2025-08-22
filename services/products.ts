import GET_FILTERED_PRODUCTS_QUERY from "@/graphql/queries/products/get_filtered_products.graphql";
import {GraphQLError, GraphQLResponse} from "@/types/graphql";
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
        const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: { cat: category_uid },
            }),
        });

        if (!response.ok) {
            console.error("Error fetching products:", response.statusText);
            return [];
        }

        const res: GraphQLResponse<ProductsResponse> = await response.json();

        if ('errors' in res && res.errors.length) {
            console.error("GraphQL errors:", res.errors);
            return [];
        }

        if ('data' in res) {
            return res.data.products.items ?? [];
        }

        throw new Error("Unexpected response format");
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
        const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: { filter: filters },
            }),
        });

        if (!response.ok) {
            console.error("Error fetching filtered products:", response.statusText);
            return [];
        }

        const res: GraphQLResponse<ProductsResponse> = await response.json();

        if ('errors' in res && res.errors?.length) {
            console.error("GraphQL errors:", res.errors);
            return [];
        }

        if ('data' in res) {
            return res.data.products.items ?? [];
        }

        throw new Error("Unexpected response format");
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
        const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: { filter: filter },
            }),
        });

        if (!response.ok) {
            console.error("Error fetching product:", response.statusText , "   " ,url_key);
            return null;
        }

        const res: GraphQLResponse<ProductPageProductsResponse> = await response.json();

        if ('errors' in res && res.errors?.length) {
            console.error("GraphQL errors:", res.errors);
            return null;}

        if ('data' in res) {
            return res.data?.products?.items[0] ?? null;
        }

        throw new Error("Unexpected response format");
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        return null;
    }
};

export { getProductsByCategory, getFilteredProducts, getProductByUrlKey};
