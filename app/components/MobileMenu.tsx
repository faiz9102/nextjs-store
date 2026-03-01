'use client';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetClose
} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {Menu, Search, X} from 'lucide-react';
import {CategoryItem} from '@/types/category';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {cn} from '@/lib/utils';
import {Input} from '@/components/ui/input';
import {isCategoryActive, useNavigation} from './navigation/navigation-utils';
import {useAuth} from "@/context/authContext";

export default function MobileMenu({categories}: { categories: CategoryItem[] }) {
    const {isLoggedIn, logoutUser} = useAuth();
    const {
        pathname,
        isSearchOpen,
        setIsSearchOpen
    } = useNavigation(categories);

    async function handleLogout() {
        await logoutUser();
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                    <Menu className="h-5 w-5"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs px-0 pt-0 z-50">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b">
                        <Link href="/">
                            <h2 className="text-lg font-medium">Premium Store</h2>
                        </Link>
                    </div>

                    {/* Search toggle */}
                    <div className="px-4 py-3 border-b">
                        {isSearchOpen ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="flex-1 bg-transparent placeholder:text-gray-500"
                                    autoFocus
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                className="w-full flex justify-between items-center"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <span className="text-gray-500">Search products...</span>
                                <Search className="h-4 w-4 text-gray-500"/>
                            </Button>
                        )}
                    </div>

                    {/* Category navigation */}
                    <div className="flex-1 overflow-y-auto py-2">
                        <nav className="space-y-1">
                            <Link
                                href="/"
                                className={cn(
                                    "block px-4 py-2 text-base hover:bg-gray-50 transition-colors",
                                    pathname === "/" ? "text-primary font-medium" : "text-gray-900"
                                )}
                            >
                                Home
                            </Link>

                            {categories.map((category) => (
                                <CategoryAccordion
                                    key={category.uid}
                                    category={category}
                                    pathname={pathname}
                                />
                            ))}
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4">
                        {isLoggedIn ? (
                            <>
                                <Button variant="outline" className="w-full mb-2" onClick={handleLogout}>
                                    Log out
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Link href="/account" className="w-full">My Account</Link>
                                </Button>
                            </>
                        ) : (
                            <SheetClose asChild>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/account">Log in</Link>
                                </Button>
                            </SheetClose>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function CategoryAccordion({
                               category,
                               pathname,
                               level = 0
                           }: {
    category: CategoryItem;
    pathname: string;
    level?: number;
}) {
    const hasChildren = category.children && category.children.length > 0;
    const isActive = isCategoryActive(category, pathname);
    const padding = level > 0 ? {paddingLeft: `${(level + 1) * 0.75}rem`} : {};

    if (!hasChildren) {
        return (
            <Link
                href={`/category/${category.url_key}`}
                className={cn(
                    "block px-4 py-2 text-base hover:bg-gray-50 transition-colors",
                    isActive ? "text-primary font-semibold" : "text-gray-700"
                )}
                style={padding}
            >
                {category.name}
            </Link>
        );
    }

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={category.uid} className="border-none">
                <div className="flex items-center">
                    <Link
                        href={`/category/${category.url_key}`}
                        className={cn(
                            "block flex-1 py-2 text-base hover:bg-gray-50 transition-colors pl-4",
                            isActive ? "text-primary font-medium" : "text-gray-900"
                        )}
                        style={padding}
                    >
                        {category.name}
                    </Link>
                    <AccordionTrigger className="py-0 px-2"/>
                </div>
                <AccordionContent className="pb-0 pt-1">
                    {category.children?.map((child) => (
                        <CategoryAccordion
                            key={child.uid}
                            category={child}
                            pathname={pathname}
                            level={level + 1}
                        />
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
