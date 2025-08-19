import "server-only";

import type { Metadata } from "next";
import { AccountPageContent } from "./components/AccountPageContent"

export const metadata: Metadata = {
    title: "Account | Login / Signup",
};

export default async function AccountPage() {
    return (
        <div className="pt-24 sm:pt-28 md:pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AccountPageContent />
            </div>
        </div>
    );
}