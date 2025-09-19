"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash2, FileText, Download, Send, CheckCircle2, AlertCircle, Filter, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Invoice {
  id: string;
  date: string;
  client: string;
  amount: number;
  currency: 'XAF' | 'XOF' | 'EUR' | 'USD';
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  description?: string;
  dueDate?: string;
  paymentDate?: string;
  paymentMethod?: 'cash' | 'bank' | 'mobile' | 'other';
}

const CURRENCIES = [
  { code: 'XAF', symbol: 'FCFA', name: 'Franc CFA (BEAC)' },
  { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA (BCEAO)' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar Américain' }
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces' },
  { value: 'bank', label: 'Virement bancaire' },
  { value: 'mobile', label: 'Mobile Money' },
  { value: 'other', label: 'Autre' }
];

// Données de test
const TEST_INVOICES: Invoice[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    client: 'SARL Tech Solutions',
    amount: 1500000,
    currency: 'XAF',
    status: 'paid',
    description: 'Développement de site web',
    dueDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    paymentDate: format(addDays(new Date(), -3), 'yyyy-MM-dd'),
    paymentMethod: 'bank'
  },
  {
    id: '2',
    date: new Date().toISOString(),
    client: 'Restaurant Le Gourmet',
    amount: 750000,
    currency: 'XAF',
    status: 'sent',
    description: 'Maintenance mensuelle',
    dueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd')
  },
  {
    id: '3',
    date: new Date().toISOString(),
    client: 'Hotel Continental',
    amount: 2500,
    currency: 'EUR',
    status: 'overdue',
    description: 'Services de nettoyage',
    dueDate: format(addDays(new Date(), -10), 'yyyy-MM-dd')
  },
  {
    id: '4',
    date: new Date().toISOString(),
    client: 'International Trading Co',
    amount: 5000,
    currency: 'USD',
    status: 'draft',
    description: 'Consultation en commerce international',
    dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd')
  }
];

