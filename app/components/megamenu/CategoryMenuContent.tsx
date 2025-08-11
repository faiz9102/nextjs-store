import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "@/types/category";
import { CategoryMenuTreeClient } from "./CategoryMenuTreeClient";

/**
 * Server component to render the megamenu content
 * This component is designed to be a true server component with minimal client-side dependencies
 */
export function CategoryMenuContent({
  category,
  activePath
}: {
  category: CategoryItem;
  activePath: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-5 overflow-y-auto max-h-[400px] pr-4 border-r">
        <h3 className="font-medium mb-2 text-gray-900">{category.name} Categories</h3>
        {category.children && category.children.length > 0 ? (
          <div className="space-y-1">
            {/* Only the tree navigation needs to be a client component for path highlighting */}
            <CategoryMenuTreeClient
              categories={category.children}
              activePath={activePath}
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No subcategories available</p>
        )}
      </div>
      <div className="col-span-7">
        <div className="h-full flex flex-col">
          {/* Category Banner */}
          <div className="mb-4 relative h-[200px] overflow-hidden rounded-lg">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500">{category.name}</span>
              </div>
            )}
          </div>

          {/* Category Description */}
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">{category.name}</h3>
            {category.description ? (
              <div
                className="text-sm text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            ) : (
              <p className="text-sm text-gray-500">
                Explore our selection of {category.name.toLowerCase()} products.
              </p>
            )}
            <Link
              href={`/category/${category.url_key}`}
              className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
            >
              View All {category.name} Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
