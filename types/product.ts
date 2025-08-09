export type ProductItem = {
    uid: string;
    name: string;
    sku: string;
    price: {
        regularPrice: {
            amount: {
                value: number;
                currency: string;
            };
        };
    }
}