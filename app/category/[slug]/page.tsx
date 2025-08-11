import {getAllCategories} from '@/services/categories';
import React, {Suspense} from 'react';
import {notFound} from 'next/navigation';
import SkeletonProductGrid from '@/components/product/SkeletonProductGrid';
import ProductGrid from '@/components/product/ProductGrid';
import {type CategoryItem} from '@/types/category';
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
        <div className="pt-24 sm:pt-28 md:pt-32">
            {/* Category header */}
            <div className="bg-gradient-to-r from-gray-50 to-white py-8 sm:py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                        {category.name}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        Browse our collection of premium {category.name.toLowerCase()} products
                    </p>
                </div>
            </div>

            {/* Product grid section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar/filters */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="font-medium text-lg mb-4">Filters</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Price Range</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input type="checkbox" id="price-1" className="mr-2" />
                                            <label htmlFor="price-1" className="text-sm">Under $50</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="price-2" className="mr-2" />
                                            <label htmlFor="price-2" className="text-sm">$50 - $100</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="price-3" className="mr-2" />
                                            <label htmlFor="price-3" className="text-sm">$100 - $200</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="price-4" className="mr-2" />
                                            <label htmlFor="price-4" className="text-sm">Over $200</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product grid */}
                    <div className="flex-1 min-w-0">
                        <Suspense fallback={<SkeletonProductGrid/>}>
                            <ProductGrid filter={categoryFilter} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
