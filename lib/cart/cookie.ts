import "server-only";
import { cookies } from "next/headers";
import CONFIG from "@/config";
import {createGuestCart} from "@/services/cart";
function getCartCookieConfig() {
    const { cookie : cartCookieConfig } = CONFIG.cart.config
    return cartCookieConfig;
}

export const GUEST_CART_COOKIE_NAME : string = getCartCookieConfig().guest.name;
export const CUSTOMER_CART_COOKIE_NAME : string = getCartCookieConfig().customer.name;


//  Guest Cart Cookie Functions
export async function getGuestCartCookie() : Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(GUEST_CART_COOKIE_NAME)?.value ?? null;
}

export async function isGuestCartCookieSet() : Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.has(GUEST_CART_COOKIE_NAME);
}

export async function deleteGuestCartCookie() : Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(GUEST_CART_COOKIE_NAME);

    if(cookieStore.has(GUEST_CART_COOKIE_NAME)){
        throw new Error("Failed to delete cart cookie");
    }
}

export async function generateAndSetGuestCartCookie() : Promise<void> {
    const cartId = await createGuestCart();
    const  { guest } = getCartCookieConfig();
    const cookieStore = await cookies();

    cookieStore.set({
        name: GUEST_CART_COOKIE_NAME,
        value: cartId,
        httpOnly: guest.httpOnly,
        secure: guest.secure,
        path: guest.path,
        maxAge: guest.maxAge,
        sameSite : guest.sameSite
    });
}


//  Customer Cart Cookie Functions

export async function getCustomerCartCookie() : Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(GUEST_CART_COOKIE_NAME)?.value ?? null;
}

export async function isCustomerCartCookieSet() : Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.has(GUEST_CART_COOKIE_NAME);
}

export async function deleteCustomerCartCookie() : Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(GUEST_CART_COOKIE_NAME);

    if(cookieStore.has(GUEST_CART_COOKIE_NAME)){
        throw new Error("Failed to delete cart cookie");
    }
}
export async function generateAndSetCustomerCartCookie(customerAuthToken: string) : Promise<void> {
    return;
}

//  Universal Cart Ulitily Functions

export async function clearAllCartCookies() : Promise<void> {
    await deleteGuestCartCookie();
    await deleteCustomerCartCookie();
}

export async function isCartCookieSet() : Promise<boolean> {
    return (await isGuestCartCookieSet()) || (await isCustomerCartCookieSet());
}

export async function getCartCookie() : Promise<string | null> {
    const customerCart = await getCustomerCartCookie();
    if (customerCart) {
        return customerCart;
    }

    const guestCart = await getGuestCartCookie();
    if (guestCart) {
        return guestCart;
    }

    return null;
}
export async function getCartId() : Promise<string | null> {
    return getCartCookie();
}

export async function upgradeGuestCartToCustomer(guestCartId : string) : Promise<void> {}
{

}
