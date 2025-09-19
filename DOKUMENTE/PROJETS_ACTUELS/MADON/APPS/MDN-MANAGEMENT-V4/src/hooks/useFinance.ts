import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import type { Account, Category, Transaction } from '../lib/database.types';

export function useFinance() {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      // Mock data pour les comptes en F.CFA
      const data = [
        { id: '1', name: 'Compte Principal BICEC', balance: 25000000, type: 'checking' }, // 25M F.CFA
        { id: '2', name: 'Épargne BICEC', balance: 75000000, type: 'savings' },           // 75M F.CFA
        { id: '3', name: 'Compte Projet Afriland', balance: 15000000, type: 'checking' }, // 15M F.CFA
        { id: '4', name: 'Fonds d\'Urgence', balance: 10000000, type: 'savings' }         // 10M F.CFA
      ];
      
      return data as Account[];
    }
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Mock data pour les catégories adaptées au contexte camerounais
      const data = [
        { id: '1', name: 'Salaires et Rémunérations', type: 'income' },
        { id: '2', name: 'Ventes et Services', type: 'income' },
        { id: '3', name: 'Investissements', type: 'income' },
        { id: '4', name: 'Salaires Employés', type: 'expense' },
        { id: '5', name: 'Fournitures Bureau', type: 'expense' },
        { id: '6', name: 'Transport et Logistique', type: 'expense' },
        { id: '7', name: 'Marketing et Publicité', type: 'expense' },
        { id: '8', name: 'Maintenance Équipements', type: 'expense' },
        { id: '9', name: 'Impôts et Taxes', type: 'expense' },
        { id: '10', name: 'Électricité et Internet', type: 'expense' }
      ];
      
      return data as Category[];
    },
    staleTime: 0, // Force refresh on every mount
    cacheTime: 0  // Don't cache the data
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      // Mock data pour les transactions en F.CFA
      const data = [
        {
          id: '1',
          amount: 2500000,
          description: 'Paiement projet Digitalisation Banque Atlantique',
          type: 'income',
          category_id: '2',
          account_id: '1',
          date: '2024-03-01',
          categories: { name: 'Ventes et Services' },
          accounts: { name: 'Compte Principal BICEC' }
        },
        {
          id: '2',
          amount: -850000,
          description: 'Salaires équipe développement',
          type: 'expense',
          category_id: '4',
          account_id: '1',
          date: '2024-03-01',
          categories: { name: 'Salaires Employés' },
          accounts: { name: 'Compte Principal BICEC' }
        },
        {
          id: '3',
          amount: 1800000,
          description: 'Contrat maintenance Cimencam',
          type: 'income',
          category_id: '2',
          account_id: '3',
          date: '2024-02-28',
          categories: { name: 'Ventes et Services' },
          accounts: { name: 'Compte Projet Afriland' }
        },
        {
          id: '4',
          amount: -250000,
          description: 'Achat équipements informatiques',
          type: 'expense',
          category_id: '8',
          account_id: '1',
          date: '2024-02-27',
          categories: { name: 'Maintenance Équipements' },
          accounts: { name: 'Compte Principal BICEC' }
        },
        {
          id: '5',
          amount: -120000,
          description: 'Facture électricité Eneo',
          type: 'expense',
          category_id: '10',
          account_id: '1',
          date: '2024-02-26',
          categories: { name: 'Électricité et Internet' },
          accounts: { name: 'Compte Principal BICEC' }
        },
        {
          id: '6',
          amount: 3200000,
          description: 'Vente système gestion Socapalm',
          type: 'income',
          category_id: '2',
          account_id: '3',
          date: '2024-02-25',
          categories: { name: 'Ventes et Services' },
          accounts: { name: 'Compte Projet Afriland' }
        }
      ];
      
      return data as (Transaction & {
        categories: { name: string };
        accounts: { name: string };
      })[];
    }
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
      const { data, error } = await         // Mock insert operationtransaction)
        .select()
        .single();
      
      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...transaction }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await         // Mock update operationtransaction)
// Mock eq call
        .select()
        .single();
      
      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  const createAccount = useMutation({
    mutationFn: async (account: Omit<Account, 'id' | 'created_at'>) => {
      const { data, error } = await         // Mock insert operationaccount)
        .select()
        .single();
      
      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  const createCategory = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at'>) => {
      const { data, error } = await         // Mock insert operationcategory)
        .select()
        .single();
      
      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  return {
    accounts,
    categories,
    transactions,
    isLoading: isLoadingAccounts || isLoadingCategories || isLoadingTransactions,
    createTransaction,
    updateTransaction,
    createAccount,
    createCategory
  };
}