export function Invoices() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(TEST_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Invoice['currency'] | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    client: '',
    amount: 0,
    currency: 'XAF',
    status: 'draft',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'cash'
  });
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Vérification des factures en retard
  useEffect(() => {
    const checkOverdueInvoices = () => {
      const today = new Date();
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => {
          if (invoice.status !== 'paid' && invoice.dueDate) {
            const dueDate = new Date(invoice.dueDate);
            if (dueDate < today && invoice.status !== 'overdue') {
              toast({
                title: 'Facture en retard',
                description: `La facture de ${invoice.client} est en retard`,
                variant: 'destructive'
              });
              return { ...invoice, status: 'overdue' };
            }
          }
          return invoice;
        })
      );
    };

    checkOverdueInvoices();
    const interval = setInterval(checkOverdueInvoices, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleAddInvoice = () => {
    if (!newInvoice.client || !newInvoice.amount) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      client: newInvoice.client,
      amount: Number(newInvoice.amount),
      currency: newInvoice.currency || 'XAF',
      status: 'draft',
      description: newInvoice.description,
      dueDate: newInvoice.dueDate,
      paymentMethod: newInvoice.paymentMethod
    };

    setInvoices([...invoices, invoice]);
    setNewInvoice({
      client: '',
      amount: 0,
      currency: 'XAF',
      status: 'draft',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'cash'
    });

    toast({
      title: 'Succès',
      description: 'Facture créée avec succès'
    });
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleUpdateInvoice = () => {
    if (!editingInvoice) return;

    setInvoices(invoices.map(inv => 
      inv.id === editingInvoice.id ? editingInvoice : inv
    ));

    setEditingInvoice(null);
    setIsDialogOpen(false);

    toast({
      title: 'Succès',
      description: 'Facture mise à jour avec succès'
    });
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast({
      title: 'Succès',
      description: 'Facture supprimée avec succès'
    });
  };

  const handleStatusChange = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status } : invoice
    ));
    toast({
      title: 'Succès',
      description: `Statut de la facture mis à jour: ${status}`
    });
  };

  const handleExportPDF = () => {
    // TODO: Implémenter l'export PDF
    toast({
      title: 'Information',
      description: 'Export PDF en cours de développement'
    });
  };

  const handlePayment = (id: string, paymentMethod: Invoice['paymentMethod']) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { 
        ...invoice, 
        status: 'paid',
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod 
      } : invoice
    ));
    toast({
      title: 'Succès',
      description: 'Paiement enregistré avec succès'
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrency = selectedCurrency === 'all' || invoice.currency === selectedCurrency;
    const matchesDateRange = (!dateRange.start || isAfter(parseISO(invoice.date), parseISO(dateRange.start))) &&
                           (!dateRange.end || isBefore(parseISO(invoice.date), parseISO(dateRange.end)));
    return matchesSearch && matchesCurrency && matchesDateRange;
  });

  const getCurrencySymbol = (currency: Invoice['currency']) => {
    return CURRENCIES.find(c => c.code === currency)?.symbol || '';
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calcul des statistiques
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = filteredInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredInvoices.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmount.toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Montant Payé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {paidAmount.toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Montant En Retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueAmount.toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
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
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedCurrency}
              onValueChange={(value: Invoice['currency'] | 'all') => setSelectedCurrency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une devise" />
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
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Date de début"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Date de fin"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création */}
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Facture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Nom du client"
              value={newInvoice.client}
              onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Montant"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
            />
            <Select
              value={newInvoice.currency}
              onValueChange={(value: Invoice['currency']) => setNewInvoice({ ...newInvoice, currency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une devise" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.name} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newInvoice.dueDate}
              onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
            />
            <Select
              value={newInvoice.paymentMethod}
              onValueChange={(value: Invoice['paymentMethod']) => setNewInvoice({ ...newInvoice, paymentMethod: value })}
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
              placeholder="Description (optionnelle)"
              value={newInvoice.description}
              onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
              className="col-span-2"
            />
            <Button onClick={handleAddInvoice} className="col-span-2">
              <Plus className="mr-2 h-4 w-4" />
              Créer la facture
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Devise</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{format(new Date(invoice.date), 'PPP', { locale: fr })}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>
                    {invoice.amount.toLocaleString('fr-FR')} {getCurrencySymbol(invoice.currency)}
                  </TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell>
                    {invoice.dueDate ? format(new Date(invoice.dueDate), 'PPP', { locale: fr }) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Payée' :
                         invoice.status === 'overdue' ? 'En retard' :
                         invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleExportPDF}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status !== 'paid' && (
                        <Select
                          value={invoice.status}
                          onValueChange={(value: Invoice['status']) => handleStatusChange(invoice.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Brouillon</SelectItem>
                            <SelectItem value="sent">Envoyée</SelectItem>
                            <SelectItem value="paid">Payée</SelectItem>
                            <SelectItem value="overdue">En retard</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {invoice.status === 'sent' && (
                        <Select
                          value={invoice.paymentMethod}
                          onValueChange={(value: Invoice['paymentMethod']) => handlePayment(invoice.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Payer" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_METHODS.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Boîte de dialogue d'édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la facture</DialogTitle>
          </DialogHeader>
          {editingInvoice && (
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Nom du client"
                value={editingInvoice.client}
                onChange={(e) => setEditingInvoice({ ...editingInvoice, client: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Montant"
                value={editingInvoice.amount}
                onChange={(e) => setEditingInvoice({ ...editingInvoice, amount: Number(e.target.value) })}
              />
              <Select
                value={editingInvoice.currency}
                onValueChange={(value: Invoice['currency']) => setEditingInvoice({ ...editingInvoice, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={editingInvoice.dueDate}
                onChange={(e) => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })}
              />
              <Select
                value={editingInvoice.paymentMethod}
                onValueChange={(value: Invoice['paymentMethod']) => setEditingInvoice({ ...editingInvoice, paymentMethod: value })}
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
                placeholder="Description (optionnelle)"
                value={editingInvoice.description}
                onChange={(e) => setEditingInvoice({ ...editingInvoice, description: e.target.value })}
              />
              <Button onClick={handleUpdateInvoice}>
                Enregistrer les modifications
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 