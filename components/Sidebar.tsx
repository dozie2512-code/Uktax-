'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearSession, getSession } from '@/lib/storage';
import type { Session } from '@/lib/types';

const NAV_TAXPAYER = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/returns', icon: '📋', label: 'Tax Returns' },
  { href: '/invoices', icon: '📄', label: 'Invoices' },
  { href: '/filing-status', icon: '🔍', label: 'Filing Status' },
];

const NAV_ADMIN = [
  { href: '/admin', icon: '⚙️', label: 'Admin Dashboard' },
  { href: '/filing-status', icon: '🔍', label: 'All Filings' },
  { href: '/invoices', icon: '📄', label: 'Invoices' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [session] = useState<Session | null>(() => getSession());
  const navItems = session?.role === 'admin' ? NAV_ADMIN : NAV_TAXPAYER;

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={onClose} />
      ) : null}

      <aside
        className={`fixed top-0 left-0 z-30 flex h-full w-64 flex-col bg-[#1B5E20] text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-lg">🦅</div>
          <div>
            <p className="text-sm font-bold leading-tight">Rev 360</p>
            <p className="text-xs text-white/60">Nigeria Tax Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          {session ? (
            <div className="mb-3">
              <p className="truncate text-sm font-medium text-white">{session.name}</p>
              <p className="truncate text-xs text-white/60">{session.email}</p>
              <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs capitalize">
                {session.role}
              </span>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
