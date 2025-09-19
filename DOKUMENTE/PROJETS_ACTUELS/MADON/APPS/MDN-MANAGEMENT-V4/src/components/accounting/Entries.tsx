"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { AccountingEntry, EntryLine, Journal } from '@/types/accounting';
import { TEST_JOURNALS } from '@/data/accounting/testData';

const TEST_ENTRIES: AccountingEntry[] = [
  {
    id: '1',
    journalId: '1',
    date: new Date(),
    reference: 'FAC-2024-001',
    description: 'Facture client XYZ',
    lines: [
      {
        id: '1-1',
        accountId: '411',
        debit: 0,
        credit: 1200,
        description: 'Client XYZ',
      },
      {
        id: '1-2',
        accountId: '707',
        debit: 1000,
        credit: 0,
        description: 'Vente de marchandises',
      },
      {
        id: '1-3',
        accountId: '44571',
        debit: 200,
        credit: 0,
        description: 'TVA collectée',
      },
    ],
    isLocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function Entries() {
  const [entries, setEntries] = useState<AccountingEntry[]>(TEST_ENTRIES);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<AccountingEntry>>({
    journalId: '',
    date: new Date(),
    reference: '',
    description: '',
    lines: [],
    isLocked: false,
  });
  const [newLine, setNewLine] = useState<Partial<EntryLine>>({
    accountId: '',
    debit: 0,
    credit: 0,
    description: '',
  });

  const handleAddEntry = () => {
    if (!newEntry.journalId || !newEntry.reference || !newEntry.description || newEntry.lines?.length === 0) {
      return;
    }

    const entry: AccountingEntry = {
      id: Date.now().toString(),
      journalId: newEntry.journalId,
      date: newEntry.date || new Date(),
      reference: newEntry.reference,
      description: newEntry.description,
      lines: newEntry.lines || [],
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEntries([...entries, entry]);
    setIsAdding(false);
    setNewEntry({
      journalId: '',
      date: new Date(),
      reference: '',
      description: '',
      lines: [],
      isLocked: false,
    });
  };

  const handleAddLine = () => {
    if (!newLine.accountId || (!newLine.debit && !newLine.credit) || !newLine.description) {
      return;
    }

    const line: EntryLine = {
      id: Date.now().toString(),
      accountId: newLine.accountId,
      debit: newLine.debit || 0,
      credit: newLine.credit || 0,
      description: newLine.description,
    };

    setNewEntry({
      ...newEntry,
      lines: [...(newEntry.lines || []), line],
    });

    setNewLine({
      accountId: '',
      debit: 0,
      credit: 0,
      description: '',
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleToggleLock = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, isLocked: !entry.isLocked } : entry
    ));
  };

  const getJournalLabel = (journalId: string) => {
    return TEST_JOURNALS.find(j => j.id === journalId)?.label || '';
  };

  const calculateTotalDebit = (lines: EntryLine[]) => {
    return lines.reduce((sum, line) => sum + line.debit, 0);
  };

  const calculateTotalCredit = (lines: EntryLine[]) => {
    return lines.reduce((sum, line) => sum + line.credit, 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Écritures Comptables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle écriture
            </Button>
          </div>

          {isAdding && (
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nouvelle écriture</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Select
                  value={newEntry.journalId}
                  onValueChange={(value) => setNewEntry({ ...newEntry, journalId: value })}
                >
                  <option value="">Sélectionner un journal</option>
                  {TEST_JOURNALS.map(journal => (
                    <option key={journal.id} value={journal.id}>
                      {journal.label}
                    </option>
                  ))}
                </Select>
                <Input
                  type="date"
                  value={newEntry.date?.toISOString().split('T')[0]}
                  onChange={(e) => setNewEntry({ ...newEntry, date: new Date(e.target.value) })}
                />
                <Input
                  placeholder="Référence"
                  value={newEntry.reference}
                  onChange={(e) => setNewEntry({ ...newEntry, reference: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold mb-2">Lignes d'écriture</h4>
                <div className="grid grid-cols-4 gap-4 mb-2">
                  <Input
                    placeholder="Compte"
                    value={newLine.accountId}
                    onChange={(e) => setNewLine({ ...newLine, accountId: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Débit"
                    value={newLine.debit}
                    onChange={(e) => setNewLine({ ...newLine, debit: parseFloat(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="Crédit"
                    value={newLine.credit}
                    onChange={(e) => setNewLine({ ...newLine, credit: parseFloat(e.target.value) })}
                  />
                  <Input
                    placeholder="Description"
                    value={newLine.description}
                    onChange={(e) => setNewLine({ ...newLine, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddLine}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une ligne
                </Button>
              </div>

              {newEntry.lines && newEntry.lines.length > 0 && (
                <div className="mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Compte</TableHead>
                        <TableHead>Débit</TableHead>
                        <TableHead>Crédit</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newEntry.lines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell>{line.accountId}</TableCell>
                          <TableCell>{line.debit}</TableCell>
                          <TableCell>{line.credit}</TableCell>
                          <TableCell>{line.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end mt-2">
                    <span className="font-semibold">
                      Total Débit: {calculateTotalDebit(newEntry.lines)} | 
                      Total Crédit: {calculateTotalCredit(newEntry.lines)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleAddEntry}>
                  <Check className="h-4 w-4 mr-2" />
                  Valider
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Journal</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Débit</TableHead>
                <TableHead>Crédit</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date.toLocaleDateString()}</TableCell>
                  <TableCell>{getJournalLabel(entry.journalId)}</TableCell>
                  <TableCell>{entry.reference}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{calculateTotalDebit(entry.lines)}</TableCell>
                  <TableCell>{calculateTotalCredit(entry.lines)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {entry.isLocked ? 'Verrouillée' : 'Modifiable'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleLock(entry.id)}
                      >
                        {entry.isLocked ? 'Déverrouiller' : 'Verrouiller'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
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