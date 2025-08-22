'use client';

import {Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {ShoppingBag} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {type CartItem, useCart} from "@/context/cartContext";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";
import {useEffect, useState} from 'react';

export default function MiniCart() {
    const cart = useCart();

    const [cartItemsQty, setCartItemsQty] = useState<number>(0);
    useEffect(() => {
        const itemsQty = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartItemsQty(itemsQty);
    }, [cart.items]);

    return (
        <Sheet>
            <SheetTrigger>
                <div className={`relative`}>
                    <ShoppingBag className={'min-h-5 min-w-5'}/>
                    <Badge variant={'destructive'}
                           className={'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-5 h-5 text-center'}>
                        {cartItemsQty}
                    </Badge>
                </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs py-5 px-3 z-50 pe-5">
                <SheetTitle className="text-xl">Cart Summary</SheetTitle>
                <SheetDescription>
                    {cart.items.length > 0 ? `Cart has ${cart.items.length} items.` : "Your cart is currently empty. Start shopping to add items!"}
                </SheetDescription>
                <Separator/>
                <div className="flex flex-col h-full">
                    {/* Header */}

                    {/* Cart Main Content */}
                    <div className="flex-1 overflow-y-auto py-2">
                        {cart.items.length > 0 ? (
                            cart.items.map((item: CartItem) => (
                                <>
                                    <CartItem cartItem={item} key={item.sku}/>
                                    <div className="my-2 h-[1px] bg-gray-100 w-full"/>
                                </>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-4">
                                Your cart is empty.
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4">
                        footer
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function CartItem({cartItem}: { cartItem: CartItem }) {
    return (
        <div className="">
            <div className="flex items-center justify-between py-2">
                <div className="relative w-16 h-16">
                    <Image
                        src={cartItem.thumbnail}
                        alt={cartItem.name}
                        fill
                        className="object-contain rounded"
                    />
                </div>
                <div className="flex items-center flex-col">
                    <h4 className="text-sm font-medium">{cartItem.name}</h4>
                    <div className="text-center text-gray-500 w-full flex justify-between mt-2 px-3">
                        <span className="text-xs">${cartItem.price.toFixed(2)}</span>
                        <span className="text-xs">SKU: {cartItem.sku}</span>
                    </div>
                </div>
                <span className="text-sm font-semibold">x{cartItem.quantity}</span>
            </div>
        </div>
    );
}