import { getProductByUrlKey } from "@/services/products";
import { ProductItem } from "@/types/product";
import ProductPageProduct from "./components/ProductPageProduct";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const product: ProductItem | null = await getProductByUrlKey(slug);

    console.log("Product fetched:", product);

    if (!product) {
        return notFound();
    }

    return (
        <div className="pt-25 w-23/25 mx-auto">
            <ProductPageProduct product={product} />
        </div>
    );
}