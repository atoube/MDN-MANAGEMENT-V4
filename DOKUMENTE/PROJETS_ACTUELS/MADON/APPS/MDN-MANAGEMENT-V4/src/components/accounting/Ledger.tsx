"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export function LedgerComponent() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grand Livre</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Rechercher un compte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Journal</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Débit</TableHead>
              <TableHead>Crédit</TableHead>
              <TableHead>Solde</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2024-01-15</TableCell>
              <TableCell>VE</TableCell>
              <TableCell>FAC-2024-001</TableCell>
              <TableCell>Facture client XYZ</TableCell>
              <TableCell>0.00</TableCell>
              <TableCell>1200.00</TableCell>
              <TableCell>-1200.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 