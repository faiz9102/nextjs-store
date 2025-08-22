'use client';

import React, { createContext, useContext, useReducer, type Dispatch } from 'react';

export type CartItem = {
    uid: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    thumbnail: string;
};

type CartState = {
    items: CartItem[];
};

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: { uid: string } }
    | { type: 'CLEAR_CART' };

const CartContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<Dispatch<CartAction> | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM':
            return { ...state, items: addItem(state.items, action.payload) };
        case 'REMOVE_ITEM':
            return { ...state, items: removeItem(state.items, action.payload) };
        case 'CLEAR_CART':
            return { ...state, items: clearCart() };
        default:
            // Exhaustive check to help TypeScript catch unhandled actions
            const _exhaustive: never = action;
            throw new Error('Unknown action');
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });
    return (
        <CartContext.Provider value={state}>
            <CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
        </CartContext.Provider>
    );
}

export function useCart(): CartState {
    const cart = useContext(CartContext);
    if (!cart) throw new Error('useCart must be used within CartProvider');
    return cart;
}

export function useCartDispatch(): Dispatch<CartAction> {
    const cart = useContext(CartDispatchContext);
    if (!cart) throw new Error('useCartDispatch must be used within CartProvider');
    return cart;
}

function addItem(cartItems: CartItem[], payload: CartItem): CartItem[] {
    const existingItemIndex = cartItems.findIndex((item) => item.uid === payload.uid);

    if (existingItemIndex >= 0) {
        // Create a new array with the updated item
        return cartItems.map((item, index) =>
            index === existingItemIndex
                ? { ...item, quantity: item.quantity + payload.quantity }
                : item
        );
    }

    // If item doesn't exist, add it to the cart
    return [...cartItems, payload];
}

function removeItem(cartItems: CartItem[], payload: { uid: string }): CartItem[] {
    return cartItems.filter((item) => item.uid !== payload.uid);
}

function clearCart(): CartItem[] {
    return [];
}