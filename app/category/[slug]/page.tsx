import { getAllCategories } from '@/services/categories';
import React from 'react';
import { notFound } from 'next/navigation';

interface CategoryProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat: { slug: string }) => ({ slug: cat.slug }));
}

const CategoryPage = async ({ params }: CategoryProps) => {
  const categories = await getAllCategories();
  const category = categories.find((cat: { slug: string }) => cat.slug === params.slug) || null;
  if (!category) return notFound();
  return (
    <div>
      <h1>{category.name}</h1>
      <p>Category ID: {category.id}</p>
      <p>Slug: {category.slug}</p>
    </div>
  );
};

export default CategoryPage;

