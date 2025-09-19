"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";

interface TaxPayment {
  id: string;
  declarationId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'bank' | 'cash' | 'check';
  reference: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const TEST_PAYMENTS: TaxPayment[] = [
  {
    id: "1",
    declarationId: "1",
    amount: 15000,
    paymentDate: "2024-02-10",
    paymentMethod: "bank",
    reference: "PAY-2024-001",
    status: "completed",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10"
  },
  {
    id: "2",
    declarationId: "2",
    amount: 50000,
    paymentDate: "2024-03-25",
    paymentMethod: "bank",
    reference: "PAY-2024-002",
    status: "pending",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }
];

export function TaxPayments() {
  const [payments, setPayments] = useState<TaxPayment[]>(TEST_PAYMENTS);
  const [newPayment, setNewPayment] = useState<Partial<TaxPayment>>({
    declarationId: "",
    amount: 0,
    paymentDate: "",
    paymentMethod: "bank",
    reference: "",
    status: "pending"
  });

  const handleAddPayment = () => {
    if (!newPayment.declarationId || !newPayment.amount || !newPayment.paymentDate || !newPayment.reference) {
      return;
    }

    const payment: TaxPayment = {
      id: (payments.length + 1).toString(),
      declarationId: newPayment.declarationId,
      amount: newPayment.amount,
      paymentDate: newPayment.paymentDate,
      paymentMethod: newPayment.paymentMethod || "bank",
      reference: newPayment.reference,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0]
    };

    setPayments([...payments, payment]);
    setNewPayment({
      declarationId: "",
      amount: 0,
      paymentDate: "",
      paymentMethod: "bank",
      reference: "",
      status: "pending"
    });
  };

  const handleStatusChange = (id: string, status: TaxPayment['status']) => {
    setPayments(payments.map(payment =>
      payment.id === id
        ? { ...payment, status, updatedAt: new Date().toISOString().split("T")[0] }
        : payment
    ));
  };

  const getStatusBadge = (status: TaxPayment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'completed':
        return <Badge variant="default">Complété</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Annulé</Badge>;
      default:
        return null;
    }
  };

  const getPaymentMethodLabel = (method: TaxPayment['paymentMethod']) => {
    switch (method) {
      case 'bank':
        return 'Virement bancaire';
      case 'cash':
        return 'Espèces';
      case 'check':
        return 'Chèque';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Paiements Fiscaux</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nouveau Paiement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau Paiement Fiscal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="declarationId">ID de la déclaration</label>
                <Input
                  id="declarationId"
                  value={newPayment.declarationId}
                  onChange={(e) => setNewPayment({ ...newPayment, declarationId: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="amount">Montant</label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="paymentDate">Date de paiement</label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={newPayment.paymentDate}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="reference">Référence</label>
                <Input
                  id="reference"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                />
              </div>
              <Button onClick={handleAddPayment}>Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Déclaration</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.declarationId}</TableCell>
                <TableCell>{payment.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                <TableCell>{payment.paymentDate}</TableCell>
                <TableCell>{getPaymentMethodLabel(payment.paymentMethod)}</TableCell>
                <TableCell>{payment.reference}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>
                  {payment.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(payment.id, 'completed')}>
                        Valider
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(payment.id, 'cancelled')}>
                        Annuler
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 