import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Package, Users, FileText } from 'lucide-react';

const tabs = [
  {
    path: '/stocks/products',
    label: 'Produits',
    icon: Package
  },
  {
    path: '/stocks/suppliers',
    label: 'Fournisseurs',
    icon: Users
  },
  {
    path: '/stocks/customers',
    label: 'Clients',
    icon: Users
  },
  {
    path: '/stocks/reports',
    label: 'Rapports',
    icon: FileText
  }
];

export default function Stocks() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Stocks</h1>
          <p className="text-muted-foreground">
            Gérez vos produits, fournisseurs, clients et rapports de stock
          </p>
        </div>
      </div>

      <Tabs value={currentPath} className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.path}
              value={tab.path}
              asChild
            >
              <Link to={tab.path} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Outlet />
    </div>
  );
} 