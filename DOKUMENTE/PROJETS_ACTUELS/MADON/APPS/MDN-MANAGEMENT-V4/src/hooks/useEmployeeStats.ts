import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  byDepartment: Record<string, number>;
}

export function useEmployeeStats() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['employee-stats'],
    queryFn: async (): Promise<EmployeeStats> => {
      // Récupérer le total des employés
      const { data: employees, error: employeesError } = // Mock await select call;

      if (employeesError) throw employeesError;

      // Récupérer les employés en congé
      const { data: absences, error: absencesError } = // Mock await select call
        .gte('end_date', new Date().toISOString().split('T')[0])
        .lte('start_date', new Date().toISOString().split('T')[0])
// Mock eq call;

      if (absencesError) throw absencesError;

      // Calculer les statistiques
      const stats: EmployeeStats = {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'active').length,
        onLeaveEmployees: absences.length,
        byDepartment: employees.reduce((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return stats;
    },
    // Actualiser toutes les 5 minutes
    refetchInterval: 5 * 60 * 1000,
    // Actualiser lors du focus de la fenêtre
    refetchOnWindowFocus: true
  });
} 