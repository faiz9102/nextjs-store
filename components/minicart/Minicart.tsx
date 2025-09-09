'use client';

import {Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {ShoppingBag} from "lucide-react";
import React, {useState} from "react";
import {Badge} from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {type CartItem, useCart} from "@/context/cartContext";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";

export default function MiniCart() {
    const { items, totalQuantity, loading, error } = useCart();

    return (
        <Sheet>
            <SheetTrigger>
                <div className={`relative`}>
                    <ShoppingBag className={'min-h-5 min-w-5'}/>
                    <Badge variant={'destructive'}
                           className={'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-5 h-5 text-center'}>
                        {totalQuantity}
                    </Badge>
                </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs py-5 px-3 z-50 pe-5">
                <SheetTitle className="text-xl">Cart Summary</SheetTitle>
                <SheetDescription>
                    {items.length > 0 ? `Cart has ${items.length} item${items.length>1?'s':''}.` : "Your cart is currently empty. Start shopping to add items!"}
                </SheetDescription>
                <Separator/>
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto py-2">
                        {loading && <div className="text-sm text-gray-500 py-2">Updating...</div>}
                        {error && <div className="text-sm text-red-500 py-2" role="alert">{error}</div>}
                        {items.length > 0 ? (
                            items.map((item: CartItem) => (
                                <div key={item.uid}>
                                    <CartItemComponent cartItem={item}/>
                                    <span className="my-2 h-[1px] bg-gray-100 w-full"/>
                                </div>
                            ))
                        ) : (!loading && !error && (
                            <div className="text-center text-gray-500 py-4">
                                Your cart is empty.
                            </div>
                        ))}
                    </div>
                    <div className="border-t p-4">
                        <div className="text-sm text-gray-600 flex justify-between">
                            <span>Total Items</span>
                            <span>{totalQuantity}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function CartItemComponent({cartItem}: { cartItem: CartItem }) {
    const  { updateCartItem, loading } = useCart();
    const [quantity, setQuantity] = useState<number>(cartItem.quantity);

    // Sync local state if cartItem quantity changes externally
    React.useEffect(() => {
        setQuantity(cartItem.quantity);
    }, [cartItem.quantity]);

    const commitUpdate = async () => {
        const safeQty = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
        if (safeQty !== cartItem.quantity && !loading) {
            await updateCartItem(cartItem.uid, safeQty);
        }
    };

    return (
        <div className="">
            <div className="flex items-center justify-between py-2">
                <div className="relative w-16 h-16">
                    <Image
                        src={cartItem.thumbnail || '/next.svg'}
                        alt={cartItem.name}
                        fill
                        className="object-contain rounded"
                    />
                </div>
                <div className="flex items-center flex-col">
                    <h4 className="text-sm font-medium line-clamp-2 text-center max-w-[120px]">{cartItem.name}</h4>
                    <div className="text-center text-gray-500 w-full flex justify-between mt-2 px-3 gap-2">
                        <span className="text-xs">${cartItem.price.toFixed(2)}</span>
                        <span className="text-xs">SKU: {cartItem.sku}</span>
                    </div>
                </div>
                <Input
                    type='number'
                    min={1}
                    className="w-16 h-8 text-sm"
                    value={quantity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setQuantity(Number.isNaN(val) ? 1 : val);
                    }}
                    onBlur={commitUpdate}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            (e.target as HTMLInputElement).blur();
                        }
                    }}
                    disabled={loading}
                    aria-label={`Quantity for ${cartItem.name}`}
                />
            </div>
        </div>
    );
}