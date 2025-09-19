"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Journal } from '@/types/accounting';
import { TEST_JOURNALS } from '@/data/accounting/testData';

export function Journals() {
  const [journals, setJournals] = useState<Journal[]>(TEST_JOURNALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newJournal, setNewJournal] = useState<Partial<Journal>>({
    code: '',
    label: '',
    type: 'ventes',
    isActive: true,
  });

  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.code.includes(searchTerm);
    const matchesType = selectedType === 'all' || journal.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddJournal = () => {
    if (!newJournal.code || !newJournal.label || !newJournal.type) {
      return;
    }

    const journal: Journal = {
      id: Date.now().toString(),
      code: newJournal.code,
      label: newJournal.label,
      type: newJournal.type as Journal['type'],
      isActive: true,
    };

    setJournals([...journals, journal]);
    setIsAdding(false);
    setNewJournal({
      code: '',
      label: '',
      type: 'ventes',
      isActive: true,
    });
  };

  const handleDeleteJournal = (id: string) => {
    setJournals(journals.filter(journal => journal.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setJournals(journals.map(journal => 
      journal.id === id ? { ...journal, isActive: !journal.isActive } : journal
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Journaux Comptables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher un journal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <option value="all">Tous les types</option>
              <option value="ventes">Ventes</option>
              <option value="achats">Achats</option>
              <option value="tresorerie">Trésorerie</option>
              <option value="operations-diverses">Opérations Diverses</option>
            </Select>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un journal
            </Button>
          </div>

          {isAdding && (
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nouveau journal</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Code"
                  value={newJournal.code}
                  onChange={(e) => setNewJournal({ ...newJournal, code: e.target.value })}
                />
                <Input
                  placeholder="Libellé"
                  value={newJournal.label}
                  onChange={(e) => setNewJournal({ ...newJournal, label: e.target.value })}
                />
                <Select
                  value={newJournal.type}
                  onValueChange={(value) => setNewJournal({ ...newJournal, type: value as Journal['type'] })}
                >
                  <option value="ventes">Ventes</option>
                  <option value="achats">Achats</option>
                  <option value="tresorerie">Trésorerie</option>
                  <option value="operations-diverses">Opérations Diverses</option>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleAddJournal}>
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
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJournals.map((journal) => (
                <TableRow key={journal.id}>
                  <TableCell>{journal.code}</TableCell>
                  <TableCell>{journal.label}</TableCell>
                  <TableCell>{journal.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      journal.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {journal.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(journal.id)}
                      >
                        {journal.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJournal(journal.id)}
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