import { getAllCategories } from '@/services/categories';
import React from 'react';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/product/SkeletonProductGrid';

interface CategoryProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat: { url_key: string }) => ({ slug: cat.url_key }));
}

const CategoryPage = async ({ params }: CategoryProps) => {
  const categories = await getAllCategories();
  const category = categories.find((cat: { url_key: string }) => cat.url_key === params.slug) || null;
  if (!category) return notFound();
  return (
    <div className={`mt-50 mx-auto w-2/3 px-4`}>
      <h1>{category.name}</h1>
      <p>Category ID: {category.id}</p>
      <p>Slug: {category.url_key}</p>
        <ProductGrid />
    </div>
  );
};

export default CategoryPage;

