"use client";

import { ProductPageProduct } from "@/types/product";
import { useProductSelection } from "@/hooks/useProductSelection";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";

/**
 * ProductPage owns the variant selection state via useProductSelection.
 * It passes gallery images down to ProductGallery so the gallery stays in sync
 * with the selected variant, and passes selection props down to ProductInfo
 * for the swatch UI and add-to-cart logic.
 */
export default function ProductPage({ product }: { product: ProductPageProduct }) {
    const selection = useProductSelection(product);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Gallery receives reactive images — swaps to variant images on selection */}
            <ProductGallery
                images={selection.selectedImages}
                productName={product.name}
            />

            {/* Info receives all selection state + product data */}
            <ProductInfo
                product={product}
                selectedOptions={selection.selectedOptions}
                handleSelect={selection.handleSelect}
                availableUids={selection.availableUids}
                isComplete={selection.isComplete}
                selectedSku={selection.selectedSku}
                isInStock={selection.isInStock}
            />
        </div>
    );
}
