"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";
import { type ProductItem } from "@/types/product";
import { useCart } from "@/context/cartContext";

export default function ProductCard({ product }: { product: ProductItem }) {
    const price = product.price_range.minimum_price.final_price;
    const regularPrice = product.price_range.minimum_price.regular_price;
    const isDiscounted = price.value < regularPrice.value;

    // Display-only colour swatches on the card
    const swatches =
        product.configurable_options?.find(
            (opt) => opt.attribute_code === "color"
        )?.values ?? [];

    const { addToCart } = useCart();
    const router = useRouter();
    const [addingToCart, setAddingToCart] = useState(false);

    /**
     * Quick-add handler:
     * - SimpleProduct → directly add to cart via context
     * - ConfigurableProduct → navigate to product page (variant selection required)
     */
    async function handleQuickAdd(e: React.MouseEvent) {
        e.preventDefault(); // prevent the parent <Link> from navigating
        e.stopPropagation();

        if (product.__typename !== "SimpleProduct") {
            // Configurable products need a variant picked — send user to product page
            router.push(`/product/${product.url_key}`);
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart({ sku: product.sku, qty: 1 });
        } finally {
            setAddingToCart(false);
        }
    }

    return (
        <div className="group flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto transition-all duration-300 hover:translate-y-[-5px]">
            {/* Product Image with overlay */}
            <Link
                href={`/product/${product.url_key}`}
                className="block relative aspect-3/4 rounded-xl overflow-hidden bg-gray-100"
            >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-0" />

                {product.small_image?.url ? (
                    <Image
                        src={product.small_image.url}
                        alt={product.small_image.label || product.name}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Sale badge */}
                {isDiscounted && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs md:text-sm font-medium px-2 py-1 rounded-md z-10">
                        SALE
                    </div>
                )}

                {/* Quick-add button — appears on hover */}
                <button
                    onClick={handleQuickAdd}
                    disabled={addingToCart}
                    title={
                        product.__typename === "SimpleProduct"
                            ? "Add to cart"
                            : "Select options"
                    }
                    className="
                        absolute bottom-3 right-3 z-10
                        bg-white/90 backdrop-blur-sm
                        rounded-full p-2 shadow-md
                        opacity-0 group-hover:opacity-100
                        translate-y-2 group-hover:translate-y-0
                        transition-all duration-200
                        hover:bg-white disabled:opacity-50
                    "
                >
                    {addingToCart ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-700" />
                    ) : (
                        <ShoppingBag className="w-4 h-4 text-gray-700" />
                    )}
                </button>
            </Link>

            {/* Product info */}
            <div className="mt-4 px-1 md:mt-5 md:px-2">
                <Link
                    href={`/product/${product.url_key}`}
                    className="block group-hover:text-primary transition-colors"
                >
                    <h3 className="text-sm md:text-base font-medium text-gray-800 leading-tight min-h-[2.5em]">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mt-2 md:mt-3 flex items-center gap-2">
                    <span className="text-sm md:text-base font-medium">
                        {price.currency} {price.value.toFixed(2)}
                    </span>
                    {isDiscounted && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                            {regularPrice.value.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Display-only colour swatches — uid is available from the listing query */}
                {swatches.length > 0 && (
                    <div className="mt-3 md:mt-4 flex gap-1.5 md:gap-2">
                        {swatches.slice(0, 4).map((swatch) => {
                            const isImage =
                                swatch.swatch_data &&
                                "thumbnail" in swatch.swatch_data &&
                                (swatch.swatch_data as { thumbnail: string }).thumbnail;

                            return (
                                <div
                                    key={swatch.uid}
                                    title={swatch.label}
                                    className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-300 overflow-hidden flex-shrink-0"
                                    style={{
                                        backgroundColor: !isImage
                                            ? swatch.swatch_data?.value ?? "transparent"
                                            : undefined,
                                    }}
                                >
                                    {isImage && (
                                        <Image
                                            src={(swatch.swatch_data as { thumbnail: string }).thumbnail}
                                            alt={swatch.label}
                                            width={24}
                                            height={24}
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                </div>
                            );
                        })}

                        {swatches.length > 4 && (
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] md:text-xs text-gray-500">
                                +{swatches.length - 4}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
