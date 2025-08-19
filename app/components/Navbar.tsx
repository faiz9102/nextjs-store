import Link from "next/link";
import { Input } from "@/components/ui/input";
import { getAllCategories } from "@/services/categories";
import MiniCart from "@/components/minicart/Minicart";
import * as React from "react";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import { Account } from "@/app/components/auth/Account";


// Server component
export default async function Navbar() {
    const categories = await getAllCategories();

    return (
        <>
            {/* Mobile menu (only visible on small screens) */}
            <div className="md:hidden">
                <MobileMenu categories={categories} />
            </div>

            {/* Logo/Home link (visible on all screens) */}
            <div>
                <Link href="/" className="text-lg font-medium hover:opacity-80 transition-opacity">Home</Link>
            </div>

            {/* Desktop mega menu (hidden on mobile) */}
            <div className="hidden md:block">
                <MegaMenu categories={categories} />
            </div>

            {/* Right side elements */}
            <div className="flex flex-row items-center gap-6">
                <Account />
                <MiniCart />
                {/* Search input (hidden on mobile) */}
                <div className="hidden md:block">
                    <Input
                        type="search"
                        placeholder="Search"
                        className="w-full max-w-sm bg-transparent placeholder:text-black placeholder:opacity-100 border-gray-300"
                    />
                </div>
            </div>
        </>
    );
}
