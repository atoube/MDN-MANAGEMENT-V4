"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface TaxDeclaration {
  id: string;
  type: 'vat' | 'income' | 'other';
  period: string;
  amount: number;
  status: 'draft' | 'validated' | 'submitted';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

const TEST_DECLARATIONS: TaxDeclaration[] = [
  {
    id: "1",
    type: "vat",
    period: "2024-01",
    amount: 15000,
    status: "validated",
    dueDate: "2024-02-15",
    createdAt: "2024-01-31",
    updatedAt: "2024-02-01"
  },
  {
    id: "2",
    type: "income",
    period: "2023",
    amount: 50000,
    status: "draft",
    dueDate: "2024-03-31",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }
];

export function TaxDeclarations() {
  const [declarations, setDeclarations] = useState<TaxDeclaration[]>(TEST_DECLARATIONS);
  const [newDeclaration, setNewDeclaration] = useState<Partial<TaxDeclaration>>({
    type: "vat",
    period: "",
    amount: 0,
    status: "draft",
    dueDate: ""
  });

  const handleAddDeclaration = () => {
    if (!newDeclaration.period || !newDeclaration.amount || !newDeclaration.dueDate) {
      return;
    }

    const declaration: TaxDeclaration = {
      id: (declarations.length + 1).toString(),
      type: newDeclaration.type || "vat",
      period: newDeclaration.period,
      amount: newDeclaration.amount,
      status: "draft",
      dueDate: newDeclaration.dueDate,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0]
    };

    setDeclarations([...declarations, declaration]);
    setNewDeclaration({
      type: "vat",
      period: "",
      amount: 0,
      status: "draft",
      dueDate: ""
    });
  };

  const handleStatusChange = (id: string, status: TaxDeclaration['status']) => {
    setDeclarations(declarations.map(declaration =>
      declaration.id === id
        ? { ...declaration, status, updatedAt: new Date().toISOString().split("T")[0] }
        : declaration
    ));
  };

  const getStatusBadge = (status: TaxDeclaration['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'validated':
        return <Badge variant="default">Validé</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Soumis</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Déclarations Fiscales</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nouvelle Déclaration</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle Déclaration Fiscale</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="type">Type de déclaration</label>
                <Select
                  value={newDeclaration.type}
                  onValueChange={(value) => setNewDeclaration({ ...newDeclaration, type: value as TaxDeclaration['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vat">TVA</SelectItem>
                    <SelectItem value="income">Impôt sur le revenu</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="period">Période</label>
                <Input
                  id="period"
                  placeholder="YYYY-MM"
                  value={newDeclaration.period}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, period: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="amount">Montant</label>
                <Input
                  id="amount"
                  type="number"
                  value={newDeclaration.amount}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, amount: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="dueDate">Date d'échéance</label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDeclaration.dueDate}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, dueDate: e.target.value })}
                />
              </div>
              <Button onClick={handleAddDeclaration}>Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {declarations.map((declaration) => (
              <TableRow key={declaration.id}>
                <TableCell>
                  {declaration.type === 'vat' ? 'TVA' : 
                   declaration.type === 'income' ? 'Impôt sur le revenu' : 'Autre'}
                </TableCell>
                <TableCell>{declaration.period}</TableCell>
                <TableCell>{declaration.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                <TableCell>{getStatusBadge(declaration.status)}</TableCell>
                <TableCell>{declaration.dueDate}</TableCell>
                <TableCell>
                  {declaration.status === 'draft' && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(declaration.id, 'validated')}>
                      Valider
                    </Button>
                  )}
                  {declaration.status === 'validated' && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(declaration.id, 'submitted')}>
                      Soumettre
                    </Button>
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