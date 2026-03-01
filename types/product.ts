// noinspection JSUnusedGlobalSymbols

type ProductImage = { url: string; label?: string };
type Price = { value: number; currency: string };

export interface ProductItem {
    __typename: string; // "SimpleProduct" | "ConfigurableProduct" | etc.
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
            uid: string;   // used for client-side variant matching
            label: string;
            swatch_data?: ImageSwatchData | TextSwatchData | ColorSwatchData | SwatchData;
        }[];
    }[];
}

// Base swatch — plain text/value only
export interface SwatchData {
    value: string;
}

// Image swatch — has a thumbnail URL
export interface ImageSwatchData extends SwatchData {
    thumbnail: string;
}

// Text swatch — styled text label (value is the display text)
export interface TextSwatchData extends SwatchData {
    value: string;
}

// Color swatch — value is a CSS color (hex, rgb, etc.)
export interface ColorSwatchData extends SwatchData {
    value: string;
}

/** A single configurable variant: links a set of selected option uids to a concrete child product */
export interface ConfigurableVariant {
    product: {
        sku: string;
        stock_status: "IN_STOCK" | "OUT_OF_STOCK";
        media_gallery: ProductImage[];
    };
    /** Each attribute entry maps attribute_code → the selected option uid */
    attributes: {
        code: string;
        uid: string;
    }[];
}

export interface ProductPageProduct extends ProductItem {
    meta_title?: string;
    meta_description?: string;
    meta_keyword?: string;
    media_gallery: ProductImage[];
    /** Only present on ConfigurableProduct */
    variants?: ConfigurableVariant[];
}

export type ProductPrice = {
    regular_price: {
        value: number;
        currency: string;
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
    url_key?: FilterOperatorString;
    custom_attributes?: Record<string, FilterOperatorString | FilterOperatorNumber>;
    pageSize?: number;
    currentPage?: number;
    sort?: {
        field: string;
        direction: "ASC" | "DESC";
    };
};
