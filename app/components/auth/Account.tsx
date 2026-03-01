'use client';

import "client-only";
import Link from 'next/link';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from "@/context/authContext"
import {useEffect, useState} from "react";
import {User as UserIcon} from 'lucide-react';

export function Account() {
    const {logoutUser, isLoggedIn, user} = useAuth();

    async function handleLogout() {
        await logoutUser();
    }

    const [initials, setInitials] = useState<string|null>(null);

    useEffect(() => {
        if (user) {
            const middleInitial = user.middlename?.charAt(0).toUpperCase() ?? "";
            setInitials(`${user.firstname.charAt(0)}${middleInitial}${user.lastname.charAt(0)}`.toUpperCase());
        } else {
            setInitials(null);
        }
    }, [user]);


    return (
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none" asChild>
                    {initials !== null ? (
                        <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <UserIcon/>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    {isLoggedIn ? (
                        <>
                            <DropdownMenuItem asChild>
                                <Link href="/account">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleLogout}
                            >
                                Logout
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <DropdownMenuItem asChild>
                            <Link href="/account">Log in</Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
    );
}