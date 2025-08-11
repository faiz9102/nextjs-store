import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input"
import {getAllCategories} from "@/services/categories";
import MiniCart from "@/components/minicart/Minicart";

export default async function Navbar() {
    const categories = await getAllCategories();

    return (
        <>
            <div>
                <Link href="/" className="text-lg font-medium hover:opacity-80 transition-opacity">Home</Link>
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
            <div className="flex flex-row items-center gap-6">
                <MiniCart />
                <Input
                    type="search"
                    placeholder="Search"
                    className="w-full max-w-sm bg-transparent placeholder:text-black placeholder:opacity-100 border-gray-300"
                />
            </div>
        </>
    );
}