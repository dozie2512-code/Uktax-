'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/Layout';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import { getFilings, getInvoices, getNotifications } from '@/lib/api';
import { getSession } from '@/lib/storage';
import type { Filing, Invoice, Notification, Session } from '@/lib/types';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

function DashboardContent() {
  const [session] = useState<Session | null>(() => getSession());
  const [filings, setFilings] = useState<Filing[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    Promise.all([
      getFilings(session.userId, session.role),
      getInvoices(session.userId, session.role),
      getNotifications(session.userId),
    ]).then(([filingsData, invoicesData, notificationData]) => {
      setFilings(filingsData);
      setInvoices(invoicesData);
      setNotifications(notificationData);
      setLoading(false);
    });
  }, [session]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-400">Loading dashboard…</div>;
  }

  const totalTax = filings
    .filter((filing) => filing.status === 'Approved')
    .reduce((sum, filing) => sum + filing.taxLiability, 0);
  const pendingCount = filings.filter(
    (filing) => filing.status === 'Submitted' || filing.status === 'Under Review',
  ).length;
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
        <p className="mb-1 text-sm text-green-200">Welcome back,</p>
        <h2 className="text-xl font-bold">{session?.name}</h2>
        <p className="mt-1 text-sm text-green-200">TIN: {session?.tin}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Filings" value={filings.length} icon="📋" />
        <MetricCard
          title="Approved"
          value={filings.filter((filing) => filing.status === 'Approved').length}
          icon="✅"
          color="text-green-700"
        />
        <MetricCard
          title="Pending Review"
          value={pendingCount}
          icon="⏳"
          color="text-yellow-600"
        />
        <MetricCard
          title="Tax Paid (Approved)"
          value={formatNaira(totalTax)}
          icon="💰"
          color="text-blue-700"
        />
      </div>

      {unread > 0 ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="mb-2 text-sm font-medium text-blue-800">
            🔔 {unread} unread notification{unread > 1 ? 's' : ''}
          </p>
          {notifications
            .filter((notification) => !notification.read)
            .map((notification) => (
              <p
                key={notification.id}
                className="border-b border-blue-100 py-1 text-sm text-blue-700 last:border-0"
              >
                {notification.message}
              </p>
            ))}
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-gray-800">Recent Tax Filings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Reference</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Period</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Tax Liability</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filings.slice(0, 5).map((filing) => (
                <tr key={filing.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{filing.reference}</td>
                  <td className="px-4 py-3">
                    {filing.taxPeriod} {filing.taxYear}
                  </td>
                  <td className="px-4 py-3">{formatNaira(filing.taxLiability)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={filing.status} />
                  </td>
                </tr>
              ))}
              {filings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    No filings yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-gray-800">Recent Invoices</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {invoices.slice(0, 4).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between px-5 py-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">{invoice.filename}</p>
                <p className="text-xs text-gray-400">
                  {invoice.category} · {new Date(invoice.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={invoice.status} />
            </div>
          ))}
          {invoices.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">No invoices uploaded yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppLayout title="Taxpayer Dashboard">
        <DashboardContent />
      </AppLayout>
    </AuthGuard>
  );
}
