"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ChartOfAccounts } from '@/components/accounting/ChartOfAccounts';
import { Journals } from '@/components/accounting/Journals';
import { Entries } from '@/components/accounting/Entries';
import { BalanceComponent } from '@/components/accounting/Balance';
import { LedgerComponent } from '@/components/accounting/Ledger';
import { FinancialStatements } from '@/components/accounting/FinancialStatements';
import { VAT } from '@/components/accounting/VAT';
import { FiscalYearComponent } from '@/components/accounting/FiscalYear';

export default function Accounting() {
  const [activeTab, setActiveTab] = useState('chart-of-accounts');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module Finances/Comptabilité</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chart-of-accounts">Plan Comptable</TabsTrigger>
          <TabsTrigger value="journals">Journaux</TabsTrigger>
          <TabsTrigger value="entries">Écritures</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="ledger">Grand Livre</TabsTrigger>
          <TabsTrigger value="statements">États Financiers</TabsTrigger>
          <TabsTrigger value="vat">TVA</TabsTrigger>
          <TabsTrigger value="fiscal-year">Exercice</TabsTrigger>
        </TabsList>

        <TabsContent value="chart-of-accounts">
          <ChartOfAccounts />
        </TabsContent>

        <TabsContent value="journals">
          <Journals />
        </TabsContent>

        <TabsContent value="entries">
          <Entries />
        </TabsContent>

        <TabsContent value="balance">
          <BalanceComponent />
        </TabsContent>

        <TabsContent value="ledger">
          <LedgerComponent />
        </TabsContent>

        <TabsContent value="statements">
          <FinancialStatements />
        </TabsContent>

        <TabsContent value="vat">
          <VAT />
        </TabsContent>

        <TabsContent value="fiscal-year">
          <FiscalYearComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}