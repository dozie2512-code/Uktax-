'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/Layout';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import { getAdminStats } from '@/lib/api';
import type { Filing } from '@/lib/types';

interface Stats {
  totalTaxpayers: number;
  pendingFilings: number;
  approvedFilings: number;
  rejectedFilings: number;
  totalInvoices: number;
  recentFilings: Filing[];
}

function AdminContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    getAdminStats().then((data) => {
      setStats(data as Stats);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-400">Loading admin data…</div>;
  }

  if (!stats) return null;

  const filtered =
    filterStatus === 'All'
      ? stats.recentFilings
      : stats.recentFilings.filter((filing) => filing.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Total Taxpayers" value={stats.totalTaxpayers} icon="👥" color="text-blue-700" />
        <MetricCard title="Pending Filings" value={stats.pendingFilings} icon="⏳" color="text-yellow-600" />
        <MetricCard title="Approved Filings" value={stats.approvedFilings} icon="✅" color="text-green-700" />
        <MetricCard title="Rejected Filings" value={stats.rejectedFilings} icon="❌" color="text-red-600" />
        <MetricCard title="Total Invoices" value={stats.totalInvoices} icon="📄" color="text-purple-700" />
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-green-700 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-gray-800">All Filings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Reference</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Taxpayer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">TIN</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Period</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Tax Liability</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((filing) => (
                <tr key={filing.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{filing.reference}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{filing.taxpayerName}</p>
                    <p className="text-xs text-gray-400">{filing.taxpayerEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{filing.tin}</td>
                  <td className="px-4 py-3">
                    {filing.taxPeriod} {filing.taxYear}
                  </td>
                  <td className="px-4 py-3 font-semibold">₦{filing.taxLiability.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={filing.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(filing.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No filings found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard adminOnly>
      <AppLayout title="Admin Dashboard">
        <AdminContent />
      </AppLayout>
    </AuthGuard>
  );
}
