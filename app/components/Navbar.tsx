'use cache'

import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import {getAllCategories} from "@/services/categories";

export default async function Navbar() {
    const categories = await getAllCategories();

    return (
        <>
            <div>
                <Link href="/">Home</Link>
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    {categories.map((cat) => (
                        <NavigationMenuItem key={cat.uid}>
                            <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                                asChild>
                                <Link href={`/category/${cat.url_key}`}>{cat.name}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <div>search</div>
        </>
    );
}