'use client';

import "client-only";
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signup } from '@/app/actions/auth';
import { useAuth } from '@/context/authContext';

type TabKey = 'login' | 'signup';
type FieldName = 'email' | 'password' | 'firstname' | 'lastname';
type FieldErrors = Partial<Record<FieldName, string>>;

const isEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const validateLogin = (data: { email: string; password: string }): FieldErrors => {
    const errs: FieldErrors = {};
    if (!data.email?.trim()) errs.email = 'Email is required';
    else if (!isEmail(data.email)) errs.email = 'Enter a valid email';
    if (!data.password) errs.password = 'Password is required';
    else if (data.password.length < 8) errs.password = 'Minimum 8 characters';
    return errs;
};

const validateSignup = (data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}): FieldErrors => {
    const errs = validateLogin({ email: data.email, password: data.password });
    if (!data.firstname?.trim()) errs.firstname = 'First name is required';
    else if (data.firstname.trim().length < 2) errs.firstname = 'Too short';
    if (!data.lastname?.trim()) errs.lastname = 'Last name is required';
    else if (data.lastname.trim().length < 2) errs.lastname = 'Too short';
    return errs;
};

export default function AuthForm() {
    const { loginUser } = useAuth();
    const router = useRouter();

    const [tab, setTab] = useState<TabKey>('login');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const clearFieldError = (name: FieldName) => {
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const data = { email, password };
        const errs = validateLogin(data);
        setFieldErrors(errs);

        if (Object.keys(errs).length > 0) return;

        try {
            setLoading(true);
            const formData = new FormData(e.currentTarget);
            await loginUser(formData);
            router.refresh();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const data = { email, password, firstname, lastname };
        const errs = validateSignup(data);
        setFieldErrors(errs);

        if (Object.keys(errs).length > 0) return;

        try {
            setLoading(true);
            const formData = new FormData(e.currentTarget);
            if ((await signup(formData)).ok)
            {
                setTab('login');
                setEmail('');
                setPassword('');
                setFirstname('');
                setLastname('');
                router.refresh();
            }
        } catch {
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
            <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
                <TabsList className="grid grid-cols-2 w-full mb-4">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {error && (
                    <div className="mb-4 text-sm text-red-600" role="alert" aria-live="polite">
                        {error}
                    </div>
                )}

                <TabsContent value="login">
                    <form noValidate onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                aria-invalid={!!fieldErrors.email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) clearFieldError('email');
                                }}
                                className={fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                required
                            />
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                aria-invalid={!!fieldErrors.password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) clearFieldError('password');
                                }}
                                className={fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                minLength={8}
                                required
                            />
                            {fieldErrors.password && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="signup">
                    <form noValidate onSubmit={handleSignupSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="firstname">First name</label>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    value={firstname}
                                    aria-invalid={!!fieldErrors.firstname}
                                    onChange={(e) => {
                                        setFirstname(e.target.value);
                                        if (fieldErrors.firstname) clearFieldError('firstname');
                                    }}
                                    className={fieldErrors.firstname ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    required
                                />
                                {fieldErrors.firstname && (
                                    <p className="mt-1 text-xs text-red-600">{fieldErrors.firstname}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="lastname">Last name</label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    value={lastname}
                                    aria-invalid={!!fieldErrors.lastname}
                                    onChange={(e) => {
                                        setLastname(e.target.value);
                                        if (fieldErrors.lastname) clearFieldError('lastname');
                                    }}
                                    className={fieldErrors.lastname ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    required
                                />
                                {fieldErrors.lastname && (
                                    <p className="mt-1 text-xs text-red-600">{fieldErrors.lastname}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="signup-email">Email</label>
                            <Input
                                id="signup-email"
                                name="email"
                                type="email"
                                value={email}
                                aria-invalid={!!fieldErrors.email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) clearFieldError('email');
                                }}
                                className={fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                required
                            />
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="signup-password">Password</label>
                            <Input
                                id="signup-password"
                                name="password"
                                type="password"
                                value={password}
                                aria-invalid={!!fieldErrors.password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) clearFieldError('password');
                                }}
                                className={fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                minLength={8}
                                required
                            />
                            {fieldErrors.password && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}