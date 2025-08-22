"use server";

import { createGuestCart } from "@/services/cart";

export async function generateGuestCartId() : Promise<string> {
    return await createGuestCart();
}

