import { Filing, Invoice, ReturnFormData, Session } from './types';

const KEYS = {
  SESSION: 'rev360_session',
  FILINGS: 'rev360_filings',
  INVOICES: 'rev360_invoices',
  DRAFT: 'rev360_return_draft',
};

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.SESSION);
}

export function getLocalFilings(): Filing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.FILINGS);
    return raw ? (JSON.parse(raw) as Filing[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalFiling(filing: Filing): void {
  if (typeof window === 'undefined') return;
  const all = getLocalFilings();
  const idx = all.findIndex((item) => item.id === filing.id);
  if (idx >= 0) all[idx] = filing;
  else all.push(filing);
  localStorage.setItem(KEYS.FILINGS, JSON.stringify(all));
}

export function getLocalInvoices(): Invoice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.INVOICES);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalInvoice(invoice: Invoice): void {
  if (typeof window === 'undefined') return;
  const all = getLocalInvoices();
  all.unshift(invoice);
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(all));
}

export function getReturnDraft(): Partial<ReturnFormData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.DRAFT);
    return raw ? (JSON.parse(raw) as Partial<ReturnFormData>) : null;
  } catch {
    return null;
  }
}

export function saveReturnDraft(data: Partial<ReturnFormData>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.DRAFT, JSON.stringify(data));
}

export function clearReturnDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.DRAFT);
}
