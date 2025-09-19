"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Account } from '@/types/accounting';

const TEST_ACCOUNTS: Account[] = [
  {
    id: '1',
    code: '401',
    label: 'Fournisseurs',
    type: 'passif',
    category: 'Passif',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    code: '411',
    label: 'Clients',
    type: 'actif',
    category: 'Actif',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    code: '512',
    label: 'Banque',
    type: 'actif',
    category: 'Actif',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(TEST_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    code: '',
    label: '',
    type: 'actif',
    category: '',
    isActive: true,
  });

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.code.includes(searchTerm);
    const matchesType = selectedType === 'all' || account.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddAccount = () => {
    if (!newAccount.code || !newAccount.label || !newAccount.type || !newAccount.category) {
      return;
    }

    const account: Account = {
      id: Date.now().toString(),
      code: newAccount.code,
      label: newAccount.label,
      type: newAccount.type as Account['type'],
      category: newAccount.category,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAccounts([...accounts, account]);
    setIsAdding(false);
    setNewAccount({
      code: '',
      label: '',
      type: 'actif',
      category: '',
      isActive: true,
    });
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, isActive: !account.isActive } : account
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Plan Comptable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher un compte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <option value="all">Tous les types</option>
              <option value="actif">Actif</option>
              <option value="passif">Passif</option>
              <option value="charge">Charge</option>
              <option value="produit">Produit</option>
            </Select>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un compte
            </Button>
          </div>

          {isAdding && (
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nouveau compte</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Code"
                  value={newAccount.code}
                  onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                />
                <Input
                  placeholder="Libellé"
                  value={newAccount.label}
                  onChange={(e) => setNewAccount({ ...newAccount, label: e.target.value })}
                />
                <Select
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value as Account['type'] })}
                >
                  <option value="actif">Actif</option>
                  <option value="passif">Passif</option>
                  <option value="charge">Charge</option>
                  <option value="produit">Produit</option>
                </Select>
                <Input
                  placeholder="Catégorie"
                  value={newAccount.category}
                  onChange={(e) => setNewAccount({ ...newAccount, category: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleAddAccount}>
                  <Check className="h-4 w-4 mr-2" />
                  Valider
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.code}</TableCell>
                  <TableCell>{account.label}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>{account.category}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {account.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(account.id)}
                      >
                        {account.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 