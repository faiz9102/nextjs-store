'use client'

import Image from "next/image";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {usePathname} from "next/navigation";
import React from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {CategoryItem} from "@/types/category";

export default function ClientSideMegaMenu({categories}: { categories: CategoryItem[] }) {
    const pathname = usePathname();
    const [activeCategory, setActiveCategory] = React.useState<CategoryItem | null>(null);

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {categories.map((category) => (
                    <NavigationMenuItem key={category.uid} className={'bg-transparent'}>
                        <NavigationMenuTrigger
                            className={cn(
                                "text-sm font-medium bg-transparent",
                                pathname?.includes(`/category/${category.url_key}`)
                                    ? "text-primary bg-secondary"
                                    : "text-gray-700"
                            )}
                            onMouseEnter={() => setActiveCategory(category)}
                        >
                            {category.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-[800px] lg:w-[950px]">
                            <div className="grid grid-cols-12 gap-4 p-4">
                                <div className="col-span-5 overflow-y-auto max-h-[400px] pr-4 border-r">
                                    <h3 className="font-medium mb-2 text-gray-900">{category.name} Categories</h3>
                                    {category.children && category.children.length > 0 ? (
                                        <div className="space-y-1">
                                            {category.children.map((child: CategoryItem) => (
                                                <CategoryMenuItem
                                                    key={child.uid}
                                                    category={child}
                                                    activePath={pathname}
                                                />
                                            ))}
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
                                                <div
                                                    className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
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
                                                    dangerouslySetInnerHTML={{__html: category.description}}
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
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

function CategoryMenuItem(
    {category, level = 0, activePath}:
    {
        category: CategoryItem, level?: number, activePath?: string
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
};