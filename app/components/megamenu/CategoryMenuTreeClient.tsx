"use client";

import Link from "next/link";
import { CategoryItem } from "@/types/category";
import { cn } from "@/lib/utils";

/**
 * Recursive component to render a single category item and its children
 */
function CategoryMenuItem({
  category,
  level = 0,
  activePath
}: {
  category: CategoryItem;
  level?: number;
  activePath: string;
}) {
  const isActive = activePath?.includes(`/category/${category.url_key}`);
  const indentClass = level > 0 ? `pl-${level * 2}` : '';

  return (
    <div key={category.uid} className={`mb-1 ${indentClass}`}>
      <Link
        href={`/category/${category.url_key}`}
        className={cn(
          "text-sm font-medium hover:text-primary transition-colors",
          isActive ? "text-primary font-semibold" : "text-gray-700"
        )}
      >
        {category.name}
      </Link>
      {category.children && category.children.length > 0 && (
        <div className="pl-4 mt-1 border-l border-gray-200">
          {category.children.map((child: CategoryItem) => (
            <CategoryMenuItem
              key={child.uid}
              category={child}
              level={level + 1}
              activePath={activePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Client component wrapper for category tree navigation
 * This isolates the client-side behavior to just the interactive category tree
 */
export function CategoryMenuTreeClient({
  categories,
  activePath
}: {
  categories: CategoryItem[];
  activePath: string;
}) {
  return (
    <>
      {categories.map((category) => (
        <CategoryMenuItem
          key={category.uid}
          category={category}
          activePath={activePath}
        />
      ))}
    </>
  );
}
