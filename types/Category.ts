export type CategoryItem = {
    name: string;
    id: string;
    url_key: string;
};

export type CategoriesResponse = {
    categories?: {
        items?: Array<{
            children?: CategoryItem[];
        }>;
    };
};