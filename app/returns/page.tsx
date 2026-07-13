'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/Layout';
import { submitFiling } from '@/lib/api';
import { clearReturnDraft, getReturnDraft, getSession, saveReturnDraft } from '@/lib/storage';
import type { ReturnFormData, Session } from '@/lib/types';

const EMPTY: ReturnFormData = {
  fullName: '',
  tin: '',
  phone: '',
  address: '',
  businessName: '',
  businessType: '',
  employmentIncome: '',
  businessIncome: '',
  rentalIncome: '',
  otherIncome: '',
  pensionContribution: '',
  charitableDonation: '',
  businessExpenses: '',
  taxYear: new Date().getFullYear().toString(),
  taxPeriod: 'Annual',
  declarationAccepted: false,
};

const SECTIONS = ['Personal Details', 'Income', 'Deductions', 'Tax Period', 'Declaration'];

type FormErrors = Partial<Record<keyof ReturnFormData, string>>;

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
    </div>
  );
}

function ReturnsContent() {
  const router = useRouter();
  const [session] = useState<Session | null>(() => getSession());
  const [form, setForm] = useState<ReturnFormData>(() => {
    const savedDraft = getReturnDraft();
    const currentSession = getSession();
    return {
      ...EMPTY,
      fullName: currentSession?.name ?? '',
      tin: currentSession?.tin ?? '',
      ...savedDraft,
    };
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);



  function updateField(field: keyof ReturnFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validateStep(): boolean {
    const nextErrors: FormErrors = {};

    if (step === 0) {
      if (!form.fullName) nextErrors.fullName = 'Full name is required';
      if (!form.tin) nextErrors.tin = 'TIN is required';
      if (!form.phone) nextErrors.phone = 'Phone is required';
      if (!form.address) nextErrors.address = 'Address is required';
    }

    if (step === 1) {
      const hasIncome =
        form.employmentIncome || form.businessIncome || form.rentalIncome || form.otherIncome;
      if (!hasIncome) nextErrors.employmentIncome = 'At least one income field is required';
    }

    if (step === 4 && !form.declarationAccepted) {
      nextErrors.declarationAccepted = 'You must accept the declaration';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSaveDraft() {
    saveReturnDraft(form);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }

  async function handleSubmit() {
    if (!validateStep() || !session) return;
    setLoading(true);

    try {
      const filing = await submitFiling(form, session.userId, session);
      clearReturnDraft();
      setSuccess(`Filing submitted! Reference: ${filing.reference}`);
      setTimeout(() => router.push('/filing-status'), 2000);
    } catch {
      setErrors({ declarationAccepted: 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  function nextStep() {
    if (validateStep()) setStep((current) => Math.min(current + 1, SECTIONS.length - 1));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  const totalIncome = [
    form.employmentIncome,
    form.businessIncome,
    form.rentalIncome,
    form.otherIncome,
  ]
    .map((value) => parseFloat(value || '0'))
    .reduce((sum, value) => sum + value, 0);

  const totalDeductions = [
    form.pensionContribution,
    form.charitableDonation,
    form.businessExpenses,
  ]
    .map((value) => parseFloat(value || '0'))
    .reduce((sum, value) => sum + value, 0);

  const taxLiability = Math.max(0, totalIncome - totalDeductions) * 0.18;

  return (
    <div className="mx-auto max-w-2xl">
      {success ? (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-800">
          {success}
        </div>
      ) : null}

      <div className="mb-6 flex items-center gap-1">
        {SECTIONS.map((section, index) => (
          <div key={section} className="flex flex-1 items-center">
            <button
              onClick={() => {
                if (index < step) setStep(index);
              }}
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                index < step
                  ? 'bg-green-600 text-white'
                  : index === step
                    ? 'bg-green-700 text-white ring-2 ring-green-300'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < step ? '✓' : index + 1}
            </button>
            {index < SECTIONS.length - 1 ? (
              <div className={`mx-1 h-0.5 flex-1 ${index < step ? 'bg-green-500' : 'bg-gray-200'}`} />
            ) : null}
          </div>
        ))}
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Step {step + 1} of {SECTIONS.length}:{' '}
        <strong className="text-gray-700">{SECTIONS[step]}</strong>
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {step === 0 ? (
          <div className="space-y-4">
            <h3 className="mb-4 font-semibold text-gray-800">Personal / Company Details</h3>
            <Field
              label="Full Name"
              value={form.fullName}
              onChange={(value) => updateField('fullName', value)}
              required
            />
            {errors.fullName ? <p className="text-xs text-red-500">{errors.fullName}</p> : null}
            <Field
              label="Tax Identification Number (TIN)"
              value={form.tin}
              onChange={(value) => updateField('tin', value)}
              required
            />
            {errors.tin ? <p className="text-xs text-red-500">{errors.tin}</p> : null}
            <Field
              label="Phone Number"
              value={form.phone}
              onChange={(value) => updateField('phone', value)}
              required
            />
            {errors.phone ? <p className="text-xs text-red-500">{errors.phone}</p> : null}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.address}
                onChange={(event) => updateField('address', event.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            {errors.address ? <p className="text-xs text-red-500">{errors.address}</p> : null}
            <Field
              label="Business / Employer Name (optional)"
              value={form.businessName}
              onChange={(value) => updateField('businessName', value)}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Business Type</label>
              <select
                value={form.businessType}
                onChange={(event) => updateField('businessType', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select…</option>
                <option value="Individual">Individual</option>
                <option value="Sole Proprietor">Sole Proprietor</option>
                <option value="Limited Company">Limited Company</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <h3 className="mb-4 font-semibold text-gray-800">Income Details (₦)</h3>
            <Field
              label="Employment Income"
              value={form.employmentIncome}
              onChange={(value) => updateField('employmentIncome', value)}
              type="number"
              placeholder="0.00"
            />
            {errors.employmentIncome ? (
              <p className="text-xs text-red-500">{errors.employmentIncome}</p>
            ) : null}
            <Field
              label="Business Income"
              value={form.businessIncome}
              onChange={(value) => updateField('businessIncome', value)}
              type="number"
              placeholder="0.00"
            />
            <Field
              label="Rental Income"
              value={form.rentalIncome}
              onChange={(value) => updateField('rentalIncome', value)}
              type="number"
              placeholder="0.00"
            />
            <Field
              label="Other Income"
              value={form.otherIncome}
              onChange={(value) => updateField('otherIncome', value)}
              type="number"
              placeholder="0.00"
            />
            <div className="rounded-lg border border-green-100 bg-green-50 p-3">
              <p className="text-sm text-green-800">
                Total Income: <strong>₦{totalIncome.toLocaleString()}</strong>
              </p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h3 className="mb-4 font-semibold text-gray-800">Deductions (₦)</h3>
            <Field
              label="Pension Contribution"
              value={form.pensionContribution}
              onChange={(value) => updateField('pensionContribution', value)}
              type="number"
              placeholder="0.00"
            />
            <Field
              label="Charitable Donations"
              value={form.charitableDonation}
              onChange={(value) => updateField('charitableDonation', value)}
              type="number"
              placeholder="0.00"
            />
            <Field
              label="Business Expenses"
              value={form.businessExpenses}
              onChange={(value) => updateField('businessExpenses', value)}
              type="number"
              placeholder="0.00"
            />
            <div className="space-y-1 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Total Deductions: <strong>₦{totalDeductions.toLocaleString()}</strong>
              </p>
              <p className="text-sm text-blue-800">
                Estimated Tax Liability (18%): <strong>₦{taxLiability.toLocaleString()}</strong>
              </p>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h3 className="mb-4 font-semibold text-gray-800">Tax Period</h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tax Year <span className="text-red-500">*</span>
              </label>
              <select
                value={form.taxYear}
                onChange={(event) => updateField('taxYear', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {['2026', '2025', '2024', '2023', '2022', '2021'].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tax Period <span className="text-red-500">*</span>
              </label>
              <select
                value={form.taxPeriod}
                onChange={(event) => updateField('taxPeriod', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="Annual">Annual</option>
                <option value="Q1">Q1 (Jan–Mar)</option>
                <option value="Q2">Q2 (Apr–Jun)</option>
                <option value="Q3">Q3 (Jul–Sep)</option>
                <option value="Q4">Q4 (Oct–Dec)</option>
              </select>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <h3 className="mb-4 font-semibold text-gray-800">Declaration</h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
              <p className="mb-2 font-medium text-gray-800">Summary</p>
              <p>Total Income: ₦{totalIncome.toLocaleString()}</p>
              <p>Total Deductions: ₦{totalDeductions.toLocaleString()}</p>
              <p>Taxable Income: ₦{Math.max(0, totalIncome - totalDeductions).toLocaleString()}</p>
              <p className="mt-2 font-semibold text-green-700">
                Estimated Tax Liability (18%): ₦{taxLiability.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              I hereby declare that the information provided in this return is true, correct,
              and complete to the best of my knowledge and belief.
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.declarationAccepted}
                onChange={(event) => updateField('declarationAccepted', event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-green-700"
              />
              <span className="text-sm text-gray-700">
                I accept the declaration and confirm the information is accurate.
              </span>
            </label>
            {errors.declarationAccepted ? (
              <p className="text-xs text-red-500">{errors.declarationAccepted}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex gap-2">
            {step > 0 ? (
              <button
                onClick={previousStep}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                ← Back
              </button>
            ) : null}
            <button
              onClick={handleSaveDraft}
              className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              {draftSaved ? '✓ Saved' : 'Save Draft'}
            </button>
          </div>
          {step < SECTIONS.length - 1 ? (
            <button
              onClick={nextStep}
              className="rounded-lg bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? 'Submitting…' : '✓ Submit Return'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReturnsPage() {
  return (
    <AuthGuard>
      <AppLayout title="Tax Returns">
        <ReturnsContent />
      </AppLayout>
    </AuthGuard>
  );
}
