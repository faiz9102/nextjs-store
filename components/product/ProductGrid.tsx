import ProductCard from "@/components/product/ProductCard";
import { type ProductItem } from "@/types/product";
import { getFilteredProducts } from "@/services/products";
import { type ProductFilter } from "@/types/product";

type ProductGridProps = {
    filter: ProductFilter;
}

export default async function ProductGrid({ filter }: ProductGridProps) {
    const products: ProductItem[] = await getFilteredProducts(filter);

    return products.length > 0 ? (
        <div
            className="
                grid
                grid-cols-2 gap-y-10
                sm:grid-cols-3
                md:grid-cols-4
                xl:grid-cols-5
                justify-items-center
            "
        >
            {products.map((product) => (
                <ProductCard key={product.uid} product={product} />
            ))}
        </div>
    ) : (
        <div className="text-center text-gray-500 min-h-full flex items-center justify-center">
            No products found in this category.
        </div>
    );
}
