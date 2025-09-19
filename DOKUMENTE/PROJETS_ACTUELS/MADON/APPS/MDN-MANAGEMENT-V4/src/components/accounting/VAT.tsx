"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Plus, Check, X } from 'lucide-react';
import { VATDeclaration } from '@/types/accounting';

const TEST_DECLARATIONS: VATDeclaration[] = [
  {
    id: '1',
    period: '2024-01',
    collected: 2000,
    deductible: 1200,
    netAmount: 800,
    status: 'validated',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    period: '2024-02',
    collected: 2500,
    deductible: 1500,
    netAmount: 1000,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function VAT() {
  const [declarations, setDeclarations] = useState<VATDeclaration[]>(TEST_DECLARATIONS);
  const [isAdding, setIsAdding] = useState(false);
  const [newDeclaration, setNewDeclaration] = useState<Partial<VATDeclaration>>({
    period: '',
    collected: 0,
    deductible: 0,
    netAmount: 0,
    status: 'draft',
  });

  const handleAddDeclaration = () => {
    if (!newDeclaration.period || !newDeclaration.collected || !newDeclaration.deductible) {
      return;
    }

    const netAmount = newDeclaration.collected - newDeclaration.deductible;

    const declaration: VATDeclaration = {
      id: Date.now().toString(),
      period: newDeclaration.period,
      collected: newDeclaration.collected,
      deductible: newDeclaration.deductible,
      netAmount: netAmount,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDeclarations([...declarations, declaration]);
    setIsAdding(false);
    setNewDeclaration({
      period: '',
      collected: 0,
      deductible: 0,
      netAmount: 0,
      status: 'draft',
    });
  };

  const handleValidateDeclaration = (id: string) => {
    setDeclarations(declarations.map(declaration => 
      declaration.id === id ? { ...declaration, status: 'validated' as const } : declaration
    ));
  };

  const handlePayDeclaration = (id: string) => {
    setDeclarations(declarations.map(declaration => 
      declaration.id === id ? { ...declaration, status: 'paid' as const } : declaration
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion de la TVA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle déclaration
            </Button>
          </div>

          {isAdding && (
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nouvelle déclaration</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="month"
                  value={newDeclaration.period}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, period: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="TVA Collectée"
                  value={newDeclaration.collected}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, collected: parseFloat(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="TVA Déductible"
                  value={newDeclaration.deductible}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, deductible: parseFloat(e.target.value) })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleAddDeclaration}>
                  <Check className="h-4 w-4 mr-2" />
                  Valider
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>TVA Collectée</TableHead>
                <TableHead>TVA Déductible</TableHead>
                <TableHead>Montant Net</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {declarations.map((declaration) => (
                <TableRow key={declaration.id}>
                  <TableCell>{declaration.period}</TableCell>
                  <TableCell>{declaration.collected.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                  <TableCell>{declaration.deductible.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                  <TableCell className={declaration.netAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                    {declaration.netAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      declaration.status === 'paid' ? 'bg-green-100 text-green-800' :
                      declaration.status === 'validated' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {declaration.status === 'paid' ? 'Payée' :
                       declaration.status === 'validated' ? 'Validée' :
                       'Brouillon'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {declaration.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleValidateDeclaration(declaration.id)}
                        >
                          Valider
                        </Button>
                      )}
                      {declaration.status === 'validated' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePayDeclaration(declaration.id)}
                        >
                          Marquer comme payée
                        </Button>
                      )}
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