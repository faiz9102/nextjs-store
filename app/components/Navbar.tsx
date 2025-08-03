import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import {getAllCategories} from "@/services/categories";

export default async function Navbar() {
    const categories = await getAllCategories();
    console.table(categories);

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {categories.map((cat) => (
                    <NavigationMenuItem key={cat.id}>
                        <NavigationMenuLink href={`/category/${cat.slug}`}>
                            {cat.name}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}