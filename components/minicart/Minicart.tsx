'use client';

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {ShoppingBag} from "lucide-react";
import {Badge} from "@/components/ui/badge";

export default function MiniCart() {
    return (
        <Sheet>
            <SheetTrigger>
                <div className={`relative`}>
                    <ShoppingBag className={'min-h-5 min-w-5'}/>
                    <Badge variant={'destructive'} className={'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-5 h-5 text-center'}>
                        0
                    </Badge>
                </div>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Cart Summary</SheetTitle>
                    <SheetDescription>
                        Your cart is currently empty. Start shopping to add items!
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
);
}