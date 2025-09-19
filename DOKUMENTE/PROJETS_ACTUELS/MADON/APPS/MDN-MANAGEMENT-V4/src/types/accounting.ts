export interface Account {
  id: string;
  code: string;
  label: string;
  type: 'actif' | 'passif' | 'charge' | 'produit';
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Journal {
  id: string;
  code: string;
  label: string;
  type: 'ventes' | 'achats' | 'tresorerie' | 'operations-diverses';
  isActive: boolean;
}

export interface AccountingEntry {
  id: string;
  journalId: string;
  date: Date;
  reference: string;
  description: string;
  lines: EntryLine[];
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntryLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  description: string;
}

export interface FiscalYear {
  id: string;
  startDate: Date;
  endDate: Date;
  isClosed: boolean;
  isCurrent: boolean;
}

export interface VATRate {
  id: string;
  rate: number;
  label: string;
  isActive: boolean;
}

export interface VATDeclaration {
  id: string;
  period: string;
  collected: number;
  deductible: number;
  netAmount: number;
  status: 'draft' | 'validated' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

export interface Balance {
  accountId: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface FinancialStatement {
  assets: Balance[];
  liabilities: Balance[];
  income: Balance[];
  expenses: Balance[];
  date: Date;
}

export interface JournalEntry {
  id: string;
  date: string;
  journal: string;
  account: string;
  debit: number;
  credit: number;
  description: string;
  reference: string;
  vatRate?: number;
  vatAmount?: number;
  analyticalCode?: string;
  currency?: string;
  exchangeRate?: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VatRate {
  id: string;
  rate: number;
  name: string;
  isActive: boolean;
}

export interface AnalyticalDimension {
  id: string;
  code: string;
  name: string;
  type: 'project' | 'cost-center' | 'department';
  isActive: boolean;
}

export interface FixedAsset {
  id: string;
  code: string;
  name: string;
  acquisitionDate: string;
  acquisitionValue: number;
  depreciationMethod: 'linear' | 'declining';
  depreciationPeriod: number;
  residualValue: number;
  currentValue: number;
  isActive: boolean;
}

export interface BankReconciliation {
  id: string;
  accountId: string;
  statementDate: string;
  statementBalance: number;
  reconciledBalance: number;
  isReconciled: boolean;
}

export interface Provision {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  type: 'charge' | 'product';
  dueDate: string;
  isRealized: boolean;
}

export interface TaxDeclaration {
  id: string;
  type: 'vat' | 'income' | 'other';
  period: string;
  amount: number;
  status: 'draft' | 'validated' | 'submitted';
  dueDate: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  userId: string;
  timestamp: string;
  details: Record<string, any>;
} 