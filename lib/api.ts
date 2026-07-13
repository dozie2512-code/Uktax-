import { MOCK_FILINGS, MOCK_INVOICES, MOCK_NOTIFICATIONS, MOCK_USERS } from './mockData';
import { getLocalFilings, getLocalInvoices, saveLocalFiling, saveLocalInvoice } from './storage';
import { Filing, Invoice, ReturnFormData, Session } from './types';

function genId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));
}

export async function login(email: string, password: string): Promise<Session> {
  await delay();
  const user = MOCK_USERS.find((entry) => entry.email === email && entry.password === password);
  if (!user) throw new Error('Invalid email or password');
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tin: user.tin,
    loginAt: new Date().toISOString(),
  };
}

export async function getFilings(userId: string, role: string): Promise<Filing[]> {
  await delay(300);
  const seed = MOCK_FILINGS.filter((filing) => role === 'admin' || filing.userId === userId);
  const local = getLocalFilings().filter((filing) => role === 'admin' || filing.userId === userId);
  const map = new Map<string, Filing>();
  seed.forEach((filing) => map.set(filing.id, filing));
  local.forEach((filing) => map.set(filing.id, filing));
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function submitFiling(
  data: ReturnFormData,
  userId: string,
  session: Session,
): Promise<Filing> {
  await delay(500);
  const totalIncome =
    parseFloat(data.employmentIncome || '0') +
    parseFloat(data.businessIncome || '0') +
    parseFloat(data.rentalIncome || '0') +
    parseFloat(data.otherIncome || '0');
  const totalDeductions =
    parseFloat(data.pensionContribution || '0') +
    parseFloat(data.charitableDonation || '0') +
    parseFloat(data.businessExpenses || '0');
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  const taxLiability = taxableIncome * 0.18;
  const now = new Date().toISOString();

  const filing: Filing = {
    id: `f-${genId()}`,
    reference: `REF-${new Date().getFullYear()}-${genId()}`,
    userId,
    taxpayerName: session.name,
    taxpayerEmail: session.email,
    tin: session.tin,
    taxPeriod: data.taxPeriod,
    taxYear: data.taxYear,
    status: 'Submitted',
    totalIncome,
    totalDeductions,
    taxLiability,
    submittedAt: now,
    updatedAt: now,
    timeline: [
      { status: 'Draft', date: now.slice(0, 10), note: 'Filing created' },
      { status: 'Submitted', date: now.slice(0, 10), note: 'Filing submitted for review' },
    ],
  };

  saveLocalFiling(filing);
  return filing;
}

export async function getInvoices(userId: string, role: string): Promise<Invoice[]> {
  await delay(300);
  const seed = MOCK_INVOICES.filter((invoice) => role === 'admin' || invoice.userId === userId);
  const local = getLocalInvoices().filter((invoice) => role === 'admin' || invoice.userId === userId);
  return [...local, ...seed].sort(
    (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
  );
}

export async function uploadInvoice(
  file: File,
  category: Invoice['category'],
  description: string,
  userId: string,
): Promise<Invoice> {
  await delay(600);
  const invoice: Invoice = {
    id: `inv-${genId()}`,
    userId,
    filename: file.name,
    size: file.size,
    uploadDate: new Date().toISOString(),
    category,
    status: 'Pending',
    description,
  };
  saveLocalInvoice(invoice);
  return invoice;
}

export async function getNotifications(userId: string) {
  await delay(200);
  return MOCK_NOTIFICATIONS.filter((notification) => notification.userId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getAdminStats() {
  await delay(300);
  const allFilings = await getFilings('', 'admin');
  const allInvoices = await getInvoices('', 'admin');
  return {
    totalTaxpayers: 3,
    pendingFilings: allFilings.filter(
      (filing) => filing.status === 'Submitted' || filing.status === 'Under Review',
    ).length,
    approvedFilings: allFilings.filter((filing) => filing.status === 'Approved').length,
    rejectedFilings: allFilings.filter((filing) => filing.status === 'Rejected').length,
    totalInvoices: allInvoices.length,
    recentFilings: allFilings.slice(0, 10),
  };
}
