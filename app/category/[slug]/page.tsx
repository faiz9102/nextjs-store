import {getAllCategories} from '@/services/categories';
import React, {Suspense} from 'react';
import {notFound} from 'next/navigation';
import SkeletonProductGrid from '@/components/product/SkeletonProductGrid';
import ProductGrid from '@/components/product/ProductGrid';
import {type CategoryItem} from '@/types/Category';
import {type ProductFilter} from '@/types/product';

interface CategoryParams {
    slug: string;
}

export async function generateStaticParams() {
    const categories: CategoryItem[] = await getAllCategories();
    return (categories ?? []).map((cat) => ({
        slug: cat.url_key,
    }));
}

const CategoryPage = async ({params}: { params: Promise<CategoryParams> }) => {

    const {slug} = await params;
    const categories = await getAllCategories();
    const category = categories.find((cat) => cat.url_key === slug) || null;

    if (!category) return notFound();

    const categoryFilter: ProductFilter = {
        "category_uid": {"eq": category.uid}
    }

    return (
        <div className="mx-auto px-4 pt-25 w-17/20">
            <h1 className="text-7xl mb-10">{category.name}</h1>
            <div className={`flex flex-row gap-4`}>
                <aside className={`flex-1/5 max-w-1/5`}></aside>
                <Suspense fallback={<SkeletonProductGrid/>}>
                    <ProductGrid
                        filter={categoryFilter}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default CategoryPage;
