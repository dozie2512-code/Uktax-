'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/storage';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function AuthGuard({ children, adminOnly = false }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const session = ready ? getSession() : null;
  const authorized = !!session && (!adminOnly || session.role === 'admin');

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    if (adminOnly && session.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [adminOnly, ready, router, session]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">Loading…</div>;
  }

  if (!authorized) return null;

  return <>{children}</>;
}
