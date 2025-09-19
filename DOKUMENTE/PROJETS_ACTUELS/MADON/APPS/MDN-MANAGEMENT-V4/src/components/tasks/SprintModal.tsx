import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Plus, Trash2, Save, X, Target } from 'lucide-react';
import { toast } from 'sonner';
import type { Sprint } from '../../hooks/useTasks';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprints: Sprint[];
  onAddSprint: (sprintData: Omit<Sprint, 'id'>) => void;
  onSetCurrentSprint: (sprint: Sprint | null) => void;
  currentSprint: Sprint | null;
}

export function SprintModal({
  isOpen,
  onClose,
  sprints,
  onAddSprint,
  onSetCurrentSprint,
  currentSprint
}: SprintModalProps) {
  const [newSprint, setNewSprint] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_active: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSprint.name.trim()) {
      toast.error('Le nom du sprint est obligatoire');
      return;
    }

    if (!newSprint.start_date || !newSprint.end_date) {
      toast.error('Les dates de début et de fin sont obligatoires');
      return;
    }

    if (new Date(newSprint.start_date) >= new Date(newSprint.end_date)) {
      toast.error('La date de fin doit être postérieure à la date de début');
      return;
    }

    onAddSprint(newSprint);
    setNewSprint({
      name: '',
      start_date: '',
      end_date: '',
      is_active: false
    });
  };

  const handleInputChange = (field: keyof typeof newSprint, value: string | boolean) => {
    setNewSprint(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSetCurrentSprint = (sprint: Sprint) => {
    onSetCurrentSprint(sprint);
    toast.success(`Sprint "${sprint.name}" défini comme actuel`);
  };

  const getSprintStatus = (sprint: Sprint) => {
    const now = new Date();
    const start = new Date(sprint.start_date);
    const end = new Date(sprint.end_date);

    if (sprint.is_active) {
      return { label: 'Actif', className: 'bg-green-100 text-green-800' };
    } else if (now < start) {
      return { label: 'À venir', className: 'bg-blue-100 text-blue-800' };
    } else if (now > end) {
      return { label: 'Terminé', className: 'bg-gray-100 text-gray-800' };
    } else {
      return { label: 'En cours', className: 'bg-orange-100 text-orange-800' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestion des Sprints</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sprint actuel */}
          {currentSprint && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Sprint Actuel
              </h3>
              <div className="space-y-1">
                <p className="font-medium">{currentSprint.name}</p>
                <p className="text-sm text-blue-700">
                  {new Date(currentSprint.start_date).toLocaleDateString('fr-FR')} - {new Date(currentSprint.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          )}

          {/* Sprints existants */}
          <div>
            <h3 className="font-semibold mb-3">Sprints existants</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sprints.map((sprint) => {
                const status = getSprintStatus(sprint);
                return (
                  <div key={sprint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{sprint.name}</span>
                        <Badge className={status.className}>{status.label}</Badge>
                        {sprint.is_active && (
                          <Badge variant="outline" className="text-xs">Actif</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(sprint.start_date).toLocaleDateString('fr-FR')} - {new Date(sprint.end_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!sprint.is_active && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetCurrentSprint(sprint)}
                        >
                          <Target className="h-3 w-3 mr-1" />
                          Activer
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {sprints.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-2" />
                  <p>Aucun sprint créé</p>
                </div>
              )}
            </div>
          </div>

          {/* Ajouter un nouveau sprint */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Créer un nouveau sprint</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sprint-name">Nom du sprint</Label>
                <Input
                  id="sprint-name"
                  value={newSprint.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Sprint 1 - Fonctionnalités Core"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sprint-start">Date de début</Label>
                  <Input
                    id="sprint-start"
                    type="date"
                    value={newSprint.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sprint-end">Date de fin</Label>
                  <Input
                    id="sprint-end"
                    type="date"
                    value={newSprint.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  Fermer
                </Button>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le sprint
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
