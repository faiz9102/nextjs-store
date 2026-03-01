import { getProductByUrlKey } from "@/services/products";
import { notFound } from "next/navigation";
import ProductPage from "./ProductPage";

export const revalidate = 60; // Revalidate SSG every 60s

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const product = await getProductByUrlKey(slug);

    if (!product) return notFound();

    return (
        <main className="pt-25 max-w-[90vw] mx-auto px-4">
            <ProductPage product={product} />
        </main>
    );
}
