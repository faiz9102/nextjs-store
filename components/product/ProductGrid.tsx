import ProductCard from "@/components/product/ProductCard";
import { type ProductItem } from "@/types/product";
import { getFilteredProducts } from "@/services/products";
import { type ProductFilter } from "@/types/product";

type ProductGridProps = {
    filter: ProductFilter,
}

export default async function ProductGrid({ filter }: ProductGridProps) {
    const products: ProductItem[] = await getFilteredProducts(filter);

    return products.length > 0 ? (
        <div
            className="
                grid
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-3
                xl:grid-cols-4
                gap-x-4
                sm:gap-x-6
                md:gap-x-8
                gap-y-10
                sm:gap-y-12
                md:gap-y-16
            "
        >
            {products.map((product) => (
                <ProductCard key={product.uid} product={product} />
            ))}
        </div>
    ) : (
        <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm">Try adjusting your filters or check back later for new arrivals.</p>
        </div>
    );
}
