import GET_CATEGORIES_QUERY from "@/graphql/queries/categories/get_all_categories.graphql";
import { GraphQLResponse } from "@/types/graphqlTypes"
import { type CategoryItem } from "@/types/category";
import {print} from "graphql";

type CategoriesResponse = {
    categories: {
        items: Array<{
            children: CategoryItem[];
        }>;
    };
};

// Helper function to transform GraphQL category data to our CategoryItem format
const mapCategoryData = (category: CategoryItem): CategoryItem => {
    return {
        id: category.id,
        name: category.name,
        uid: category.uid,
        url_key: category.url_key,
        path: category.path || '',
        level: category.level || 0,
        description: category.description || '',
        image: category.image || '',
        children: category.children ? category.children.map(mapCategoryData) : []
    };
};

const getAllCategories = async (): Promise<CategoryItem[]> => {
    "use cache";

    const queryString = print(GET_CATEGORIES_QUERY);

    try {
        const response = await fetch(process.env.MAGENTO_GRAPHQL_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: queryString }),
        });

        if (!response.ok) {
            console.error("Error fetching categories:", response.statusText);
            return [];
        }

        const res: GraphQLResponse<CategoriesResponse> = await response.json();


        if ('errors' in res && res.errors.length > 0) {
            throw new Error(res.errors.map(e => e.message).join("; "));
        }

        if ("data" in res) {
            const items = res.data.categories.items ?? [];
            return items.flatMap((item) =>
                (item.children ?? []).map(mapCategoryData)
            );
        }


        throw new Error("Unexpected response format");
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export { getAllCategories };