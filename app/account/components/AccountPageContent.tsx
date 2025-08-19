"use client";

import "client-only";
import AuthForm from "@/app/components/auth/AuthForm";
import {useAuth} from "@/context/authContext";

export function AccountPageContent() {
    const {isLoggedIn} = useAuth();
    return (
        isLoggedIn ? (
            <h1 className="text-3xl font-bold mb-6">You are logged In</h1>
        ) : (
            <>
                <h1 className="text-3xl font-bold mb-6">Account</h1>
                <p className="text-gray-600 mb-6">Login to your account or create a new one.</p>
                <AuthForm/>
            </>
        )
    )
}