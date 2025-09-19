import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { useToast } from './useToast';

export interface PerformanceEvaluation {
  id: string;
  employee_id: string;
  evaluator_id: string;
  evaluation_date: string;
  period_start: string;
  period_end: string;
  overall_rating: number;
  technical_skills: number;
  communication_skills: number;
  teamwork: number;
  leadership?: number;
  comments?: string;
  goals_for_next_period?: string;
  created_at: string;
  updated_at: string;
  employee?: {
    first_name: string;
    last_name: string;
    department: string;
    position: string;
  };
  evaluator?: {
    email: string;
    user_metadata: {
      first_name?: string;
      last_name?: string;
    };
  };
}

export interface CreateEvaluationData {
  employee_id: string;
  evaluator_id: string;
  evaluation_date: string;
  period_start: string;
  period_end: string;
  overall_rating: number;
  technical_skills: number;
  communication_skills: number;
  teamwork: number;
  leadership?: number;
  comments?: string;
  goals_for_next_period?: string;
}

export interface UpdateEvaluationData extends Partial<CreateEvaluationData> {
  id: string;
}

export function usePerformanceEvaluations(employeeId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer toutes les évaluations ou celles d'un employé spécifique
  const {
    data: evaluations,
    isLoading: isLoadingEvaluations,
    error: evaluationsError,
    refetch: refetchEvaluations
  } = useQuery({
    queryKey: ['performanceEvaluations', employeeId],
    queryFn: async () => {
      try {
        let query =           .select(`
            *,
            employee:employees(first_name, last_name, department, position),
            evaluator:auth.users(email, user_metadata)
          `)
// Mock order call;

        if (employeeId) {
          query = query.eq('employee_id', employeeId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        return data as PerformanceEvaluation[];
      } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
        throw error;
      }
    },
    enabled: true
  });

  // Créer une nouvelle évaluation
  const createEvaluationMutation = useMutation({
    mutationFn: async (evaluationData: CreateEvaluationData) => {
      const { data, error } = await         // Mock insert operation[evaluationData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as PerformanceEvaluation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performanceEvaluations'] });
      toast({
        title: 'Succès',
        description: 'Évaluation de performance créée avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la création de l'évaluation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Mettre à jour une évaluation existante
  const updateEvaluationMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateEvaluationData) => {
      const { data, error } = await         // Mock update operationupdateData)
// Mock eq call
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as PerformanceEvaluation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performanceEvaluations'] });
      toast({
        title: 'Succès',
        description: 'Évaluation de performance mise à jour avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour de l'évaluation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Supprimer une évaluation
  const deleteEvaluationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await         // Mock delete operation
// Mock eq call;

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performanceEvaluations'] });
      toast({
        title: 'Succès',
        description: 'Évaluation de performance supprimée avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la suppression de l\'évaluation:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression de l'évaluation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Calculer les statistiques d'évaluation
  const calculateEvaluationStats = (evaluations: PerformanceEvaluation[] = []) => {
    if (!evaluations.length) {
      return {
        averageOverallRating: 0,
        averageTechnicalSkills: 0,
        averageCommunicationSkills: 0,
        averageTeamwork: 0,
        averageLeadership: 0,
        totalEvaluations: 0
      };
    }

    const totalEvaluations = evaluations.length;
    const sumOverallRating = evaluations.reduce((sum, evaluation) => sum + evaluation.overall_rating, 0);
    const sumTechnicalSkills = evaluations.reduce((sum, evaluation) => sum + evaluation.technical_skills, 0);
    const sumCommunicationSkills = evaluations.reduce((sum, evaluation) => sum + evaluation.communication_skills, 0);
    const sumTeamwork = evaluations.reduce((sum, evaluation) => sum + evaluation.teamwork, 0);
    
    // Calculer la moyenne de leadership seulement pour les évaluations qui ont cette valeur
    const leadershipEvaluations = evaluations.filter(evaluation => evaluation.leadership !== undefined);
    const sumLeadership = leadershipEvaluations.reduce((sum, evaluation) => sum + (evaluation.leadership || 0), 0);
    const averageLeadership = leadershipEvaluations.length > 0 ? sumLeadership / leadershipEvaluations.length : 0;

    return {
      averageOverallRating: sumOverallRating / totalEvaluations,
      averageTechnicalSkills: sumTechnicalSkills / totalEvaluations,
      averageCommunicationSkills: sumCommunicationSkills / totalEvaluations,
      averageTeamwork: sumTeamwork / totalEvaluations,
      averageLeadership,
      totalEvaluations
    };
  };

  // Obtenir les statistiques d'évaluation
  const evaluationStats = calculateEvaluationStats(evaluations);

  return {
    evaluations,
    isLoadingEvaluations,
    evaluationsError,
    refetchEvaluations,
    createEvaluation: createEvaluationMutation.mutate,
    updateEvaluation: updateEvaluationMutation.mutate,
    deleteEvaluation: deleteEvaluationMutation.mutate,
    isCreating: createEvaluationMutation.isPending,
    isUpdating: updateEvaluationMutation.isPending,
    isDeleting: deleteEvaluationMutation.isPending,
    evaluationStats
  };
} 