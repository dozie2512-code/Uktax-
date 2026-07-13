'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { getSession, setSession } from '@/lib/storage';

const DEMO_ACCOUNTS = [
  { label: 'Taxpayer: John Doe', email: 'john.doe@example.com', password: 'password123' },
  { label: 'Taxpayer: Jane Smith', email: 'jane.smith@example.com', password: 'password123' },
  { label: 'Admin: FIRS Admin', email: 'admin@rev360.gov.ng', password: 'admin2024' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace(session.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const session = await login(email, password);
      setSession(session);
      router.replace(session.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-900 to-green-700 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl">
            🦅
          </div>
          <h1 className="text-2xl font-bold text-white">Rev 360</h1>
          <p className="mt-1 text-sm text-green-200">Nigeria Tax Management Portal</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">Sign in to your account</h2>

          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 py-2.5 font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
              Demo Accounts
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{account.label}</span>
                  <br />
                  <span className="text-gray-400">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-green-200">
          Federal Inland Revenue Service (FIRS) · Rev 360 Portal
        </p>
      </div>
    </div>
  );
}
