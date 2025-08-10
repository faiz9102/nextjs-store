import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Premium Store | Modern Shopping Experience",
    description: "Discover our premium collection of products with a modern shopping experience",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
        <body
            className={`${geistSans.className} ${geistMono.className} antialiased min-h-dvh bg-gradient-to-b from-white to-gray-50`}
        >
        <div
            className="
            fixed
            top-3
            left-1/2
            -translate-x-1/2
            w-[95%]
            sm:w-[90%]
            md:w-[92%]
            lg:w-[94%]
            xl:w-[96%]
            min-h-[3.75rem]
            rounded-2xl shadow-lg
            bg-white/50
            backdrop-blur-md
            flex
            justify-between
            items-center
            px-4
            sm:px-6
            md:px-8
            lg:px-10
          "
            style={{zIndex: "9999"}}
        >
            <Navbar/>
        </div>
        <main className="min-h-[80dvh]">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}
