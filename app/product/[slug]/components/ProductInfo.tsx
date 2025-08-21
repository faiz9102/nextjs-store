"use client";

import { ProductPageProduct } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProductInfo({ product }: { product: ProductPageProduct }) {
    const regular = product.price_range.minimum_price.regular_price;
    const final = product.price_range.minimum_price.final_price;
    const isDiscounted = final.value < regular.value;

    return (
        <div className="flex flex-col gap-6">
            {/* Title & Categories */}
            <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {product.categories.map(({ uid, name }) => (
                        <Badge key={uid} variant="secondary">{name}</Badge>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{final.value.toFixed(2)} {final.currency}</span>
                {isDiscounted && (
                    <>
                        <span className="text-muted-foreground line-through">{regular.value.toFixed(2)} {regular.currency}</span>
                        <Badge variant="destructive">Sale</Badge>
                    </>
                )}
            </div>

            <Separator />

            {/* Configurable Options would go here if needed */}

            {/* Add to Cart */}
            <Button size="lg" className="w-full md:w-auto">Add to Cart</Button>

            {/* Product Info */}
            <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="details">
                    <AccordionTrigger>Product Details</AccordionTrigger>
                    <AccordionContent>{product.meta_description || "No description available."}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                    <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                    <AccordionContent>Shipping usually takes 3-5 business days. Free returns within 30 days.</AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
