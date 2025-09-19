import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Column } from '../../hooks/useTasks';

interface ColumnConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  onAddColumn: (columnData: Omit<Column, 'id'>) => void;
}

export function ColumnConfigModal({
  isOpen,
  onClose,
  columns,
  onAddColumn
}: ColumnConfigModalProps) {
  const [newColumn, setNewColumn] = useState({
    name: '',
    color: '#3B82F6',
    order: columns.length + 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newColumn.name.trim()) {
      toast.error('Le nom de la colonne est obligatoire');
      return;
    }

    onAddColumn(newColumn);
    setNewColumn({
      name: '',
      color: '#3B82F6',
      order: columns.length + 2
    });
  };

  const handleInputChange = (field: keyof typeof newColumn, value: string | number) => {
    setNewColumn(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuration des Colonnes Kanban</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Colonnes existantes */}
          <div>
            <h3 className="font-semibold mb-3">Colonnes existantes</h3>
            <div className="space-y-2">
              {columns.map((column, index) => (
                <div key={column.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="font-medium">{column.name}</span>
                    {column.is_default && (
                      <Badge variant="outline" className="text-xs">Par défaut</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Ordre: {column.order}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ajouter une nouvelle colonne */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Ajouter une nouvelle colonne</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="column-name">Nom de la colonne</Label>
                  <Input
                    id="column-name"
                    value={newColumn.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: En attente"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="column-color">Couleur</Label>
                  <div className="flex gap-2">
                    <Input
                      id="column-color"
                      type="color"
                      value={newColumn.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={newColumn.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="column-order">Ordre</Label>
                <Input
                  id="column-order"
                  type="number"
                  min="1"
                  value={newColumn.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                  placeholder="Position dans le Kanban"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  Fermer
                </Button>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la colonne
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
