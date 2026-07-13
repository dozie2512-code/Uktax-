'use client';

import { useEffect, useRef, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { getInvoices, uploadInvoice } from '@/lib/api';
import { getSession } from '@/lib/storage';
import type { Invoice, Session } from '@/lib/types';

const CATEGORIES: Invoice['category'][] = ['Income', 'Expense', 'VAT', 'Payroll', 'Other'];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function InvoicesContent() {
  const [session] = useState<Session | null>(() => getSession());
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<Invoice['category']>('Income');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) return;
    getInvoices(session.userId, session.role).then((data) => {
      setInvoices(data);
      setLoading(false);
    });
  }, [session]);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile || !session) {
      setUploadError('Please select a file.');
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      const invoice = await uploadInvoice(selectedFile, category, description, session.userId);
      setInvoices((prev) => [invoice, ...prev]);
      setShowForm(false);
      setSelectedFile(null);
      setDescription('');
      setCategory('Income');
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const filtered = invoices.filter((invoice) => {
    const term = search.toLowerCase();
    const matchSearch =
      invoice.filename.toLowerCase().includes(term) || invoice.description.toLowerCase().includes(term);
    const matchCategory = filterCat === 'All' || invoice.category === filterCat;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search invoices…"
            className="min-w-48 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <select
            value={filterCat}
            onChange={(event) => setFilterCat(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm((value) => !value)}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
        >
          📤 Upload Invoice
        </button>
      </div>

      {showForm ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Upload New Invoice</h3>
          {uploadError ? <p className="mb-3 text-sm text-red-600">{uploadError}</p> : null}
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                File <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.png,.jpg"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:font-medium file:text-green-700 hover:file:bg-green-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as Invoice['category'])}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {CATEGORIES.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Brief description…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="rounded-lg bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : '📤 Upload'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-500">
            {filtered.length} invoice{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading invoices…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Filename</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Size</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Upload Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{invoice.filename}</p>
                      <p className="text-xs text-gray-400">{invoice.description}</p>
                    </td>
                    <td className="px-4 py-3">{invoice.category}</td>
                    <td className="px-4 py-3">{formatSize(invoice.size)}</td>
                    <td className="px-4 py-3">{new Date(invoice.uploadDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={invoice.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      No invoices found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <AuthGuard>
      <AppLayout title="Invoices">
        <InvoicesContent />
      </AppLayout>
    </AuthGuard>
  );
}
