import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

// Types de base
interface PerformanceMetrics {
  productivity: number;
  quality: number;
  efficiency: number;
}

interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  byDepartment: Record<string, number>;
  performanceMetrics: Record<string, PerformanceMetrics>;
  absenteeismRate: number;
}

export interface GlobalStats {
  activeEmployees: number;
  employees: {
    total: number;
    active: number;
    onLeave: number;
    byDepartment: Record<string, number>;
    performanceMetrics: Record<string, PerformanceMetrics>;
    absenteeismRate: number;
  };
  averagePerformance: number;
  attendanceRate: number;
}

interface Training {
  id: string;
  status: string;
  completion_rate: number;
}

interface Absence {
  start_date: Date;
  end_date: Date;
  type: string;
}

interface Employee {
  id: string;
  status: string;
  department: string;
  hire_date: string;
  salary: number;
  trainings: Training[];
  absences: Absence[];
  performance_score?: number;
}

// Ajout d'une interface pour les métriques départementales
interface DepartmentMetrics {
  efficiency: number;
  headcount: number;
  trainingCompletion: number;
  averagePerformance: number;
}

// 1. Amélioration de la gestion des dates
const DATE_CONSTANTS = {
  WORK_DAYS_PER_YEAR: 260,
  MONTHS_IN_YEAR: 12,
  MS_PER_DAY: 1000 * 60 * 60 * 24
} as const;

// 2. Amélioration du calcul des absences avec gestion des jours fériés
const calculateAbsenteeismRate = (
  absences: Absence[],
  totalWorkDays: number,
  holidays: Date[] = []
): number => {
  if (!absences.length) return 0;

  const totalAbsenceDays = absences.reduce((days: number, abs: Absence) => {
    const start = new Date(abs.start_date);
    const end = new Date(abs.end_date);
    let absenceDays = Math.ceil((end.getTime() - start.getTime()) / DATE_CONSTANTS.MS_PER_DAY);

    // Soustraire les jours fériés
    holidays.forEach(holiday => {
      if (holiday >= start && holiday <= end) {
        absenceDays--;
      }
    });

    return days + Math.max(0, absenceDays);
  }, 0);

  return (totalAbsenceDays / totalWorkDays) * 100;
};

// 3. Amélioration du calcul des performances avec mise en cache
const performanceMetricsCache = new Map<string, PerformanceMetrics>();

const calculatePerformanceMetrics = (
  trainings: Training[],
  absences: Absence[],
  recentEvaluations?: { score: number; date: Date }[],
  employeeId?: string
): PerformanceMetrics => {
  // Vérifier le cache
  if (employeeId && performanceMetricsCache.has(employeeId)) {
    return performanceMetricsCache.get(employeeId)!;
  }

  const metrics = {
    productivity: 0,
    quality: 0,
    efficiency: 0
  };

  try {
    const completedTrainings = trainings.filter(t => t.status === 'completed');
    const trainingQuality = trainings.length > 0 
      ? (completedTrainings.reduce((acc, t) => acc + (t.completion_rate || 0), 0) / trainings.length)
      : 0;

    const absenteeismRate = calculateAbsenteeismRate(absences, DATE_CONSTANTS.WORK_DAYS_PER_YEAR);
    const attendanceQuality = 100 - absenteeismRate;

    const evaluationScore = recentEvaluations?.length 
      ? recentEvaluations.reduce((total, evaluation) => total + evaluation.score, 0) / recentEvaluations.length
      : null;

    metrics.productivity = evaluationScore 
      ? (trainingQuality * 0.3 + attendanceQuality * 0.3 + evaluationScore * 0.4)
      : (trainingQuality * 0.4 + attendanceQuality * 0.6);
    metrics.quality = trainingQuality;
    metrics.efficiency = attendanceQuality;

    // Mettre en cache
    if (employeeId) {
      performanceMetricsCache.set(employeeId, metrics);
    }
  } catch (error) {
    console.error('Erreur dans le calcul des métriques:', error);
  }

  return metrics;
};

// Correction du typage pour les métriques départementales
const calculateDepartmentMetrics = (
  employees: Employee[],
  department: string
): DepartmentMetrics => {
  const departmentEmployees = employees.filter(emp => emp.department === department);
  
  if (!departmentEmployees.length) {
    return {
      efficiency: 0,
      headcount: 0,
      trainingCompletion: 0,
      averagePerformance: 0
    };
  }

  const metrics = departmentEmployees.reduce((acc, emp) => {
    const performance = calculatePerformanceMetrics(emp.trainings || [], emp.absences || []);
    return {
      efficiency: acc.efficiency + performance.efficiency,
      headcount: acc.headcount + 1,
      trainingCompletion: acc.trainingCompletion + 
        (emp.trainings?.filter(t => t.status === 'completed').length || 0),
      averagePerformance: acc.averagePerformance + 
        ((performance.productivity + performance.quality + performance.efficiency) / 3)
    };
  }, {
    efficiency: 0,
    headcount: 0,
    trainingCompletion: 0,
    averagePerformance: 0
  });

  const employeeCount = departmentEmployees.length;
  return {
    efficiency: metrics.efficiency / employeeCount,
    headcount: metrics.headcount,
    trainingCompletion: metrics.trainingCompletion / employeeCount,
    averagePerformance: metrics.averagePerformance / employeeCount
  };
};

