import { getAllCategories } from '@/services/categories';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import SkeletonProductGrid from '@/components/product/SkeletonProductGrid';
import ProductGrid from '@/components/product/ProductGrid';
import { type CategoryItem } from '@/types/Category';

interface CategoryParams {
    slug: string;
}

export async function generateStaticParams() {
    const categories: CategoryItem[] = await getAllCategories();
    return (categories ?? []).map((cat) => ({
        slug: cat.url_key,
    }));
}

const CategoryPage = async ({ params }: { params: Promise<CategoryParams> }) => {
    "use cache";

    const { slug } = await params;
    const categories = await getAllCategories();
    const category = categories.find((cat) => cat.url_key === slug) || null;

    if (!category) return notFound();

    return (
        <>
            <aside>aside content</aside>
            <div className="mt-25 mx-auto w-2/3 px-4">
                <h1 className="text-7xl mb-10">{category.name}</h1>
                <Suspense fallback={<SkeletonProductGrid />}>
                        <ProductGrid category_uid={category.uid} />
                </Suspense>
            </div>
        </>
    );
};

export default CategoryPage;
