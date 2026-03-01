"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, Loader2, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cartContext";

export default function MiniCart() {
    const { items, total, itemCount, loading, removeFromCart, updateQty } = useCart();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative focus-visible:outline-none" aria-label="Open cart">
                    <ShoppingBag className="min-h-5 min-w-5" />
                    {itemCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-5 h-5 flex items-center justify-center text-[10px] p-0"
                        >
                            {itemCount > 99 ? "99+" : itemCount}
                        </Badge>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Cart
                        {itemCount > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({itemCount} {itemCount === 1 ? "item" : "items"})
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-2" />

                {/* Global loading overlay */}
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && items.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                        <p className="text-base font-medium text-muted-foreground">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground/60">Add some products to get started!</p>
                    </div>
                )}

                {/* Cart line items */}
                {items.length > 0 && (
                    <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4 py-2">
                        {items.map((item) => (
                            <div key={item.uid} className="flex gap-3 items-start">
                                {/* Thumbnail */}
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                                    {item.product.thumbnail?.url ? (
                                        <Image
                                            src={item.product.thumbnail.url}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Name + qty controls + price */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-snug truncate">
                                        {item.product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {item.product.sku}
                                    </p>

                                    <div className="flex items-center justify-between mt-2">
                                        {/* Quantity stepper */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => updateQty(item.uid, item.quantity - 1)}
                                                disabled={loading || item.quantity <= 1}
                                                className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQty(item.uid, item.quantity + 1)}
                                                disabled={loading}
                                                className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Line total */}
                                        <span className="text-sm font-semibold">
                                            {item.prices.row_total.currency}{" "}
                                            {item.prices.row_total.value.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Remove button */}
                                <button
                                    onClick={() => removeFromCart(item.uid)}
                                    disabled={loading}
                                    className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 mt-0.5"
                                    aria-label={`Remove ${item.product.name} from cart`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer: total + checkout CTA */}
                {items.length > 0 && (
                    <div className="border-t pt-4 space-y-4 mt-auto">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">Total</span>
                            <span className="text-base font-bold">
                                {total ? `${total.currency} ${total.value.toFixed(2)}` : "—"}
                            </span>
                        </div>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/checkout">Go to Checkout</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}