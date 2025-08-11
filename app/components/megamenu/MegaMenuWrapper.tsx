"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CategoryItem } from "@/types/category";
import { CategoryMenuContent } from "./CategoryMenuContent";

/**
 * Client-side wrapper for the megamenu
 * This component handles all interactive elements (triggers, state, effects)
 */
export default function MegaMenuWrapper({ 
  categories
}: {
  categories: CategoryItem[];
}) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handle backdrop effect with a memoized function to improve performance
    const applyBackdropEffect = useCallback((isOpen: boolean) => {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;
        
        if (isOpen) {
            // Add blur and dimming effects to the main content
            mainElement.classList.add('backdrop-blur-md', 'brightness-50', 'transition-all', 'duration-300');

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
                {categories.map((category) => (
                    <NavigationMenuItem key={category.uid}>
                        <NavigationMenuTrigger
                            className={cn(
                                "text-sm font-medium bg-transparent",
                                pathname?.includes(`/category/${category.url_key}`)
                                    ? "text-primary"
                                    : "text-gray-700"
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
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
