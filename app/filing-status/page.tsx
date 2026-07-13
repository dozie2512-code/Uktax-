'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { getFilings } from '@/lib/api';
import { getSession } from '@/lib/storage';
import type { Filing } from '@/lib/types';

const STATUS_STEP: Record<string, number> = {
  Draft: 0,
  Submitted: 1,
  'Under Review': 2,
  Approved: 3,
  Rejected: 3,
};

function Timeline({ filing }: { filing: Filing }) {
  const steps = ['Draft', 'Submitted', 'Under Review', filing.status === 'Rejected' ? 'Rejected' : 'Approved'];
  const current = STATUS_STEP[filing.status] ?? 0;

  return (
    <div className="mt-4 px-4 pb-4">
      <div className="flex items-center gap-0 overflow-x-auto">
        {steps.map((step, index) => {
          const reached = index <= current;
          const isLast = index === steps.length - 1;
          const isRejected = step === 'Rejected';
          const color = reached ? (isRejected ? 'bg-red-500' : 'bg-green-600') : 'bg-gray-200';
          const textColor = reached ? (isRejected ? 'text-red-600' : 'text-green-700') : 'text-gray-400';
          const event = filing.timeline.find((item) => item.status === step);

          return (
            <div key={step} className="flex min-w-28 flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>
                  {reached ? '✓' : index + 1}
                </div>
                <p className={`mt-1 text-center text-xs font-medium whitespace-nowrap ${textColor}`}>{step}</p>
                {event ? <p className="mt-0.5 text-xs text-gray-400">{event.date}</p> : null}
              </div>
              {!isLast ? (
                <div
                  className={`-mt-5 mx-1 h-0.5 flex-1 ${
                    index < current
                      ? filing.status === 'Rejected' && index === current - 1
                        ? 'bg-red-400'
                        : 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilingStatusContent() {
  const [filings, setFilings] = useState<Filing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    getFilings(session.userId, session.role).then((data) => {
      setFilings(data);
      setLoading(false);
    });
  }, []);

  const statuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'];
  const filtered = filterStatus === 'All' ? filings : filings.filter((filing) => filing.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-green-700 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status}{' '}
            {status !== 'All' ? (
              <span className="ml-1 text-xs opacity-70">({filings.filter((filing) => filing.status === status).length})</span>
            ) : null}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading filings…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400">
          No filings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((filing) => (
            <div key={filing.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div
                className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50"
                onClick={() => setExpanded(expanded === filing.id ? null : filing.id)}
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-800">{filing.reference}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {filing.taxPeriod} {filing.taxYear} · {filing.taxpayerName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-gray-700">₦{filing.taxLiability.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Tax Liability</p>
                  </div>
                  <StatusBadge status={filing.status} />
                  <span className="text-sm text-gray-400">{expanded === filing.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === filing.id ? (
                <div className="border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 px-5 py-3 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Income</p>
                      <p className="font-medium">₦{filing.totalIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Deductions</p>
                      <p className="font-medium">₦{filing.totalDeductions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tax Liability</p>
                      <p className="font-medium text-green-700">₦{filing.taxLiability.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Submitted</p>
                      <p className="font-medium">
                        {filing.submittedAt ? new Date(filing.submittedAt).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </div>
                  <Timeline filing={filing} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilingStatusPage() {
  return (
    <AuthGuard>
      <AppLayout title="Filing Status">
        <FilingStatusContent />
      </AppLayout>
    </AuthGuard>
  );
}
