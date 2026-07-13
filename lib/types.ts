export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'taxpayer' | 'admin';
  tin: string;
  phone: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: 'taxpayer' | 'admin';
  tin: string;
  loginAt: string;
}

export interface Filing {
  id: string;
  reference: string;
  userId: string;
  taxpayerName: string;
  taxpayerEmail: string;
  tin: string;
  taxPeriod: string;
  taxYear: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  totalIncome: number;
  totalDeductions: number;
  taxLiability: number;
  submittedAt: string | null;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  status: Filing['status'];
  date: string;
  note: string;
}

export interface Invoice {
  id: string;
  userId: string;
  filename: string;
  size: number;
  uploadDate: string;
  category: 'Income' | 'Expense' | 'VAT' | 'Payroll' | 'Other';
  status: 'Pending' | 'Verified' | 'Rejected';
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ReturnFormData {
  fullName: string;
  tin: string;
  phone: string;
  address: string;
  businessName: string;
  businessType: string;
  employmentIncome: string;
  businessIncome: string;
  rentalIncome: string;
  otherIncome: string;
  pensionContribution: string;
  charitableDonation: string;
  businessExpenses: string;
  taxYear: string;
  taxPeriod: string;
  declarationAccepted: boolean;
}
