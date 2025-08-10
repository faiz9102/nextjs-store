type ProductImage = { url: string; label?: string };
type Price = { value: number; currency: string };

export interface ProductItem {
    uid: string;
    name: string;
    sku: string;
    url_key?: string;
    canonical_url?: string;
    small_image?: ProductImage;
    thumbnail?: ProductImage;
    price_range: {
        minimum_price: {
            regular_price: Price;
            final_price: Price;
        };
    };
    categories: { uid: string; name: string }[];
    configurable_options?: {
        attribute_code: string;
        label: string;
        values: {
            label: string;
            swatch_data?: {
                value?: string; // HEX or image
                thumbnail?: string; // For image swatches
            };
        }[];
    }[];
}

export type ProductPrice = {
    regular_price: {
        value: number;
        currency: string
    };
};


export type FilterOperatorString = {
    eq?: string;
    in?: string[];
    match?: string;
};

export type FilterOperatorNumber = {
    eq?: number;
    in?: number[];
    from?: number;
    to?: number;
};

export type ProductFilter = {
    category_uid?: FilterOperatorString;
    category_ids?: FilterOperatorString;
    sku?: FilterOperatorString;
    name?: FilterOperatorString;
    price?: FilterOperatorNumber;
    visibility?: FilterOperatorNumber;
    status?: FilterOperatorNumber;
    custom_attributes?: Record<string, FilterOperatorString | FilterOperatorNumber>;

    pageSize?: number;
    currentPage?: number;
    sort?: {
        field: string;
        direction: "ASC" | "DESC";
    };
};
