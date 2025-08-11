'use client';

import { CategoryItem } from "@/types/category";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Shared navigation utilities for both mobile and desktop menus
 * This centralizes common logic to make the code more robust
 */

// Check if a category is active based on the current path
export function isCategoryActive(category: CategoryItem, pathname?: string): boolean {
  if (!pathname) return false;
  return pathname.includes(`/category/${category.url_key}`);
}

// Get all parent categories of a specific category
export function getCategoryParents(categories: CategoryItem[], targetUrlKey: string): CategoryItem[] {
  const parents: CategoryItem[] = [];
  
  function findParents(cats: CategoryItem[], urlKey: string, currentPath: CategoryItem[] = []): boolean {
    for (const cat of cats) {
      const newPath = [...currentPath, cat];
      
      if (cat.url_key === urlKey) {
        parents.push(...newPath);
        return true;
      }
      
      if (cat.children && cat.children.length > 0) {
        if (findParents(cat.children, urlKey, newPath)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  findParents(categories, targetUrlKey, []);
  return parents;
}

// React hook for shared navigation state
export function useNavigation(categories: CategoryItem[]) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Identify current active category if any
  const activeCategory = pathname && pathname.includes('/category/')
    ? pathname.split('/category/')[1]
    : null;
    
  // Get all parent categories of current active category
  const activePath = activeCategory 
    ? getCategoryParents(categories, activeCategory)
    : [];
  
  return {
    pathname,
    isSearchOpen,
    setIsSearchOpen,
    isMenuOpen,
    setIsMenuOpen,
    activeCategory,
    activePath,
    isCategoryActive: (category: CategoryItem) => isCategoryActive(category, pathname)
  };
}
