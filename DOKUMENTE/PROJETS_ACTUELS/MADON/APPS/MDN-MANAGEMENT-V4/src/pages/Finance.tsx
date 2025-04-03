import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Calendar,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  Loader2
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../contexts/AuthContext';
import { TransactionDialog } from '../components/finance/TransactionDialog';
import { AccountDialog } from '../components/finance/AccountDialog';
import { CategoryDialog } from '../components/finance/CategoryDialog';
import type { Account, Category, Transaction } from '../lib/database.types';

export function Finance() {
  const { user } = useAuth();
  const {
    accounts,
    categories,
    transactions,
    isLoading,
    createTransaction,
    createAccount,
    createCategory
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: 'success', label: 'Complétée' },
      pending: { variant: 'warning', label: 'En attente' },
      failed: { variant: 'danger', label: 'Échouée' }
    } as const;

    const statusInfo = variants[status as keyof typeof variants];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleNewTransaction = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setIsTransactionDialogOpen(true);
  };

  const handleNewAccount = () => {
    setIsAccountDialogOpen(true);
  };

  const handleNewCategory = () => {
    setIsCategoryDialogOpen(true);
  };

  const handleCreateAccount = async (data: Omit<Account, 'id' | 'created_at'>) => {
    try {
      await createAccount.mutateAsync(data);
      setIsAccountDialogOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleCreateCategory = async (data: Omit<Category, 'id' | 'created_at'>) => {
    try {
      await createCategory.mutateAsync(data);
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleCreateTransaction = async (data: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      await createTransaction.mutateAsync(data);
      setIsTransactionDialogOpen(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    const matchesCategory = categoryFilter === 'all' || 
      transaction.category_id === categoryFilter;
    
    const matchesDate = !dateRange.start || !dateRange.end || (
      new Date(transaction.date) >= new Date(dateRange.start) &&
      new Date(transaction.date) <= new Date(dateRange.end)
    );

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;
  const totalIncome = transactions
    ?.filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpenses = transactions
    ?.filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const margin = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Finances</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos transactions et suivez vos performances financières
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleNewAccount}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau compte
          </Button>
          <Button variant="secondary" onClick={handleNewCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle catégorie
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleNewTransaction('income')}
          >
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Entrée
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleNewTransaction('expense')}
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Sortie
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Solde</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Revenus</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Dépenses</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Marge</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10"
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les types' },
                { value: 'income', label: 'Revenus' },
                { value: 'expense', label: 'Dépenses' }
              ]}
              className="w-40"
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Toutes catégories' },
                ...categories?.map(cat => ({
                  value: cat.id,
                  label: cat.name
                })) || []
              ]}
              className="w-40"
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-40"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-40"
              />
            </div>
          </div>
        </div>

        <Table
          headers={[
            'Date',
            'Description',
            'Catégorie',
            'Référence',
            'Montant',
            'Statut',
            'Actions'
          ]}
        >
          {filteredTransactions?.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {transaction.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.categories?.name || 'Non catégorisé'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.reference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(transaction.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm">
                    Détails
                  </Button>
                  <Button variant="secondary" size="sm">
                    Modifier
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <TransactionDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
        type={transactionType}
        onSubmit={handleCreateTransaction}
        accounts={accounts}
        categories={categories?.filter(c => c.type === transactionType)}
      />

      <AccountDialog
        isOpen={isAccountDialogOpen}
        onClose={() => setIsAccountDialogOpen(false)}
        onSubmit={handleCreateAccount}
      />

      <CategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}