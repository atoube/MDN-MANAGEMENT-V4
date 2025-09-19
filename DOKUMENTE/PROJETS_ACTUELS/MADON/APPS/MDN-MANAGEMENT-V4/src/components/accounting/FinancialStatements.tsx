"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { FinancialStatement } from '@/types/accounting';

const TEST_STATEMENT: FinancialStatement = {
  assets: [
    { accountId: '411', debit: 8000, credit: 0, balance: 8000 },
    { accountId: '512', debit: 15000, credit: 10000, balance: 5000 },
  ],
  liabilities: [
    { accountId: '401', debit: 0, credit: 5000, balance: -5000 },
    { accountId: '44571', debit: 0, credit: 2000, balance: -2000 },
  ],
  income: [
    { accountId: '707', debit: 0, credit: 20000, balance: -20000 },
  ],
  expenses: [
    { accountId: '607', debit: 12000, credit: 0, balance: 12000 },
    { accountId: '622', debit: 2000, credit: 0, balance: 2000 },
  ],
  date: new Date(),
};

export function FinancialStatements() {
  const [activeTab, setActiveTab] = useState('balance-sheet');
  const [statement, setStatement] = useState<FinancialStatement>(TEST_STATEMENT);

  const calculateTotal = (items: { balance: number }[]) => {
    return items.reduce((sum, item) => sum + item.balance, 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>États Financiers</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="balance-sheet">Bilan</TabsTrigger>
              <TabsTrigger value="income-statement">Compte de Résultat</TabsTrigger>
            </TabsList>

            <TabsContent value="balance-sheet">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Actif</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Compte</TableHead>
                        <TableHead>Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statement.assets.map((item) => (
                        <TableRow key={item.accountId}>
                          <TableCell>{item.accountId}</TableCell>
                          <TableCell>{item.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total Actif</TableCell>
                        <TableCell>{calculateTotal(statement.assets).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Passif</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Compte</TableHead>
                        <TableHead>Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statement.liabilities.map((item) => (
                        <TableRow key={item.accountId}>
                          <TableCell>{item.accountId}</TableCell>
                          <TableCell>{Math.abs(item.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total Passif</TableCell>
                        <TableCell>{Math.abs(calculateTotal(statement.liabilities)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="income-statement">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Produits</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Compte</TableHead>
                        <TableHead>Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statement.income.map((item) => (
                        <TableRow key={item.accountId}>
                          <TableCell>{item.accountId}</TableCell>
                          <TableCell>{Math.abs(item.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total Produits</TableCell>
                        <TableCell>{Math.abs(calculateTotal(statement.income)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Charges</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Compte</TableHead>
                        <TableHead>Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statement.expenses.map((item) => (
                        <TableRow key={item.accountId}>
                          <TableCell>{item.accountId}</TableCell>
                          <TableCell>{item.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total Charges</TableCell>
                        <TableCell>{calculateTotal(statement.expenses).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Résultat</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Total Produits</p>
                    <p>{Math.abs(calculateTotal(statement.income)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
                  </div>
                  <div>
                    <p className="font-semibold">Total Charges</p>
                    <p>{calculateTotal(statement.expenses).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold">Résultat Net</p>
                  <p className={Math.abs(calculateTotal(statement.income)) - calculateTotal(statement.expenses) > 0 ? 'text-green-600' : 'text-red-600'}>
                    {(Math.abs(calculateTotal(statement.income)) - calculateTotal(statement.expenses)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 