"use client";

import React from "react";
import { CartProvider } from "@/context/cartContext";
import { AuthProvider } from "@/context/authContext";

// CartProvider must be the outer wrapper so that AuthProvider (and its
// loginUser / logoutUser callbacks) can call useCart() to merge/reset the cart.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AuthProvider>{children}</AuthProvider>
    </CartProvider>
  );
}