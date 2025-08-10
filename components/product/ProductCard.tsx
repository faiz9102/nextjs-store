import Image from "next/image";



export default function ProductCard({ product }: { product: ProductItem }) {
    const price = product.price_range.minimum_price.final_price;
    const swatches =
        product.configurable_options?.find(
            (opt) => opt.attribute_code === "color"
        )?.values ?? [];

    return (
        <div className="flex flex-col items-start w-[240px] hover:shadow-lg transition-shadow duration-200 ease-in-out p-4">
            {/* Product Image */}
            <a
                href={`/product/${product.url_key}`}
                className="block w-full h-[300px] rounded-lg overflow-hidden "
            >
                {product.small_image?.url ? (
                    <Image
                        src={product.small_image.url}
                        alt={product.small_image.label || product.name}
                        width={240}
                        height={300}
                        className="object-contain w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200" />
                )}
            </a>

            {/* Name */}
            <h3 className="mt-2 text-sm font-medium text-gray-800 truncate w-full">
                {product.name}
            </h3>

            {/* Price */}
            <p className="mt-1 text-gray-600 text-sm">
                {price.currency} {price.value.toFixed(2)}
            </p>

            {/* Swatches */}
            {swatches.length > 0 && (
                <div className="mt-3 flex space-x-2">
                    {swatches.map((swatch, idx) => (
                        <div
                            key={idx}
                            title={swatch.label}
                            className="w-6 h-6 rounded-full border border-gray-300 overflow-hidden"
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
                </div>
            )}
        </div>
    );
}
