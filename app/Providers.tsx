'use client';

import React from 'react';
import {AuthProvider} from '@/context/authContext';
import {CartProvider} from '@/context/cartContext';

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
}