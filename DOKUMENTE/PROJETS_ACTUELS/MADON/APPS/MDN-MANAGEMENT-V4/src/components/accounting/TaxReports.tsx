"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface TaxReport {
  id: string;
  type: 'vat' | 'income' | 'other';
  period: string;
  totalDeclarations: number;
  totalAmount: number;
  totalPayments: number;
  status: 'draft' | 'final';
  createdAt: string;
  updatedAt: string;
}

const TEST_REPORTS: TaxReport[] = [
  {
    id: "1",
    type: "vat",
    period: "2024-01",
    totalDeclarations: 2,
    totalAmount: 30000,
    totalPayments: 15000,
    status: "final",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01"
  },
  {
    id: "2",
    type: "income",
    period: "2023",
    totalDeclarations: 1,
    totalAmount: 50000,
    totalPayments: 0,
    status: "draft",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }
];

export function TaxReports() {
  const [reports] = useState<TaxReport[]>(TEST_REPORTS);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("");

  const filteredReports = reports.filter(report => {
    const typeMatch = filterType === "all" || report.type === filterType;
    const periodMatch = !filterPeriod || report.period.includes(filterPeriod);
    return typeMatch && periodMatch;
  });

  const getTypeLabel = (type: TaxReport['type']) => {
    switch (type) {
      case 'vat':
        return 'TVA';
      case 'income':
        return 'Impôt sur le revenu';
      case 'other':
        return 'Autre';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: TaxReport['status']) => {
    return status === 'draft' ? 'Brouillon' : 'Final';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapports Fiscaux</CardTitle>
        <div className="flex items-center space-x-4 mt-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de rapport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="vat">TVA</SelectItem>
              <SelectItem value="income">Impôt sur le revenu</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Filtrer par période (YYYY-MM)"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="max-w-[200px]"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Déclarations</TableHead>
              <TableHead>Montant Total</TableHead>
              <TableHead>Paiements</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{getTypeLabel(report.type)}</TableCell>
                <TableCell>{report.period}</TableCell>
                <TableCell>{report.totalDeclarations}</TableCell>
                <TableCell>{report.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' })}</TableCell>
                <TableCell>{report.totalPayments.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' })}</TableCell>
                <TableCell>{getStatusLabel(report.status)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Exporter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 