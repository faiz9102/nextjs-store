'use client';

import "client-only";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from "@/context/authContext"

export function Account() {
    async function handleLogout()
    {
        await logoutUser();
    }

    const { logoutUser, isLoggedIn, user } = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>MSK</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account/profile">Profile</Link>
                </DropdownMenuItem>
                {isLoggedIn ? (
                    <DropdownMenuItem
                        onClick={handleLogout}
                    >
                        Logout
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem asChild>
                        <Link href="/account">Login</Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}