'use client';

import React, { createContext, useContext, useReducer, type Dispatch } from 'react';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: { id: string } }
    | { type: 'CLEAR_CART' };

const CartContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<Dispatch<CartAction> | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            // Exhaustive check to help TypeScript catch unhandled actions
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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