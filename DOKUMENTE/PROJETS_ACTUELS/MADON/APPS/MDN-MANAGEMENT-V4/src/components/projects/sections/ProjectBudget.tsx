import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Plus, Trash2, Euro, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProjectBudget {
  id: string;
  project_id: string;
  category: string;
  planned_amount: number;
  actual_amount: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ProjectBudgetProps {
  projectId: string;
}

export function ProjectBudget({ projectId }: ProjectBudgetProps) {
  const [newBudget, setNewBudget] = useState({
    category: '',
    planned_amount: 0,
    actual_amount: 0,
  });
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  // Récupérer les budgets
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['project-budgets', projectId],
    queryFn: async () => {
      // Mock data
        const data = [];
        const error = null;
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data as ProjectBudget[];
    },
  });

  // Ajouter un budget
  const addBudgetMutation = useMutation({
    mutationFn: async (budget: Omit<ProjectBudget, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await         // Mock insert operation[
          {
            project_id: projectId,
            category: budget.category,
            planned_amount: budget.planned_amount,
            actual_amount: budget.actual_amount,
          },
        ])
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-budgets', projectId] });
      setNewBudget({
        category: '',
        planned_amount: 0,
        actual_amount: 0,
      });
      setIsAdding(false);
      toast.success('Budget ajouté avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout du budget');
      console.error('Erreur lors de l\'ajout du budget:', error);
    },
  });

  // Mettre à jour un budget
  const updateBudgetMutation = useMutation({
    mutationFn: async ({ id, actual_amount }: { id: string; actual_amount: number }) => {
      const { data, error } = await         // Mock update operation{ actual_amount })
// Mock eq call
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-budgets', projectId] });
      toast.success('Budget mis à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du budget');
      console.error('Erreur lors de la mise à jour du budget:', error);
    },
  });

  // Supprimer un budget
  const deleteBudgetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await         // Mock delete operation
// Mock eq call;

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-budgets', projectId] });
      toast.success('Budget supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du budget');
      console.error('Erreur lors de la suppression du budget:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addBudgetMutation.mutate(newBudget);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getVarianceColor = (planned: number, actual: number) => {
    const variance = actual - planned;
    if (variance > 0) {
      return 'text-green-600';
    } else if (variance < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getVarianceIcon = (planned: number, actual: number) => {
    const variance = actual - planned;
    if (variance > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (variance < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  if (isLoading) {
    return <div>Chargement du budget...</div>;
  }

  const totalPlanned = budgets?.reduce((sum, budget) => sum + budget.planned_amount, 0) || 0;
  const totalActual = budgets?.reduce((sum, budget) => sum + budget.actual_amount, 0) || 0;
  const totalVariance = totalActual - totalPlanned;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Budget du projet</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? 'Annuler' : 'Ajouter une catégorie'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Résumé du budget</CardTitle>
          <CardDescription>
            Vue d'ensemble des dépenses planifiées et réelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Budget planifié</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPlanned)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Dépenses réelles</p>
              <p className="text-2xl font-bold">{formatCurrency(totalActual)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Écart</p>
              <div className="flex items-center space-x-2">
                {getVarianceIcon(totalPlanned, totalActual)}
                <p className={cn('text-2xl font-bold', getVarianceColor(totalPlanned, totalActual))}>
                  {formatCurrency(totalVariance)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdding && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Nouvelle catégorie de budget</CardTitle>
              <CardDescription>
                Ajoutez une nouvelle catégorie de dépenses au projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Catégorie
                </label>
                <Select
                  value={newBudget.category}
                  onValueChange={(value) => setNewBudget({ ...newBudget, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personnel">Personnel</SelectItem>
                    <SelectItem value="equipement">Équipement</SelectItem>
                    <SelectItem value="logiciels">Logiciels</SelectItem>
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="services">Services externes</SelectItem>
                    <SelectItem value="autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="planned_amount" className="text-sm font-medium">
                    Montant planifié
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="planned_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newBudget.planned_amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBudget({ ...newBudget, planned_amount: parseFloat(e.target.value) })}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="actual_amount" className="text-sm font-medium">
                    Montant réel
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="actual_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newBudget.actual_amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBudget({ ...newBudget, actual_amount: parseFloat(e.target.value) })}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={addBudgetMutation.isPending}>
                {addBudgetMutation.isPending ? 'Ajout en cours...' : 'Ajouter la catégorie'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {budgets?.map((budget) => (
          <Card key={budget.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {budget.category === 'personnel' ? 'Personnel' :
                 budget.category === 'equipement' ? 'Équipement' :
                 budget.category === 'logiciels' ? 'Logiciels' :
                 budget.category === 'formation' ? 'Formation' :
                 budget.category === 'services' ? 'Services externes' : 'Autres'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBudgetMutation.mutate(budget.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Planifié</p>
                  <p className="text-lg font-semibold">{formatCurrency(budget.planned_amount)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Réel</p>
                  <p className="text-lg font-semibold">{formatCurrency(budget.actual_amount)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Écart</p>
                  <div className="flex items-center space-x-2">
                    {getVarianceIcon(budget.planned_amount, budget.actual_amount)}
                    <p className={cn('text-lg font-semibold', getVarianceColor(budget.planned_amount, budget.actual_amount))}>
                      {formatCurrency(budget.actual_amount - budget.planned_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <label htmlFor={`actual-${budget.id}`} className="text-sm font-medium">
                  Mettre à jour le montant réel
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id={`actual-${budget.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={budget.actual_amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBudgetMutation.mutate({ id: budget.id, actual_amount: parseFloat(e.target.value) })}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 