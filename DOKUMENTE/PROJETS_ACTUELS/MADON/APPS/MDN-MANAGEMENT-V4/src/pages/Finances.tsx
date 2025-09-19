"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/components/ui/useToast';
import { apiService } from '@/lib/api';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  clientId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
}

export default function Finances() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments] = useState<Payment[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString(),
    type: 'income',
    amount: 0,
    description: '',
    category: ''
  });
  const [newInvoice, setNewInvoice] = useState({
    number: '',
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    clientId: '',
    amount: 0,
    status: 'draft',
    items: [] as InvoiceItem[]
  });

  const handleAddTransaction = async () => {
    try {
      const { error } = await         // Mock insert operation[newTransaction]);

      // Removed error check - using mock data

      setTransactions([...transactions, { ...newTransaction, id: Date.now().toString() }]);
      setNewTransaction({
        date: new Date().toISOString(),
        type: 'income',
        amount: 0,
        description: '',
        category: ''
      });

      toast({
        title: 'Succès',
        description: 'La transaction a été ajoutée avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la transaction',
      });
    }
  };

  const handleAddInvoice = async () => {
    try {
      const { error } = await         // Mock insert operation[newInvoice]);

      // Removed error check - using mock data

      setInvoices([...invoices, { ...newInvoice, id: Date.now().toString() }]);
      setNewInvoice({
        number: '',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        clientId: '',
        amount: 0,
        status: 'draft',
        items: []
      });

      toast({
        title: 'Succès',
        description: 'La facture a été créée avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la facture',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module Finances</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newTransaction.type}
                  onValueChange={(value: 'income' | 'expense') =>
                    setNewTransaction({ ...newTransaction, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de transaction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Entrée</SelectItem>
                    <SelectItem value="expense">Sortie</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Montant"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })
                  }
                />

                <Input
                  placeholder="Description"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, description: e.target.value })
                  }
                />

                <Select
                  value={newTransaction.category}
                  onValueChange={(value) =>
                    setNewTransaction({ ...newTransaction, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vente">Vente</SelectItem>
                    <SelectItem value="achat">Achat</SelectItem>
                    <SelectItem value="salaire">Salaire</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-4" onClick={handleAddTransaction}>
                Ajouter la transaction
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), 'PPP', { locale: fr })}</TableCell>
                      <TableCell>{transaction.type === 'income' ? 'Entrée' : 'Sortie'}</TableCell>
                      <TableCell>{transaction.amount} €</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Facture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Numéro de facture"
                  value={newInvoice.number}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, number: e.target.value })
                  }
                />

                <Input
                  type="date"
                  value={newInvoice.date.split('T')[0]}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, date: new Date(e.target.value).toISOString() })
                  }
                />

                <Input
                  type="date"
                  value={newInvoice.dueDate.split('T')[0]}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, dueDate: new Date(e.target.value).toISOString() })
                  }
                />

                <Input
                  placeholder="ID Client"
                  value={newInvoice.clientId}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, clientId: e.target.value })
                  }
                />

                <Input
                  type="number"
                  placeholder="Montant"
                  value={newInvoice.amount}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) })
                  }
                />
              </div>
              <Button className="mt-4" onClick={handleAddInvoice}>
                Créer la facture
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Factures</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.number}</TableCell>
                      <TableCell>{format(new Date(invoice.date), 'PPP', { locale: fr })}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'PPP', { locale: fr })}</TableCell>
                      <TableCell>{invoice.clientId}</TableCell>
                      <TableCell>{invoice.amount} €</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {invoice.status === 'draft'
                            ? 'Brouillon'
                            : invoice.status === 'sent'
                            ? 'Envoyée'
                            : invoice.status === 'paid'
                            ? 'Payée'
                            : 'En retard'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Suivi des Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facture</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>{format(new Date(payment.date), 'PPP', { locale: fr })}</TableCell>
                      <TableCell>{payment.amount} €</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status === 'pending'
                            ? 'En attente'
                            : payment.status === 'completed'
                            ? 'Complété'
                            : 'Échoué'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bilan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Actifs</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {transactions
                        .filter((t) => t.type === 'income')
                        .reduce((sum, t) => sum + t.amount, 0)}{' '}
                      €
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Passifs</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {transactions
                        .filter((t) => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0)}{' '}
                      €
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compte de Résultat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Chiffre d'affaires</h3>
                    <p className="text-2xl font-bold">
                      {invoices
                        .filter((i) => i.status === 'paid')
                        .reduce((sum, i) => sum + i.amount, 0)}{' '}
                      €
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Dépenses</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {transactions
                        .filter((t) => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0)}{' '}
                      €
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>État des Paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Factures payées</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {invoices.filter((i) => i.status === 'paid').length}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Factures en retard</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {invoices.filter((i) => i.status === 'overdue').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 