"use server";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { getAllCategories } from "@/services/categories";
import MiniCart from "@/components/minicart/Minicart";
import * as React from "react";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import { Account } from "@/app/components/auth/Account";

export default async function Navbar() {
    const categories = await getAllCategories();

    return (
        <>
            {/* Mobile menu (visible on small and medium screens) */}
            <div className="block lg:hidden">
                <MobileMenu categories={categories} />
            </div>

            {/* Logo/Home link (visible on all screens) */}
            <div>
                <Link href="/" className="text-lg font-medium hover:opacity-80 transition-opacity">Home</Link>
            </div>

            {/* Desktop mega menu (hidden on mobile and medium screens) */}
            <div className="hidden lg:block">
                <MegaMenu categories={categories} />
            </div>

            {/* Right side elements */}
            <div className="flex flex-row items-center gap-6">
                <span className={`hidden sm:block`}>
                    <Account />
                </span>
                <MiniCart />
                {/* Search input (hidden on mobile) */}
                <div className="hidden lg:block">
                    <Input
                        type="search"
                        placeholder="Search"
                        className="w-full
                        max-w-sm bg-transparent
                        placeholder:text-black
                        placeholder:opacity-100
                        border-gray-300"
                    />
                </div>
            </div>
        </>
    );
}