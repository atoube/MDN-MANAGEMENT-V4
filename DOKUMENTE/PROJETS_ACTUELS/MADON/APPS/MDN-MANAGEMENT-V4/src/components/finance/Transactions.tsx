"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash2, ArrowUpRight, ArrowDownLeft, CreditCard, Wallet, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency: 'XAF' | 'XOF' | 'EUR' | 'USD';
  description: string;
  paymentMethod: 'cash' | 'bank' | 'mobile' | 'card';
  status: 'completed' | 'pending' | 'cancelled';
}

const CATEGORIES = {
  income: [
    { value: 'sales', label: 'Ventes' },
    { value: 'services', label: 'Services' },
    { value: 'investments', label: 'Investissements' },
    { value: 'other', label: 'Autres revenus' }
  ],
  expense: [
    { value: 'supplies', label: 'Fournitures' },
    { value: 'salaries', label: 'Salaires' },
    { value: 'rent', label: 'Loyer' },
    { value: 'utilities', label: 'Services publics' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Autres dépenses' }
  ]
};

const CURRENCIES = [
  { code: 'XAF', symbol: 'FCFA', name: 'Franc CFA (BEAC)' },
  { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA (BCEAO)' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar Américain' }
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces', icon: Banknote },
  { value: 'bank', label: 'Virement bancaire', icon: Wallet },
  { value: 'mobile', label: 'Mobile Money', icon: Wallet },
  { value: 'card', label: 'Carte bancaire', icon: CreditCard }
];

// Données de test
const TEST_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    type: 'income',
    category: 'sales',
    amount: 1500000,
    currency: 'XAF',
    description: 'Vente de produits électroniques',
    paymentMethod: 'bank',
    status: 'completed'
  },
  {
    id: '2',
    date: new Date().toISOString(),
    type: 'expense',
    category: 'supplies',
    amount: 500000,
    currency: 'XAF',
    description: 'Achat de matériel de bureau',
    paymentMethod: 'card',
    status: 'completed'
  },
  {
    id: '3',
    date: new Date().toISOString(),
    type: 'income',
    category: 'services',
    amount: 2500,
    currency: 'EUR',
    description: 'Consultation en développement web',
    paymentMethod: 'bank',
    status: 'pending'
  },
  {
    id: '4',
    date: new Date().toISOString(),
    type: 'expense',
    category: 'salaries',
    amount: 2000000,
    currency: 'XAF',
    description: 'Paiement des salaires du mois',
    paymentMethod: 'bank',
    status: 'completed'
  },
  {
    id: '5',
    date: new Date().toISOString(),
    type: 'income',
    category: 'investments',
    amount: 10000,
    currency: 'USD',
    description: 'Retour sur investissement',
    paymentMethod: 'bank',
    status: 'completed'
  }
];

export function Transactions() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(TEST_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | Transaction['type']>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<Transaction['currency'] | 'all'>('all');
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    category: '',
    amount: 0,
    currency: 'XAF',
    description: '',
    paymentMethod: 'cash',
    status: 'pending'
  });

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: newTransaction.type || 'income',
      category: newTransaction.category,
      amount: Number(newTransaction.amount),
      currency: newTransaction.currency || 'XAF',
      description: newTransaction.description || '',
      paymentMethod: newTransaction.paymentMethod || 'cash',
      status: 'pending'
    };

    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: 'income',
      category: '',
      amount: 0,
      currency: 'XAF',
      description: '',
      paymentMethod: 'cash',
      status: 'pending'
    });

    toast({
      title: 'Succès',
      description: 'Transaction ajoutée avec succès'
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    toast({
      title: 'Succès',
      description: 'Transaction supprimée avec succès'
    });
  };

  const handleStatusChange = (id: string, status: Transaction['status']) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id ? { ...transaction, status } : transaction
    ));
    toast({
      title: 'Succès',
      description: `Statut de la transaction mis à jour: ${status}`
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesCurrency = selectedCurrency === 'all' || transaction.currency === selectedCurrency;
    return matchesSearch && matchesType && matchesCurrency;
  });

  const getCurrencySymbol = (currency: Transaction['currency']) => {
    return CURRENCIES.find(c => c.code === currency)?.symbol || '';
  };

  const getCategoryLabel = (type: Transaction['type'], category: string) => {
    const categories = CATEGORIES[type];
    return categories.find(c => c.value === category)?.label || category;
  };

  const getPaymentMethodIcon = (method: Transaction['paymentMethod']) => {
    const Icon = PAYMENT_METHODS.find(m => m.value === method)?.icon || Banknote;
    return <Icon className="h-4 w-4" />;
  };

  // Calcul des statistiques
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalIncome.toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalExpenses.toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Solde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedType}
              onValueChange={(value: 'all' | Transaction['type']) => setSelectedType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="income">Revenus</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedCurrency}
              onValueChange={(value: Transaction['currency'] | 'all') => setSelectedCurrency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les devises</SelectItem>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.name} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création */}
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={newTransaction.type}
              onValueChange={(value: Transaction['type']) => setNewTransaction({ ...newTransaction, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Revenu</SelectItem>
                <SelectItem value="expense">Dépense</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newTransaction.category}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES[newTransaction.type || 'income'].map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Montant"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
            />
            <Select
              value={newTransaction.currency}
              onValueChange={(value: Transaction['currency']) => setNewTransaction({ ...newTransaction, currency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.name} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newTransaction.paymentMethod}
              onValueChange={(value: Transaction['paymentMethod']) => setNewTransaction({ ...newTransaction, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Méthode de paiement" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="col-span-2"
            />
            <Button onClick={handleAddTransaction} className="col-span-2">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter la transaction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), 'PPP', { locale: fr })}</TableCell>
                  <TableCell>
                    {transaction.type === 'income' ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{getCategoryLabel(transaction.type, transaction.category)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.amount.toLocaleString('fr-FR')} {getCurrencySymbol(transaction.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      {PAYMENT_METHODS.find(m => m.value === transaction.paymentMethod)?.label}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Terminé' :
                       transaction.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Select
                        value={transaction.status}
                        onValueChange={(value: Transaction['status']) => handleStatusChange(transaction.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 