import { Journal, AccountingEntry } from '@/types/accounting';

export const TEST_JOURNALS: Journal[] = [
  {
    id: '1',
    code: 'VE',
    label: 'Journal des Ventes',
    type: 'ventes',
    isActive: true,
  },
  {
    id: '2',
    code: 'AC',
    label: 'Journal des Achats',
    type: 'achats',
    isActive: true,
  },
  {
    id: '3',
    code: 'BQ',
    label: 'Journal de Banque',
    type: 'tresorerie',
    isActive: true,
  },
  {
    id: '4',
    code: 'OD',
    label: 'Journal des Opérations Diverses',
    type: 'operations-diverses',
    isActive: true,
  },
];

export const TEST_ENTRIES: AccountingEntry[] = [
  {
    id: '1',
    journalId: '1',
    date: new Date('2024-01-15'),
    reference: 'FAC-2024-001',
    description: 'Facture client XYZ',
    lines: [
      {
        id: '1-1',
        accountId: '411',
        debit: 0,
        credit: 1200,
        description: 'Client XYZ',
      },
      {
        id: '1-2',
        accountId: '707',
        debit: 1000,
        credit: 0,
        description: 'Vente de marchandises',
      },
      {
        id: '1-3',
        accountId: '44571',
        debit: 200,
        credit: 0,
        description: 'TVA collectée',
      },
    ],
    isLocked: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    journalId: '2',
    date: new Date('2024-01-20'),
    reference: 'FAC-2024-002',
    description: 'Facture fournisseur ABC',
    lines: [
      {
        id: '2-1',
        accountId: '401',
        debit: 600,
        credit: 0,
        description: 'Fournisseur ABC',
      },
      {
        id: '2-2',
        accountId: '607',
        debit: 0,
        credit: 500,
        description: 'Achat de marchandises',
      },
      {
        id: '2-3',
        accountId: '44566',
        debit: 0,
        credit: 100,
        description: 'TVA déductible',
      },
    ],
    isLocked: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
]; 