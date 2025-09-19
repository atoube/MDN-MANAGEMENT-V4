"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TaxDeclarations } from '@/components/accounting/TaxDeclarations';
import { TaxPayments } from '@/components/accounting/TaxPayments';
import { TaxReports } from '@/components/accounting/TaxReports';

export default function DGI() {
  const [activeTab, setActiveTab] = useState('declarations');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module DGI</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="declarations">Déclarations</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="declarations">
          <TaxDeclarations />
        </TabsContent>

        <TabsContent value="payments">
          <TaxPayments />
        </TabsContent>

        <TabsContent value="reports">
          <TaxReports />
        </TabsContent>
      </Tabs>
    </div>
  );
} 