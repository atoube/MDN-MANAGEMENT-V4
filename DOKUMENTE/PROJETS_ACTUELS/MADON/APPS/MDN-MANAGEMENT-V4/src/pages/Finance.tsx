"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Transactions } from '@/components/finance/Transactions';
import { Invoices } from '@/components/finance/Invoices';
import { Payments } from '@/components/finance/Payments';
import { Reports } from '@/components/finance/Reports';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calculator } from 'lucide-react';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('transactions');
  const location = useLocation();
  const isAccountingPage = location.pathname === '/finance/accounting';

  if (isAccountingPage) {
    return <Outlet />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module Finances</h1>
        <Link
          to="/finance/accounting"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Calculator className="h-4 w-4" />
          <span>Comptabilité</span>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Transactions />
        </TabsContent>

        <TabsContent value="invoices">
          <Invoices />
        </TabsContent>

        <TabsContent value="payments">
          <Payments />
        </TabsContent>

        <TabsContent value="reports">
          <Reports transactions={[]} invoices={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}