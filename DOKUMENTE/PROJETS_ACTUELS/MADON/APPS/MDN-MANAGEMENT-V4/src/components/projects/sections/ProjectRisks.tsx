import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Button } from "@/components/ui/Button";;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";;
import { Input } from "@/components/ui/Input";;
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";;
import { AlertTriangle, Plus, Trash2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProjectRisk {
  id: string;
  project_id: string;
  description: string;
  impact: string;
  probability: number;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  mitigation_plan: string;
  status: 'identified' | 'analyzing' | 'mitigating' | 'resolved' | 'occurred';
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ProjectRisksProps {
  projectId: string;
}

export function ProjectRisks({ projectId }: ProjectRisksProps) {
  const [newRisk, setNewRisk] = useState({
    description: '',
    impact: '',
    probability: 50,
    impact_level: 'medium' as const,
    mitigation_plan: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  // Récupérer les risques
  const { data: risks, isLoading } = useQuery({
    queryKey: ['project-risks', projectId],
    queryFn: async () => {
      // Mock data
        const data = [];
        const error = null;
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data as ProjectRisk[];
    },
  });

  // Ajouter un risque
  const addRiskMutation = useMutation({
    mutationFn: async (risk: Omit<ProjectRisk, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at' | 'status'>) => {
      const { data, error } = await         // Mock insert operation[
          {
            project_id: projectId,
            description: risk.description,
            impact: risk.impact,
            probability: risk.probability,
            impact_level: risk.impact_level,
            mitigation_plan: risk.mitigation_plan,
            status: 'identified',
          },
        ])
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-risks', projectId] });
      setNewRisk({
        description: '',
        impact: '',
        probability: 50,
        impact_level: 'medium',
        mitigation_plan: '',
      });
      setIsAdding(false);
      toast.success('Risque ajouté avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout du risque');
      console.error('Erreur lors de l\'ajout du risque:', error);
    },
  });

  // Mettre à jour le statut d'un risque
  const updateRiskStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProjectRisk['status'] }) => {
      const { data, error } = await         // Mock update operation{ status })
// Mock eq call
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-risks', projectId] });
      toast.success('Statut du risque mis à jour');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error('Erreur lors de la mise à jour du statut:', error);
    },
  });

  // Supprimer un risque
  const deleteRiskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await         // Mock delete operation
// Mock eq call;

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-risks', projectId] });
      toast.success('Risque supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du risque');
      console.error('Erreur lors de la suppression du risque:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRiskMutation.mutate(newRisk);
  };

  const getImpactLevelColor = (level: ProjectRisk['impact_level']) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: ProjectRisk['status']) => {
    switch (status) {
      case 'occurred':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'mitigating':
        return 'bg-blue-100 text-blue-800';
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScore = (probability: number, impactLevel: ProjectRisk['impact_level']) => {
    const impactScore = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    }[impactLevel];
    return (probability / 100) * impactScore;
  };

  if (isLoading) {
    return <div>Chargement des risques...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Risques du projet</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? 'Annuler' : 'Ajouter un risque'}
        </Button>
      </div>

      {isAdding && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Nouveau risque</CardTitle>
              <CardDescription>
                Ajoutez un nouveau risque au projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newRisk.description}
                  onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                  placeholder="Description du risque"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="impact" className="text-sm font-medium">
                  Impact
                </label>
                <Textarea
                  id="impact"
                  value={newRisk.impact}
                  onChange={(e) => setNewRisk({ ...newRisk, impact: e.target.value })}
                  placeholder="Impact potentiel du risque"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="probability" className="text-sm font-medium">
                    Probabilité (%)
                  </label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={newRisk.probability}
                    onChange={(e) => setNewRisk({ ...newRisk, probability: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="impact_level" className="text-sm font-medium">
                    Niveau d'impact
                  </label>
                  <Select
                    value={newRisk.impact_level}
                    onValueChange={(value: ProjectRisk['impact_level']) => 
                      setNewRisk({ ...newRisk, impact_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="high">Élevé</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="mitigation_plan" className="text-sm font-medium">
                  Plan de mitigation
                </label>
                <Textarea
                  id="mitigation_plan"
                  value={newRisk.mitigation_plan}
                  onChange={(e) => setNewRisk({ ...newRisk, mitigation_plan: e.target.value })}
                  placeholder="Plan de mitigation du risque"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={addRiskMutation.isPending}>
                {addRiskMutation.isPending ? 'Ajout en cours...' : 'Ajouter le risque'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {risks?.map((risk) => (
          <Card key={risk.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-medium">
                  {risk.description}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getImpactLevelColor(risk.impact_level))}>
                    {risk.impact_level === 'critical' ? 'Critique' :
                     risk.impact_level === 'high' ? 'Élevé' :
                     risk.impact_level === 'medium' ? 'Moyen' : 'Faible'}
                  </span>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(risk.status))}>
                    {risk.status === 'occurred' ? 'Survenu' :
                     risk.status === 'resolved' ? 'Résolu' :
                     risk.status === 'mitigating' ? 'En mitigation' :
                     risk.status === 'analyzing' ? 'En analyse' : 'Identifié'}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteRiskMutation.mutate(risk.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Impact</h4>
                  <p className="text-sm text-gray-500">{risk.impact}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Plan de mitigation</h4>
                  <p className="text-sm text-gray-500">{risk.mitigation_plan}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Probabilité</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${risk.probability}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{risk.probability}%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Score de risque</h4>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={cn(
                        'h-4 w-4',
                        getRiskScore(risk.probability, risk.impact_level) > 2.5 ? 'text-red-500' :
                        getRiskScore(risk.probability, risk.impact_level) > 1.5 ? 'text-orange-500' :
                        'text-yellow-500'
                      )} />
                      <span className="text-sm text-gray-500">
                        {getRiskScore(risk.probability, risk.impact_level).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateRiskStatusMutation.mutate({ id: risk.id, status: 'analyzing' })}
                  disabled={risk.status === 'analyzing'}
                >
                  En analyse
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateRiskStatusMutation.mutate({ id: risk.id, status: 'mitigating' })}
                  disabled={risk.status === 'mitigating'}
                >
                  En mitigation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateRiskStatusMutation.mutate({ id: risk.id, status: 'resolved' })}
                  disabled={risk.status === 'resolved'}
                >
                  Résolu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateRiskStatusMutation.mutate({ id: risk.id, status: 'occurred' })}
                  disabled={risk.status === 'occurred'}
                >
                  Survenu
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 