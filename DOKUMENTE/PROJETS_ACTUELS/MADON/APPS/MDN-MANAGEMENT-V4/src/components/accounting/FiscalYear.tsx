"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Plus, Check, X, Lock, Unlock } from 'lucide-react';
import { FiscalYear } from '@/types/accounting';

const TEST_FISCAL_YEARS: FiscalYear[] = [
  {
    id: '1',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    isClosed: true,
    isCurrent: false,
  },
  {
    id: '2',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isClosed: false,
    isCurrent: true,
  },
];

export function FiscalYearComponent() {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(TEST_FISCAL_YEARS);
  const [isAdding, setIsAdding] = useState(false);
  const [newFiscalYear, setNewFiscalYear] = useState<Partial<FiscalYear>>({
    startDate: new Date(),
    endDate: new Date(),
    isClosed: false,
    isCurrent: false,
  });

  const handleAddFiscalYear = () => {
    if (!newFiscalYear.startDate || !newFiscalYear.endDate) {
      return;
    }

    const fiscalYear: FiscalYear = {
      id: Date.now().toString(),
      startDate: newFiscalYear.startDate,
      endDate: newFiscalYear.endDate,
      isClosed: false,
      isCurrent: false,
    };

    setFiscalYears([...fiscalYears, fiscalYear]);
    setIsAdding(false);
    setNewFiscalYear({
      startDate: new Date(),
      endDate: new Date(),
      isClosed: false,
      isCurrent: false,
    });
  };

  const handleToggleCurrent = (id: string) => {
    setFiscalYears(fiscalYears.map(year => ({
      ...year,
      isCurrent: year.id === id,
    })));
  };

  const handleToggleClosed = (id: string) => {
    setFiscalYears(fiscalYears.map(year => 
      year.id === id ? { ...year, isClosed: !year.isClosed } : year
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Exercices Fiscaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel exercice
            </Button>
          </div>

          {isAdding && (
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nouvel exercice</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date de début</label>
                  <Input
                    type="date"
                    value={newFiscalYear.startDate?.toISOString().split('T')[0]}
                    onChange={(e) => setNewFiscalYear({ ...newFiscalYear, startDate: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin</label>
                  <Input
                    type="date"
                    value={newFiscalYear.endDate?.toISOString().split('T')[0]}
                    onChange={(e) => setNewFiscalYear({ ...newFiscalYear, endDate: new Date(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleAddFiscalYear}>
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
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fiscalYears.map((year) => (
                <TableRow key={year.id}>
                  <TableCell>
                    Du {year.startDate.toLocaleDateString()} au {year.endDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        year.isClosed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {year.isClosed ? 'Clôturé' : 'Ouvert'}
                      </span>
                      {year.isCurrent && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Exercice en cours
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!year.isClosed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleCurrent(year.id)}
                          disabled={year.isCurrent}
                        >
                          {year.isCurrent ? 'Exercice actuel' : 'Définir comme actuel'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleClosed(year.id)}
                        disabled={year.isCurrent}
                      >
                        {year.isClosed ? (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Rouvrir
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Clôturer
                          </>
                        )}
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