'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup-only fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const resetErrors = () => setError(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    resetErrors();

    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Login failed');
        return;
      }
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    resetErrors();

    if (!firstname.trim() || !lastname.trim()) {
      setError('First name and last name are required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstname, lastname, password })
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Signup failed');
        return;
      }
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'signup')}>
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {error && (
          <div className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="firstname">First name</label>
                <Input id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="lastname">Last name</label>
                <Input id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="signup-email">Email</label>
              <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="signup-password">Password</label>
              <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
