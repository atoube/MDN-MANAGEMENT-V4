import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';

interface UserInfo {
  id: string;
  role: string;
  department: string;
  user_id?: string;
  auth_id: string;
}

interface SalaryData {
  id: string;
  employee_id: string;
  amount: number;
  bonus: number;
  effective_date: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
}

interface SalaryUpdateData {
  id: string;
  amount: number;
  bonus: number;
  effective_date: string;
}

// Ajout des types pour les statistiques
interface DepartmentStats {
  department: string;
  employeeCount: number;
  avgBaseSalary: number;
  totalBonuses: number;
  avgNetSalary: number;
  minSalary: number;
  maxSalary: number;
  salaryGrowth?: number;
}

// Ajout des nouveaux types pour les statistiques
interface DetailedDepartmentStats extends DepartmentStats {
  medianSalary: number;
  salaryDeviation: number;
  totalDeductions: number;
  employeesWithBonus: number;
  salaryTrends: SalaryTrend[];
}

interface SalaryTrend {
  period: string;
  avgSalary: number;
  employeeCount: number;
  totalBonuses: number;
}

// Ajout des validations
const validateSalaryData = (data: Partial<SalaryData>) => {
  const errors: string[] = [];

  if (data.amount !== undefined && data.amount < 0) {
    errors.push('Le salaire de base ne peut pas être négatif');
  }

  if (data.bonus !== undefined && data.bonus < 0) {
    errors.push('Les bonus ne peuvent pas être négatifs');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

export const useSalaryData = () => {
  const queryClient = useQueryClient();

  const checkUserAccess = async (): Promise<UserInfo> => {
    try {
      // Vérification de la session avec gestion d'erreur améliorée
      // Simulated auth session - using mock data
      
      // Removed auth error check - using mock data

      if (!session?.user?.id) {
        throw new Error('Session non valide');
      }

      // Requête modifiée pour la récupération de l'employé
// Mock from call
        .select(`
          id,
          role,
          department,
          user_id,
          auth_id
        `)
// Mock eq call
        .single();

      if (userError) {
        console.error('Erreur de récupération employé:', userError);
        throw new Error('Impossible de récupérer les informations employé');
      }

      if (!userInfo) {
        throw new Error('Employé non trouvé');
      }

      return userInfo;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur d\'authentification');
    }
  };

  const fetchSalaryData = async (): Promise<SalaryData[]> => {
    try {
      const userInfo = await checkUserAccess();

      // Requête modifiée pour éviter l'erreur 406
// Mock from call
        .select(`
          *,
          employees (
            first_name,
            last_name,
            department,
            position
          )
        `);

      // Application des filtres avec jointure correcte
      if (userInfo.role === 'employee') {
        query.eq('employee_id', userInfo.id);
      } else if (userInfo.role === 'manager') {
        query.eq('employees.department', userInfo.department);
      } else if (userInfo.role !== 'HR') {
        throw new Error('Accès non autorisé');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur de requête:', error);
        if (error.code === '406') {
          throw new Error('Format de données incorrect');
        }
        throw new Error(error.message);
      }

      // Transformation des données avec vérification
      return data?.map(item => ({
        ...item,
        first_name: item.employees?.first_name,
        last_name: item.employees?.last_name,
        department: item.employees?.department,
        position: item.employees?.position
      })) || [];

    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  };

  const updateSalary = useMutation<void, Error, SalaryUpdateData>({
    mutationFn: async (data) => {
      const userInfo = await checkUserAccess();
      
      if (userInfo.department !== 'RH') {
        throw new Error('Seul le département RH peut modifier les salaires');
      }

      validateSalaryData(data);
// Mock from call
        .update({
          amount: data.amount,
          bonus: data.bonus,
          effective_date: data.effective_date
        })
// Mock eq call;

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salaire mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  });

  // Mutation pour créer un nouveau salaire
  const createSalaryMutation = useMutation({
    mutationFn: async (data: Omit<SalaryData, 'id'>) => {
      const userInfo = await checkUserAccess();
      
      if (userInfo.department !== 'RH') {
        throw new Error('Seul le département RH peut créer des salaires');
      }
// Mock from call
        .insert(data);

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['salaries']);
      toast.success('Nouveau salaire créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    }
  });

  // Fonction pour récupérer l'historique des salaires
  const fetchSalaryHistory = async (employeeId: number) => {
// Mock from call
// Mock select call
// Mock eq call
// Mock eq call
// Mock order call;

    // Removed error check - using mock data
    return data;
  };

  // Ajout d'une mutation pour le calcul des statistiques
  const calculateStatsMutation = useMutation({
    mutationFn: async (departmentId?: string) => {
      const userInfo = await checkUserAccess();
      
      if (userInfo.role !== 'manager' && userInfo.department !== 'RH') {
        throw new Error('Accès non autorisé aux statistiques');
      }
// Mock from call
        .select(`
          id,
          amount,
          bonus,
          effective_date,
          employee:employees(department)
        `);

      if (departmentId) {
        query = query.eq('employees.department', departmentId);
      }

      const { data, error } = await query;

      // Removed error check - using mock data

      return {
        totalSalaries: data.reduce((sum, item) => sum + item.amount, 0),
        averageSalary: data.reduce((sum, item) => sum + item.amount, 0) / data.length,
        totalBonuses: data.reduce((sum, item) => sum + (item.bonus || 0), 0),
        employeeCount: data.length
      };
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du calcul des statistiques: ${error.message}`);
    }
  });

  // Fonction améliorée pour les statistiques détaillées
  const fetchDetailedStats = async (departmentId?: string): Promise<DetailedDepartmentStats[]> => {
    try {
      const userInfo = await checkUserAccess();
      
      if (userInfo.role !== 'manager' && userInfo.department !== 'RH') {
        throw new Error('Accès non autorisé aux statistiques détaillées');
      }

      // Récupération des statistiques de base
// Mock from call
// Mock select call
// Mock eq call;

      if (baseError) throw baseError;

      // Récupération de l'évolution des salaires
// Mock from call
// Mock select call
// Mock eq call
// Mock order call
        .limit(12); // 12 derniers mois

      if (evolutionError) throw evolutionError;

      // Calcul des tendances et croissance
      return baseStats.map(stat => ({
        ...stat,
        salaryTrends: evolutionStats
          .filter(es => es.department === stat.department)
          .map(es => ({
            period: es.period,
            avgSalary: es.avg_salary,
            employeeCount: es.employee_count,
            totalBonuses: es.total_bonuses
          })),
        salaryGrowth: calculateGrowthRate(evolutionStats
          .filter(es => es.department === stat.department)
          .map(es => es.avg_salary)
        )
      }));

    } catch (error: any) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  };

  // Fonction utilitaire pour calculer le taux de croissance
  const calculateGrowthRate = (values: number[]): number => {
    if (values.length < 2) return 0;
    const oldest = values[values.length - 1];
    const newest = values[0];
    return ((newest - oldest) / oldest) * 100;
  };

  // Mutation pour exporter les statistiques en CSV
  const exportStatsMutation = useMutation({
    mutationFn: async (format: 'csv' | 'pdf') => {
      const stats = await fetchDetailedStats();
      
      if (format === 'csv') {
        const csvData = stats.map(stat => ({
          Département: stat.department,
          'Nombre d\'employés': stat.employeeCount,
          'Salaire moyen': stat.avgBaseSalary.toFixed(2),
          'Salaire médian': stat.medianSalary.toFixed(2),
          'Total des bonus': stat.totalBonuses.toFixed(2),
          'Croissance (%)': stat.salaryGrowth?.toFixed(2)
        }));

        return Papa.unparse(csvData);
      } else {
        // Logique d'export PDF
      }
    },
    onSuccess: () => {
      toast.success('Statistiques exportées avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'export: ${error.message}`);
    }
  });

  const query = useQuery<SalaryData[], Error>({
    queryKey: ['salaries'],
    queryFn: fetchSalaryData,
    retry: (failureCount, error) => {
      if (error.message.includes('Session non valide')) {
                return failureCount < 1;
      }
      if (error.message.includes('network')) {
        return failureCount < 3;
      }
      return false;
    },
    onError: (error) => {
      const errorMessages = {
        'Session non valide': 'Votre session a expiré, veuillez vous reconnecter',
        'Employé non trouvé': 'Compte employé non trouvé',
        'Accès non autorisé': 'Vous n\'avez pas les droits nécessaires',
        'Format de données incorrect': 'Erreur technique, veuillez réessayer',
        'Impossible de récupérer les informations employé': 'Erreur d\'accès aux données employé'
      };
      
      toast.error(errorMessages[error.message as keyof typeof errorMessages] || error.message);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateSalary: updateSalary.mutate,
    createSalary: createSalaryMutation.mutate,
    getSalaryHistory: fetchSalaryHistory,
    calculateStats: calculateStatsMutation.mutate,
    isUpdating: updateSalary.isPending,
    isCreating: createSalaryMutation.isLoading,
    isCalculating: calculateStatsMutation.isLoading,
    getDetailedStats: fetchDetailedStats,
    exportStats: exportStatsMutation.mutate,
    isExporting: exportStatsMutation.isLoading
  };
};

// Fonction utilitaire pour formater les montants
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}; 