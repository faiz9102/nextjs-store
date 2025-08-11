import Image from "next/image";
import Link from "next/link";
import { type ProductItem } from "@/types/product";

export default function ProductCard({ product }: { product: ProductItem }) {
    const price = product.price_range.minimum_price.final_price;
    const regularPrice = product.price_range.minimum_price.regular_price;
    const isDiscounted = price.value < regularPrice.value;
    const swatches =
        product.configurable_options?.find(
            (opt) => opt.attribute_code === "color"
        )?.values ?? [];

    return (
        <div className="group flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto transition-all duration-300 hover:translate-y-[-5px]">
            {/* Product Image with overlay */}
            <Link
                href={`/product/${product.url_key}`}
                className="block relative aspect-3/4 rounded-xl overflow-hidden bg-gray-100"
            >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10"></div>
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
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs md:text-sm font-medium px-2 py-1 rounded-md z-20">
                        SALE
                    </div>
                )}
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

                {/* Swatches */}
                {swatches.length > 0 && (
                    <div className="mt-3 md:mt-4 flex gap-1.5 md:gap-2">
                        {swatches.slice(0, 4).map((swatch, idx) => (
                            <div
                                key={idx}
                                title={swatch.label}
                                className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-300 overflow-hidden"
                                style={{
                                    backgroundColor: swatch.swatch_data?.value || "transparent",
                                }}
                            >
                                {swatch.swatch_data?.thumbnail && (
                                    <Image
                                        src={swatch.swatch_data.thumbnail}
                                        alt={swatch.label}
                                        width={24}
                                        height={24}
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        ))}

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
