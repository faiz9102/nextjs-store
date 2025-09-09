'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { initializeCart, addProductToCart, updateCartItemQty } from '@/app/actions/cart';
import type { CustomerCart } from '@/types/cart';

export type CartItem = {
    uid: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    thumbnail: string;
    __typename: string;
};

interface CartContextValue {
    items: CartItem[];
    totalQuantity: number;
    addToCart: (sku: string, quantity?: number) => Promise<void>;
    updateCartItem: (uid: string, quantity: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

interface InternalState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

type Action =
    | { type: 'SET_ITEMS'; payload: CartItem[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'CLEAR_ERROR' };

const CartContext = createContext<CartContextValue | undefined>(undefined);

function reducer(state: InternalState, action: Action): InternalState {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state; // exhaustive by design
    }
}

function mapServerCartToItems(cart: CustomerCart): CartItem[] {
    return cart.itemsV2.items.map(i => ({
        uid: i.uid,
        sku: i.product.sku,
        name: i.product.name,
        price: i.prices?.price?.value ?? 0,
        quantity: i.quantity,
        thumbnail: i.product.thumbnail?.url || '',
        __typename: i.__typename
    }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { items: [], loading: false, error: null });

    useEffect(() => {
        initializeCart().catch(err => {
            console.error('Failed to initialize cart', err);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize cart' });
        });
    }, []);

    const addToCart = async (sku: string, quantity: number = 1) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });
        try {
            const serverCart = await addProductToCart(sku, quantity);
            const mapped = mapServerCartToItems(serverCart);
            dispatch({ type: 'SET_ITEMS', payload: mapped });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Failed to add to cart';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateCartItem = async (uid : string , quantity : number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            if (!uid) {
                dispatch({ type: 'SET_ERROR', payload : 'Invalid item identifier' });
                return; // early exit
            }

            if (!Number.isFinite(quantity) || quantity < 1) {
                dispatch({ type: 'SET_ERROR', payload : 'Invalid quantity' });
                return; // early exit
            }

            const serverCart = await updateCartItemQty(uid, quantity);
            const mapped = mapServerCartToItems(serverCart);

            dispatch({ type: 'SET_ITEMS', payload: mapped });
        }
        catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Failed to update cart';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    const value: CartContextValue = {
        items: state.items,
        totalQuantity: state.items.reduce((acc, i) => acc + i.quantity, 0),
        addToCart,
        updateCartItem,
        loading: state.loading,
        error: state.error,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}