"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import React, { useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CategoryItem } from "@/types/category";
import { CategoryMenuContent } from "./megamenu/CategoryMenuContent";
import { useNavigation } from "./navigation/navigation-utils";
import { getActiveCategory } from "@/lib/utils/category";

/**
 * Client-side wrapper for the megamenu
 * This component handles all interactive elements (triggers, state, effects)
 * Uses shared navigation logic with the mobile menu
 */
export default function MegaMenu({
                                            categories
                                        }: {
    categories: CategoryItem[];
}) {
    const {
        pathname,
        isMenuOpen,
        setIsMenuOpen,
        activeCategory
    } = useNavigation(categories);

    // Resolve the current active category (by url_key) once
    const currentCategory = activeCategory
        ? getActiveCategory(categories, activeCategory)
        : null;
    const activePath = currentCategory?.path;

    // Precompute numeric IDs from active path for O(1) membership checks
    const activeIdSet = useMemo(() => {
        if (!activePath) return null;
        const ids = activePath.split('/').filter(Boolean).map(Number).filter(n => !Number.isNaN(n));
        return new Set(ids);
    }, [activePath]);

    // Handle backdrop effect with a memoized function to improve performance
    const applyBackdropEffect = useCallback((isOpen: boolean) => {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

        if (isOpen) {
            const style = document.createElement('style');
            style.id = 'megamenu-backdrop-style';
            style.textContent = `
                main::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0,0,0,0.2);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 5;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        } else {
            mainElement.classList.remove('backdrop-blur-md', 'brightness-50', 'transition-all', 'duration-300');
            const existingStyle = document.getElementById('megamenu-backdrop-style');
            if (existingStyle) {
                existingStyle.remove();
            }
        }
    }, []);

    // Effect to manage body scroll and backdrop when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('overflow-hidden');
            applyBackdropEffect(true);
        } else {
            document.body.classList.remove('overflow-hidden');
            applyBackdropEffect(false);
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
            applyBackdropEffect(false);
        };
    }, [isMenuOpen, applyBackdropEffect]);

    return (
        <NavigationMenu onValueChange={(value) => setIsMenuOpen(!!value)}>
            <NavigationMenuList>
                {categories.map((category) => {
                    const isActiveTop = activeIdSet
                        ? activeIdSet.has(category.id)
                        : (pathname ? pathname.includes(`/category/${category.url_key}`) : false);
                    return (
                        <NavigationMenuItem key={category.uid}>
                            <NavigationMenuTrigger
                                className={cn(
                                    "text-sm font-medium bg-transparent",
                                    isActiveTop ? "text-primary bg-secondary" : "text-gray-700"
                                )}
                            >
                                {category.name}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="w-[800px] lg:w-[950px] bg-white rounded-xl shadow-xl border border-gray-100 z-30">
                                <CategoryMenuContent
                                    category={category}
                                    activePath={pathname}
                                />
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
