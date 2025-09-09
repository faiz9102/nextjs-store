// Money type for price values
export interface Money {
    value: number;
    currency: string;
}

// Applied tax on cart
export interface AppliedTax {
    amount: Money;
    label: string;
}

// Applied discount on cart
export interface AppliedDiscount {
    amount: Money;
    applied_to?: string; // sometimes discount applies to subtotal/total
    coupon?: {
        code: string;
    };
}

// Prices section in the cart
export interface CartPrices {
    subtotal_including_tax?: Money;
    subtotal_excluding_tax?: Money;
    subtotal_with_discount_excluding_tax?: Money;
    grand_total: Money;
    grand_total_excluding_tax?: Money;
    applied_taxes?: AppliedTax[];
    discounts?: AppliedDiscount[];
}

// Product info in the cart
export interface CartProduct {
    sku: string;
    name: string;
    url_key?: string;
    thumbnail?: {
        url: string;
        label?: string;
        disabled?: boolean;
    };
}

// Cart item prices information
export interface CartItemPrices {
    price?: Money;
    row_total?: Money;
    price_including_tax?: Money;
    row_total_including_tax?: Money;
    total_item_discount?: Money;
}

// A single cart item
export interface CartItem {
    uid: string;
    quantity: number;
    is_available?: boolean;
    not_available_message?: string;
    product: CartProduct;
    prices?: CartItemPrices;
    __typename: string;
    errors?: {
        code: string;
        message: string;
    }[];
}

// Wrapper for itemsV2
export interface CartItemsV2 {
    items: CartItem[];
}

// Gift message info
export interface GiftMessage {
    message?: string;
    from?: string;
    to?: string;
}

// The main cart object
export interface CustomerCart {
    id: string;
    itemsV2: CartItemsV2;
    prices: CartPrices;
    total_quantity?: number;
    gift_message?: GiftMessage;
}

export type cartErrorCodes = "INSUFFICIENT_STOCK" |
    "PRODUCT_NOT_FOUND" |
    "NOT_SALABLE" |
    "COULD_NOT_FIND_CART_ITEM" |
    "REQUIRED_PARAMETER_MISSING" |
    "INVALID_PARAMETER_VALUE" |
    "UNDEFINED" |
    "PERMISSION_DENIED";