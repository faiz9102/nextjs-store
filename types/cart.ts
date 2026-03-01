/** Magento cart item as returned by the cart GraphQL query/mutations */
export interface MagentoCartItem {
    /** Unique cart line identifier — used for remove/update operations */
    uid: string;
    quantity: number;
    product: {
        name: string;
        sku: string;
        thumbnail: { url: string } | null;
    };
    prices: {
        row_total: { value: number; currency: string };
    };
}

/** Top-level Magento cart object */
export interface MagentoCart {
    id: string;
    itemsV2: {
        items: MagentoCartItem[];
        total_count: number;
    };
    prices: {
        grand_total: { value: number; currency: string };
    };
}

/** Payload for adding a product to the cart.
 *  - Simple product: only sku + qty
 *  - Configurable product: parentSku (configurable) + sku (child variant) + qty
 */
export type AddToCartPayload =
    | { sku: string; qty: number; parentSku?: never }
    | { sku: string; qty: number; parentSku: string };
