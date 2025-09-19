import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { useToast } from './useToast';

export interface Training {
  id: string;
  title: string;
  description?: string;
  provider?: string;
  start_date: string;
  end_date: string;
  cost: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface EmployeeTraining {
  id: string;
  employee_id: string;
  training_id: string;
  status: 'enrolled' | 'completed' | 'failed' | 'dropped';
  completion_date?: string;
  score?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  training?: Training;
  employee?: {
    first_name: string;
    last_name: string;
    department: string;
    position: string;
  };
}

export interface CreateTrainingData {
  title: string;
  description?: string;
  provider?: string;
  start_date: string;
  end_date: string;
  cost?: number;
  status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface UpdateTrainingData extends Partial<CreateTrainingData> {
  id: string;
}

export interface EnrollEmployeeData {
  employee_id: string;
  training_id: string;
  status?: 'enrolled' | 'completed' | 'failed' | 'dropped';
}

export interface UpdateEnrollmentData {
  id: string;
  status?: 'enrolled' | 'completed' | 'failed' | 'dropped';
  completion_date?: string;
  score?: number;
  feedback?: string;
}

export function useTrainings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer toutes les formations
  const {
    data: trainings,
    isLoading: isLoadingTrainings,
    error: trainingsError,
    refetch: refetchTrainings
  } = useQuery({
    queryKey: ['trainings'],
    queryFn: async () => {
      try {
        // Mock data
        const data = [];
        const error = null;
// Mock order call;

        if (error) {
          throw error;
        }

        return data as Training[];
      } catch (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        throw error;
      }
    },
    enabled: true
  });

  // Créer une nouvelle formation
  const createTrainingMutation = useMutation({
    mutationFn: async (trainingData: CreateTrainingData) => {
      const { data, error } = await         // Mock insert operation[trainingData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Training;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast({
        title: 'Succès',
        description: 'Formation créée avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la création de la formation:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la création de la formation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Mettre à jour une formation existante
  const updateTrainingMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateTrainingData) => {
      const { data, error } = await         // Mock update operationupdateData)
// Mock eq call
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Training;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast({
        title: 'Succès',
        description: 'Formation mise à jour avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la mise à jour de la formation:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour de la formation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Supprimer une formation
  const deleteTrainingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await         // Mock delete operation
// Mock eq call;

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast({
        title: 'Succès',
        description: 'Formation supprimée avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la suppression de la formation:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression de la formation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  return {
    trainings,
    isLoadingTrainings,
    trainingsError,
    refetchTrainings,
    createTraining: createTrainingMutation.mutate,
    updateTraining: updateTrainingMutation.mutate,
    deleteTraining: deleteTrainingMutation.mutate,
    isCreating: createTrainingMutation.isPending,
    isUpdating: updateTrainingMutation.isPending,
    isDeleting: deleteTrainingMutation.isPending
  };
}

export function useEmployeeTrainings(employeeId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les formations d'un employé ou toutes les inscriptions
  const {
    data: employeeTrainings,
    isLoading: isLoadingEmployeeTrainings,
    error: employeeTrainingsError,
    refetch: refetchEmployeeTrainings
  } = useQuery({
    queryKey: ['employeeTrainings', employeeId],
    queryFn: async () => {
      try {
        let query =           .select(`
            *,
            training:trainings(*),
            employee:employees(first_name, last_name, department, position)
          `)
// Mock order call;

        if (employeeId) {
          query = query.eq('employee_id', employeeId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        return data as EmployeeTraining[];
      } catch (error) {
        console.error('Erreur lors de la récupération des inscriptions aux formations:', error);
        throw error;
      }
    },
    enabled: true
  });

  // Inscrire un employé à une formation
  const enrollEmployeeMutation = useMutation({
    mutationFn: async (enrollmentData: EnrollEmployeeData) => {
      const { data, error } = await         // Mock insert operation[enrollmentData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as EmployeeTraining;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeTrainings'] });
      toast({
        title: 'Succès',
        description: 'Employé inscrit à la formation avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de l\'inscription à la formation:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'inscription à la formation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Mettre à jour une inscription
  const updateEnrollmentMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateEnrollmentData) => {
      const { data, error } = await         // Mock update operationupdateData)
// Mock eq call
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as EmployeeTraining;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeTrainings'] });
      toast({
        title: 'Succès',
        description: 'Inscription mise à jour avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la mise à jour de l\'inscription:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour de l'inscription: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Supprimer une inscription
  const deleteEnrollmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await         // Mock delete operation
// Mock eq call;

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeTrainings'] });
      toast({
        title: 'Succès',
        description: 'Inscription supprimée avec succès',
        variant: 'default'
      });
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la suppression de l\'inscription:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression de l'inscription: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Calculer les statistiques des formations
  const calculateTrainingStats = (employeeTrainings: EmployeeTraining[] = []) => {
    if (!employeeTrainings.length) {
      return {
        totalEnrollments: 0,
        completedTrainings: 0,
        failedTrainings: 0,
        inProgressTrainings: 0,
        averageScore: 0
      };
    }

    const totalEnrollments = employeeTrainings.length;
    const completedTrainings = employeeTrainings.filter(et => et.status === 'completed').length;
    const failedTrainings = employeeTrainings.filter(et => et.status === 'failed').length;
    const inProgressTrainings = employeeTrainings.filter(et => et.status === 'enrolled').length;
    
    // Calculer la moyenne des scores seulement pour les formations terminées avec un score
    const scoredTrainings = employeeTrainings.filter(et => et.status === 'completed' && et.score !== undefined);
    const sumScores = scoredTrainings.reduce((sum, et) => sum + (et.score || 0), 0);
    const averageScore = scoredTrainings.length > 0 ? sumScores / scoredTrainings.length : 0;

    return {
      totalEnrollments,
      completedTrainings,
      failedTrainings,
      inProgressTrainings,
      averageScore
    };
  };

  // Obtenir les statistiques des formations
  const trainingStats = calculateTrainingStats(employeeTrainings);

  return {
    employeeTrainings,
    isLoadingEmployeeTrainings,
    employeeTrainingsError,
    refetchEmployeeTrainings,
    enrollEmployee: enrollEmployeeMutation.mutate,
    updateEnrollment: updateEnrollmentMutation.mutate,
    deleteEnrollment: deleteEnrollmentMutation.mutate,
    isEnrolling: enrollEmployeeMutation.isPending,
    isUpdating: updateEnrollmentMutation.isPending,
    isDeleting: deleteEnrollmentMutation.isPending,
    trainingStats
  };
} 