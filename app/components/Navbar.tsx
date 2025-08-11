import Link from "next/link";
import { Input } from "@/components/ui/input";
import { getAllCategories } from "@/services/categories";
import MiniCart from "@/components/minicart/Minicart";
import * as React from "react";
import ClientSideMegaMenu from "./ClientMegaMenu";


// Server component
export default async function Navbar() {
    const categories = await getAllCategories();

    return (
        <>
            <div>
                <Link href="/" className="text-lg font-medium hover:opacity-80 transition-opacity">Home</Link>
            </div>

            <ClientSideMegaMenu categories={categories} />

            <div className="flex flex-row items-center gap-6">
                <MiniCart/>
                <Input
                    type="search"
                    placeholder="Search"
                    className="w-full max-w-sm bg-transparent placeholder:text-black placeholder:opacity-100 border-gray-300"
                />
            </div>
        </>
    );
}
