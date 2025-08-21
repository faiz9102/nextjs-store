import { ProductPageProduct } from "@/types/product";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";

export default function ProductPage({ product }: { product: ProductPageProduct }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
        </div>
    );
}
