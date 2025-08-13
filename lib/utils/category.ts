import type { CategoryItem } from '@/types/category';

/**
 * takes category items with N children depth
 * and extract all categories into a flat array
 * the children are preserved in the flat array
 *
 * @param categoryItems
 */
export const flatMapCategories = (categoryItems: CategoryItem[]): CategoryItem[] => {
    if (!categoryItems || categoryItems.length === 0) return [];

    let allCats: CategoryItem[] = [...categoryItems];

    // Process each category's children recursively
    categoryItems.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
            allCats = [...allCats, ...flatMapCategories(cat.children)];
        }
    });

    return allCats;
};

export const flatMapUniqueCategories = (categoryItems: CategoryItem[]): CategoryItem[] => {
    if (!categoryItems || categoryItems.length === 0) return [];

    const allCats: CategoryItem[] = flatMapCategories(categoryItems);

    const seen = new Set<number>();
    const unique: CategoryItem[] = [];

    for (const cat of allCats) {
        if (!seen.has(cat.id)) {
            seen.add(cat.id);
            unique.push(cat);
        }
    }

    return unique;
};

/**
 * Checks if a category exists in the path given
 * based on the category's id.
 *
 *
 * example path could be "1/2/3" or "1/2/3/4"
 * and category with id 3 would match
 *
 * @param category
 * @param path
 * @param level - optional, if provided, checks only at that level in the path
 */
export const isCategoryInPath = (
    category: CategoryItem,
    path: string | undefined,
    level: number | null = null
): boolean => {
    if (!category || !path) return false;

    // Exact path match shortcut
    if (category.path === path) return true;

    const segments = path.split('/').filter(Boolean);

    if (level === null) {
        return segments.some(seg => Number(seg) === category.id);
    }

    // Invalid level bounds
    if (level < 0 || level >= segments.length) return false;

    return Number(segments[level]) === category.id;
};

/**
 * Checks if a category is active based on the current path.
 * only checks if the path is in the format of `/category/{category.url_key}`
 *
 * @param categories - The category to check.
 * @param urlPath - The path to match against.
 * @returns {boolean} - True if the category is active, false otherwise.
 */
export function getActiveCategoryPath(categories: CategoryItem[], urlPath: string): string {
    if (!urlPath) return '';
    const index: number = categories.findIndex((category) => {
        if (urlPath.includes(`/category/${category.url_key}`))
            return true;
    });

    return index >= 0 ? categories[index].url_key : '';
}

/**
 * Finds the active category based on the current URL key.
 * Returns the first matching category or null if not found.
 * only works with the first level of categories
 * (does not check children categories)
 *
 *
 * @param categories - Array of category items to search in.
 * @param currentUrlKey - The URL key to match against.
 * @returns {CategoryItem | null} - The active category or null if not found.
 */
export const getActiveCategory = function (categories : CategoryItem[], currentUrlKey: string) : CategoryItem | null {
    if (!currentUrlKey || !categories || categories.length === 0) return null;

    categories = flatMapUniqueCategories(categories);

    const category = categories.find((category) => category.url_key === currentUrlKey);

    return category || null;
}