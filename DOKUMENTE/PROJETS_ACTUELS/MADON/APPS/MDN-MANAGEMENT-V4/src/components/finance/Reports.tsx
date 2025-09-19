"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialData {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCurrency, setSelectedCurrency] = useState<'XAF' | 'XOF' | 'EUR' | 'USD'>('XAF');

  // Données de test pour les graphiques
  const generateFinancialData = () => {
    const data: FinancialData[] = [];
    const months = 6;
    
    for (let i = 0; i < months; i++) {
      const date = subMonths(new Date(), i);
      data.push({
        date: format(date, 'MMM yyyy', { locale: fr }),
        income: Math.floor(Math.random() * 5000000) + 1000000,
        expenses: Math.floor(Math.random() * 3000000) + 500000,
        balance: Math.floor(Math.random() * 2000000) + 500000
      });
    }
    
    return data.reverse();
  };

  const generateCategoryData = () => {
    return [
      { name: 'Ventes', value: 2500000 },
      { name: 'Services', value: 1500000 },
      { name: 'Investissements', value: 1000000 },
      { name: 'Fournitures', value: -800000 },
      { name: 'Salaires', value: -1200000 },
      { name: 'Marketing', value: -500000 }
    ];
  };

  const financialData = generateFinancialData();
  const categoryData = generateCategoryData();

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'XAF': 'FCFA',
      'XOF': 'FCFA',
      'EUR': '€',
      'USD': '$'
    };
    return symbols[currency] || '';
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={selectedPeriod}
              onValueChange={(value: 'week' | 'month' | 'year') => setSelectedPeriod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedCurrency}
              onValueChange={(value: 'XAF' | 'XOF' | 'EUR' | 'USD') => setSelectedCurrency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XAF">Franc CFA (BEAC)</SelectItem>
                <SelectItem value="XOF">Franc CFA (BCEAO)</SelectItem>
                <SelectItem value="EUR">Euro</SelectItem>
                <SelectItem value="USD">Dollar Américain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {financialData.reduce((sum, data) => sum + data.income, 0).toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {financialData.reduce((sum, data) => sum + data.expenses, 0).toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Solde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialData.reduce((sum, data) => sum + data.balance, 0).toLocaleString('fr-FR')} {getCurrencySymbol(selectedCurrency)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="categories">Par catégorie</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des revenus et dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="income" fill="#22c55e" name="Revenus" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendances mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="balance" fill="#8b5cf6" name="Solde" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 