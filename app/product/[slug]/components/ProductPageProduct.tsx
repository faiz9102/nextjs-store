"use client";

import Image from "next/image";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {cn} from "@/lib/utils";
import {ZoomIn} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {ProductItem} from "@/types/product";


export default function ProductPageProduct({product}: { product: ProductItem }) {
    const regularPrice = product.price_range.minimum_price.regular_price;
    const finalPrice = product.price_range.minimum_price.final_price;
    const isDiscounted = finalPrice.value < regularPrice.value;

    const images = [
        product.image,
        product.thumbnail,
        product.small_image,
    ].filter(Boolean) as { url: string; label?: string }[];

    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
                <div
                    className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted group cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                >
                    <Image
                        src={images[selectedImage].url}
                        alt={images[selectedImage].label || product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-background/70 p-1 rounded-full">
                        <ZoomIn className="w-5 h-5 text-muted-foreground"/>
                    </div>
                </div>

                {/* Thumbnail carousel */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "relative w-20 h-20 rounded-lg overflow-hidden border cursor-pointer",
                                selectedImage === idx && "ring-2 ring-primary"
                            )}
                            onClick={() => setSelectedImage(idx)}
                        >
                            <Image
                                src={img.url}
                                alt={img.label || product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Lightbox */}
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={images.map((img) => ({src: img.url}))}
                />
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-6">
                {/* Title & Categories */}
                <div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <div className="flex gap-2 mt-2">
                        {product.categories.map(({name, uid}: { uid: string; name: string }) => (
                            <Badge key={uid} variant="secondary">
                                {name}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">
            {finalPrice.value.toFixed(2)} {finalPrice.currency}
          </span>
                    {isDiscounted && (
                        <>
              <span className="text-muted-foreground line-through">
                {regularPrice.value.toFixed(2)} {regularPrice.currency}
              </span>
                            <Badge variant="destructive">Sale</Badge>
                        </>
                    )}
                </div>

                <Separator/>

                {/* Configurable Options */}
                {product.configurable_options?.length ? (
                    <div className="flex flex-col gap-4">
                        {product.configurable_options.map((option: { attribute_code: Key | null | undefined; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement | Iterable<ReactNode> | null | undefined> | null | undefined; values: { label: string; swatch_data?: { value?: string; thumbnail?: string; }; }[]; }) => (
                            <div key={option.attribute_code}>
                                <p className="font-medium mb-2">{option.label}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {option.values.map((val, idx) => {
                                        const swatch = val.swatch_data;
                                        const isColor = swatch?.value?.startsWith("#");

                                        return swatch?.thumbnail || isColor ? (
                                            <TooltipProvider key={idx}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className={cn(
                                                                "w-8 h-8 rounded-full border",
                                                                "hover:ring-2 hover:ring-primary"
                                                            )}
                                                            style={{
                                                                backgroundImage: swatch.thumbnail
                                                                    ? `url(${swatch.thumbnail})`
                                                                    : undefined,
                                                                backgroundColor: isColor ? swatch.value : undefined,
                                                                backgroundSize: "cover",
                                                            }}
                                                            title={val.label}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>{val.label}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary hover:text-white"
                                            >
                                                {val.label}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                <Separator />

                {/* Add to Cart */}
                <Button size="lg" className="w-full md:w-auto">
                    Add to Cart
                </Button>

                {/* Product Info */}
                <Accordion type="single" collapsible className="mt-6">
                    <AccordionItem value="details">
                        <AccordionTrigger>Product Details</AccordionTrigger>
                        <AccordionContent>
                            This is a premium product made with quality materials. Add actual
                            Magento product description here.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="shipping">
                        <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                        <AccordionContent>
                            Shipping usually takes 3-5 business days. Free returns within 30
                            days.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
