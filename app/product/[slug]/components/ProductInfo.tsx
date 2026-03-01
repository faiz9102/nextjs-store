"use client";

import Image from "next/image";
import {
    ProductPageProduct,
    ImageSwatchData,
    SwatchData,
} from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cartContext";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ProductInfoProps {
    product: ProductPageProduct;
    selectedOptions: Record<string, string>;       // attribute_code → uid
    handleSelect: (code: string, uid: string) => void;
    availableUids: (code: string) => Set<string>;
    isComplete: boolean;
    selectedSku: string;
    /** Whether the current selection is in stock — OOS variants disable the add-to-cart button */
    isInStock: boolean;
}

// ---------------------------------------------------------------------------
// SwatchButton — renders the correct swatch type
// ---------------------------------------------------------------------------
interface SwatchButtonProps {
    label: string;
    /** Swatch data from the option value — can be image, color, text or undefined */
    swatchData: SwatchData | ImageSwatchData | undefined;
    isSelected: boolean;
    isDisabled: boolean;
    onClick: () => void;
}

function SwatchButton({ label, swatchData, isSelected, isDisabled, onClick }: SwatchButtonProps) {
    const base = cn(
        "relative flex items-center justify-center rounded transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isDisabled
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer hover:ring-2 hover:ring-muted-foreground hover:ring-offset-1"
    );

    // ── Image swatch ──────────────────────────────────────────────────────────
    if (swatchData && "thumbnail" in swatchData && (swatchData as ImageSwatchData).thumbnail) {
        const thumb = (swatchData as ImageSwatchData).thumbnail;
        return (
            <button
                title={label}
                disabled={isDisabled}
                onClick={onClick}
                className={cn(base, "w-10 h-10 overflow-hidden border border-border")}
            >
                <Image src={thumb} alt={label} fill className="object-cover" />
                {/* Strike-through overlay for disabled */}
                {isDisabled && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-muted-foreground/60 rotate-45 absolute" />
                    </span>
                )}
            </button>
        );
    }

    // ── Color swatch — value is a CSS color string (hex / rgb / named) ────────
    // Heuristic: if value starts with # or rgb, treat as color
    const value = swatchData?.value ?? "";
    const isColorValue = value.startsWith("#") || value.startsWith("rgb");

    if (isColorValue) {
        return (
            <button
                title={label}
                disabled={isDisabled}
                onClick={onClick}
                className={cn(base, "w-8 h-8 rounded-full border border-border")}
                style={{ backgroundColor: value }}
            >
                {isDisabled && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                        <span className="w-full h-px bg-white/70 rotate-45 absolute" />
                    </span>
                )}
            </button>
        );
    }

    // ── Text swatch — transparent button with border and label text ───────────
    return (
        <button
            title={label}
            disabled={isDisabled}
            onClick={onClick}
            className={cn(
                base,
                "px-3 py-1.5 text-sm font-medium border border-border rounded-md",
                "bg-transparent text-foreground",
                isDisabled && "line-through text-muted-foreground"
            )}
        >
            {label}
        </button>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ProductInfo({
    product,
    selectedOptions,
    handleSelect,
    availableUids,
    isComplete,
    selectedSku,
    isInStock,
}: ProductInfoProps) {
    const { addToCart, loading } = useCart();
    const isConfigurable = product.__typename === "ConfigurableProduct";

    // Use matched-variant price when available, fall back to base product price
    const priceRange = product.price_range.minimum_price;
    const regular = priceRange.regular_price;
    const final = priceRange.final_price;
    const isDiscounted = final.value < regular.value;

    async function handleAddToCart() {
        if (isConfigurable) {
            // Configurable product: requires both the variant SKU (child) and the parent SKU
            await addToCart({ sku: selectedSku, qty: 1, parentSku: product.sku });
        } else {
            // Simple product: just sku + qty
            await addToCart({ sku: selectedSku, qty: 1 });
        }
    }

    // Button is ready only when:
    // - Not loading
    // - All options selected (or it's a simple product)
    // - The resolved variant/product is in stock
    const canAdd = !loading && (!isConfigurable || isComplete) && isInStock;

    const buttonLabel = loading
        ? "Adding…"
        : !isConfigurable || isComplete
            ? isInStock
                ? "Add to Cart"
                : "Out of Stock"
            : "Select options";

    return (
        <div className="flex flex-col gap-6">
            {/* ── Title & Categories ── */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {product.categories.map(({ uid, name }) => (
                        <Badge key={uid} variant="secondary">{name}</Badge>
                    ))}
                </div>
            </div>

            {/* ── Price ── */}
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                    {final.currency} {final.value.toFixed(2)}
                </span>
                {isDiscounted && (
                    <>
                        <span className="text-muted-foreground line-through text-base">
                            {regular.currency} {regular.value.toFixed(2)}
                        </span>
                        <Badge variant="destructive">Sale</Badge>
                    </>
                )}
            </div>

            <Separator />

            {/* ── Configurable Options ── */}
            {isConfigurable && product.configurable_options?.map((option) => {
                const available = availableUids(option.attribute_code);
                return (
                    <div key={option.attribute_code} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold uppercase tracking-wide">
                                {option.label}
                            </span>
                            {/* Show the currently selected label for this option */}
                            {selectedOptions[option.attribute_code] && (
                                <span className="text-sm text-muted-foreground">
                                    —{" "}
                                    {option.values.find(
                                        (v) => v.uid === selectedOptions[option.attribute_code]
                                    )?.label}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {option.values.map((value) => {
                                const isSelected = selectedOptions[option.attribute_code] === value.uid;
                                // An option is disabled if no IN_STOCK variant can be reached with it
                                const isDisabled = !available.has(value.uid);

                                return (
                                    <SwatchButton
                                        key={value.uid}
                                        label={value.label}
                                        swatchData={value.swatch_data}
                                        isSelected={isSelected}
                                        isDisabled={isDisabled}
                                        onClick={() => handleSelect(option.attribute_code, value.uid)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* ── Add to Cart ── */}
            <Button
                size="lg"
                className="w-full md:w-auto gap-2"
                disabled={!canAdd}
                onClick={handleAddToCart}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <ShoppingBag className="w-4 h-4" />
                )}
                {buttonLabel}
            </Button>

            {/* ── Accordion: Product Details & Shipping ── */}
            <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="details">
                    <AccordionTrigger>Product Details</AccordionTrigger>
                    <AccordionContent>
                        {product.meta_description || "No description available."}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                    <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                    <AccordionContent>
                        Shipping usually takes 3–5 business days. Free returns within 30 days.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
