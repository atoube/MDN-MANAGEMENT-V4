"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Balance } from '@/types/accounting';

const TEST_BALANCE: Balance[] = [
  {
    accountId: '401',
    debit: 0,
    credit: 5000,
    balance: -5000,
  },
  {
    accountId: '411',
    debit: 8000,
    credit: 0,
    balance: 8000,
  },
  {
    accountId: '512',
    debit: 15000,
    credit: 10000,
    balance: 5000,
  },
  {
    accountId: '707',
    debit: 0,
    credit: 20000,
    balance: -20000,
  },
  {
    accountId: '44571',
    debit: 4000,
    credit: 0,
    balance: 4000,
  },
];

export function BalanceComponent() {
  const [balance, setBalance] = useState<Balance[]>(TEST_BALANCE);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBalance = balance.filter(item => 
    item.accountId.includes(searchTerm)
  );

  const calculateTotalDebit = () => {
    return balance.reduce((sum, item) => sum + item.debit, 0);
  };

  const calculateTotalCredit = () => {
    return balance.reduce((sum, item) => sum + item.credit, 0);
  };

  const calculateTotalBalance = () => {
    return balance.reduce((sum, item) => sum + item.balance, 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Balance Générale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher un compte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Compte</TableHead>
                <TableHead>Débit</TableHead>
                <TableHead>Crédit</TableHead>
                <TableHead>Solde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBalance.map((item) => (
                <TableRow key={item.accountId}>
                  <TableCell>{item.accountId}</TableCell>
                  <TableCell>{item.debit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{item.credit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className={item.balance < 0 ? 'text-red-600' : 'text-green-600'}>
                    {item.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>{calculateTotalDebit().toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{calculateTotalCredit().toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className={calculateTotalBalance() < 0 ? 'text-red-600' : 'text-green-600'}>
                  {calculateTotalBalance().toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 