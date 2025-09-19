"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Trash2, CheckCircle2, XCircle, AlertCircle, Clock, Download, Banknote, Wallet, CreditCard } from 'lucide-react';
import { format, isAfter, isBefore, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: 'XAF' | 'XOF' | 'EUR' | 'USD';
  paymentMethod: 'cash' | 'bank' | 'mobile' | 'card';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  dueDate: string;
  clientName: string;
  description: string;
  reference: string;
  attachments: string[];
}

// Données de test
const TEST_PAYMENTS: Payment[] = [
  {
    id: '1',
    invoiceId: 'INV-2024-001',
    amount: 1500000,
    currency: 'XAF',
    paymentMethod: 'bank',
    status: 'completed',
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    clientName: 'SARL Tech Solutions',
    description: 'Paiement facture services IT',
    reference: 'PAY-2024-001',
    attachments: ['facture.pdf', 'recu.pdf']
  },
  {
    id: '2',
    invoiceId: 'INV-2024-002',
    amount: 2500,
    currency: 'EUR',
    paymentMethod: 'card',
    status: 'pending',
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    clientName: 'Global Trading Ltd',
    description: 'Paiement partiel commande #1234',
    reference: 'PAY-2024-002',
    attachments: ['facture.pdf']
  },
  {
    id: '3',
    invoiceId: 'INV-2024-003',
    amount: 500000,
    currency: 'XAF',
    paymentMethod: 'mobile',
    status: 'failed',
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    clientName: 'Mobile Express',
    description: 'Paiement échoué - Solde insuffisant',
    reference: 'PAY-2024-003',
    attachments: []
  },
  {
    id: '4',
    invoiceId: 'INV-2024-004',
    amount: 10000,
    currency: 'USD',
    paymentMethod: 'bank',
    status: 'refunded',
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    clientName: 'International Corp',
    description: 'Remboursement double paiement',
    reference: 'PAY-2024-004',
    attachments: ['remboursement.pdf']
  }
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces', icon: Banknote },
  { value: 'bank', label: 'Virement bancaire', icon: Wallet },
  { value: 'mobile', label: 'Mobile Money', icon: Wallet },
  { value: 'card', label: 'Carte bancaire', icon: CreditCard }
];

export function Payments() {
  const toast = useToast();
  const [payments, setPayments] = useState<Payment[]>(TEST_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Payment['status'] | 'all'>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<Payment['currency'] | 'all'>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    amount: 0,
    currency: 'XAF',
    paymentMethod: 'cash',
    status: 'pending'
  });

  // Vérification des paiements en retard
  useEffect(() => {
    const checkOverduePayments = () => {
      const overduePayments = payments.filter(payment => 
        payment.status === 'pending' && 
        isAfter(new Date(), new Date(payment.dueDate))
      );

      if (overduePayments.length > 0) {
        toast.error(`Paiements en retard: ${overduePayments.length} paiement(s) en retard`);
      }
    };

    checkOverduePayments();
    const interval = setInterval(checkOverduePayments, 24 * 60 * 60 * 1000); // Vérifier toutes les 24h
    return () => clearInterval(interval);
  }, [payments, toast]);

  const handleAddPayment = () => {
    if (!newPayment.amount || !newPayment.currency) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount: Number(newPayment.amount),
      currency: newPayment.currency as Payment['currency'],
      paymentMethod: newPayment.paymentMethod as Payment['paymentMethod'],
      status: 'pending',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      clientName: newPayment.clientName || '',
      description: newPayment.description || '',
      reference: `PAY-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      attachments: []
    };

    setPayments([...payments, payment]);
    setNewPayment({
      amount: 0,
      currency: 'XAF',
      paymentMethod: 'cash',
      status: 'pending'
    });

    toast.success('Paiement ajouté avec succès');
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
    toast.success('Paiement supprimé avec succès');
  };

  const handleStatusChange = (id: string, status: Payment['status']) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status } : payment
    ));
    toast.success(`Statut du paiement mis à jour: ${status}`);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesCurrency = selectedCurrency === 'all' || payment.currency === selectedCurrency;
    
    const matchesDateRange = selectedDateRange === 'all' || 
      (selectedDateRange === 'today' && isBefore(new Date(payment.date), new Date())) ||
      (selectedDateRange === 'week' && isBefore(new Date(payment.date), subDays(new Date(), 7))) ||
      (selectedDateRange === 'month' && isBefore(new Date(payment.date), subDays(new Date(), 30)));

    return matchesSearch && matchesStatus && matchesCurrency && matchesDateRange;
  });

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusLabel = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      case 'refunded':
        return 'Remboursé';
    }
  };

  const getCurrencySymbol = (currency: Payment['currency']) => {
    const symbols: Record<Payment['currency'], string> = {
      'XAF': 'FCFA',
      'XOF': 'FCFA',
      'EUR': '€',
      'USD': '$'
    };
    return symbols[currency];
  };

  // Calcul des statistiques
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'completed');
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending');
  const failedPayments = filteredPayments.filter(p => p.status === 'failed');

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmount.toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency as Payment['currency'])}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Paiements Terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedPayments.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Paiements En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingPayments.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Paiements Échoués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {failedPayments.length}
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
          <div className="grid grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un paiement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedStatus}
              onValueChange={(value: Payment['status'] | 'all') => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
                <SelectItem value="refunded">Remboursé</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedCurrency}
              onValueChange={(value: Payment['currency'] | 'all') => setSelectedCurrency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les devises</SelectItem>
                <SelectItem value="XAF">Franc CFA (BEAC)</SelectItem>
                <SelectItem value="XOF">Franc CFA (BCEAO)</SelectItem>
                <SelectItem value="EUR">Euro</SelectItem>
                <SelectItem value="USD">Dollar Américain</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedDateRange}
              onValueChange={(value: 'today' | 'week' | 'month' | 'all') => setSelectedDateRange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Paiement
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Paiement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Montant"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
              />
              <Select
                value={newPayment.currency}
                onValueChange={(value: Payment['currency']) => setNewPayment({ ...newPayment, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XAF">Franc CFA (BEAC)</SelectItem>
                  <SelectItem value="XOF">Franc CFA (BCEAO)</SelectItem>
                  <SelectItem value="EUR">Euro</SelectItem>
                  <SelectItem value="USD">Dollar Américain</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newPayment.paymentMethod}
                onValueChange={(value: Payment['paymentMethod']) => setNewPayment({ ...newPayment, paymentMethod: value })}
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
                placeholder="Nom du client"
                value={newPayment.clientName}
                onChange={(e) => setNewPayment({ ...newPayment, clientName: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                className="col-span-2"
              />
            </div>
            <Button onClick={handleAddPayment}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter le paiement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Liste des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{format(new Date(payment.date), 'PPP', { locale: fr })}</TableCell>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>{payment.invoiceId}</TableCell>
                  <TableCell>{payment.clientName}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>
                    {payment.amount.toLocaleString('fr-FR')} {getCurrencySymbol(payment.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const method = PAYMENT_METHODS.find(m => m.value === payment.paymentMethod);
                        return method?.icon ? <method.icon className="h-4 w-4" /> : null;
                      })()}
                      {PAYMENT_METHODS.find(m => m.value === payment.paymentMethod)?.label}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      {getStatusLabel(payment.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Select
                        value={payment.status}
                        onValueChange={(value: Payment['status']) => handleStatusChange(payment.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="failed">Échoué</SelectItem>
                          <SelectItem value="refunded">Remboursé</SelectItem>
                        </SelectContent>
                      </Select>
                      {payment.attachments.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            toast.success('Téléchargement des pièces jointes...');
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
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