// Nouvelle fonction pour calculer le taux d'absentéisme global
const calculateGlobalAbsenteeismRate = (employees: Employee[]): number => {
  if (!employees.length) return 0;
  
  const totalWorkDays = 260 * employees.length;
  const totalAbsenceDays = employees.reduce((acc, emp) => {
    return acc + (emp.absences?.reduce((days, abs) => {
      const start = new Date(abs.start_date);
      const end = new Date(abs.end_date);
      return days + Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    }, 0) || 0);
  }, 0);

  return (totalAbsenceDays / totalWorkDays) * 100;
};

// Fonctions utilitaires avec types explicites
const calculateEmployeeStats = async (): Promise<EmployeeStats> => {
  const { data: employees, error } =         const data = [];
        const error = null;
      *,
      absences (
        start_date,
        end_date,
        type
      ),
      trainings (
        id,
        status,
        completion_rate
      ),
      evaluations (
        score,
        date
      )
    `);

  if (error) {
    throw new Error(`Erreur employés: ${error.message}`);
  }

  const departments = [...new Set(employees?.map(emp => emp.department) || [])];
  const departmentMetrics = departments.reduce((acc, dept) => {
    acc[dept] = calculateDepartmentMetrics(employees || [], dept);
    return acc;
  }, {} as Record<string, DepartmentMetrics>);

  const performanceMetrics = (employees || []).reduce((acc, emp) => {
    acc[emp.id] = calculatePerformanceMetrics(
      emp.trainings || [], 
      emp.absences || [],
      emp.evaluations
    );
    return acc;
  }, {} as Record<string, PerformanceMetrics>);

  // Calcul du taux d'absentéisme global
  const absenteeismRate = calculateGlobalAbsenteeismRate(employees || []);

  return {
    total: employees?.length || 0,
    active: employees?.filter(emp => emp.status === 'active').length || 0,
    onLeave: employees?.filter(emp => emp.status === 'on_leave').length || 0,
    byDepartment: departmentMetrics,
    performanceMetrics,
    absenteeismRate
  };
};

const updateGlobalMetrics = async (metrics: {
  activeEmployees: number;
  averagePerformance: number;
  attendanceRate: number;
}) => {
  const { error } = await     .upsert([
      {
        id: 'current',
        ...metrics,
        updated_at: new Date().toISOString()
      }
    ]);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour des métriques globales: ${error.message}`);
  }
};

// Correction de la validation des métriques
const validateMetrics = (metrics: Partial<GlobalStats>): GlobalStats => {
  const defaultEmployeeStats = {
    total: 0,
    active: 0,
    onLeave: 0,
    byDepartment: {},
    performanceMetrics: {},
    absenteeismRate: 0
  };

  const validated: GlobalStats = {
    employees: metrics.employees ?? defaultEmployeeStats,
    activeEmployees: metrics.activeEmployees ?? 0,
    averagePerformance: metrics.averagePerformance ?? 0,
    attendanceRate: metrics.attendanceRate ?? 0
  };

  // Validation sécurisée des valeurs numériques
  const validateNumber = (value: number): number => {
    return Number.isFinite(value) ? value : 0;
  };

  validated.activeEmployees = validateNumber(validated.activeEmployees);
  validated.averagePerformance = validateNumber(validated.averagePerformance);
  validated.attendanceRate = validateNumber(validated.attendanceRate);

  return validated;
};

// Nouvelle fonction utilitaire pour calculer la performance moyenne
const calculateAveragePerformance = (metrics: Record<string, PerformanceMetrics>): number => {
  const values = Object.values(metrics);
  if (!values.length) return 0;
  
  return values.reduce((acc, curr) => 
    acc + ((curr.productivity + curr.quality + curr.efficiency) / 3), 0
  ) / values.length;
};

// 5. Amélioration de la gestion des erreurs avec retry
const fetchWithRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Hook principal
export const useGlobalStats = () => {
  const queryClient = useQueryClient();

  return useQuery<GlobalStats, Error>({
    queryKey: ['globalStats'],
    queryFn: async () => {
      try {
        const employees = await fetchWithRetry(() => calculateEmployeeStats());

        const stats: GlobalStats = {
          employees,
          activeEmployees: employees.active,
          averagePerformance: calculateAveragePerformance(employees.performanceMetrics),
          attendanceRate: 100 - employees.absenteeismRate
        };

        // Mise à jour optimiste
        queryClient.setQueryData(['globalStats'], validateMetrics(stats));

        await updateGlobalMetrics({
          activeEmployees: stats.activeEmployees,
          averagePerformance: stats.averagePerformance,
          attendanceRate: stats.attendanceRate
        });

        return validateMetrics(stats);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        toast.error(`Erreur lors du chargement des statistiques: ${errorMessage}`);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Correction de useInitializeStats
export const useInitializeStats = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const initialize = async () => {
      try {
        const employees = await calculateEmployeeStats();

        const stats: GlobalStats = {
          employees,
          activeEmployees: employees.active,
          averagePerformance: calculateAveragePerformance(employees.performanceMetrics),
          attendanceRate: 100 - employees.absenteeismRate
        };

        queryClient.setQueryData(['globalStats'], validateMetrics(stats));
        toast.success('Initialisation des statistiques réussie');
      } catch (error) {
        toast.error(`Erreur d'initialisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    };

    initialize();
  }, [queryClient]);
}; 