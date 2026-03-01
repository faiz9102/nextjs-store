"use client";

import "client-only";
import {createContext, ReactNode, useContext, useState, useEffect} from 'react';
import {type User} from '@/types/customer';
import {getCustomer, login, logout} from '@/app/actions/auth';
import {useCart} from '@/context/cartContext';

type AuthContextType = {
    isLoggedIn: boolean;
    user: User | null;
    loginUser: (formData: FormData) => Promise<void>;
    logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    user: null,
    loginUser: async () => {
        throw new Error('An Error occurred while logging in. Please try again.');
    },
    logoutUser: async () => {
        throw new Error('An Error occurred while logging out. Please try again.');
    },
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Cart operations triggered on login/logout
    const {mergeWithCustomerCart, resetCart} = useCart();

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await getCustomer();
            if (authStatus.ok) {
                setIsLoggedIn(true);
                setUser(authStatus.user);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        };
        checkAuth();
    }, []);
    async function loginUser(formData: FormData) {
        const email = String(formData.get('email'));
        const password = String(formData.get('password'));

        if (!email || !password) {
            throw new Error('please provide both email and password');
        }

        const res = await login(formData);

        if (!res.ok) {
            throw new Error(res.error.message || 'Login failed');
        }

        setIsLoggedIn(true);

        const customerData = await getCustomer();
        if (!customerData.ok) {
            throw new Error('Failed to fetch customer data');
        }

        setUser(customerData.user);

        // Merge the guest cart into the newly-authenticated customer's cart.
        // mergeWithCustomerCart reads the guest cart ID from localStorage,
        // calls the server action (which uses the fresh auth cookie), and then
        // clears localStorage — so no cart ID is left after login.
        await mergeWithCustomerCart();
    }

    async function logoutUser() : Promise<void> {
        const res = await logout();

        if (!res.ok) {
            throw new Error('Logout failed');
        }

        setIsLoggedIn(false);
        setUser(null);

        // Trash the customer cart state and create a fresh guest cart
        await resetCart();
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, user, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};