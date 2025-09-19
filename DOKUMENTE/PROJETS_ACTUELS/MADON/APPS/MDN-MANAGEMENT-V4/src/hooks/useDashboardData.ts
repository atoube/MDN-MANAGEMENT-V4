import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { DashboardStats } from '../types';
import { DATABASE_VIEWS } from '../constants/database';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [
        { data: employeeStats },
        { data: salesStats },
        { data: deliveryStats },
        { data: financeStats }
      ] = await Promise.all([
                                      ]);

      return {
        employees: {
          total: employeeStats?.[0]?.total || 0,
          active: employeeStats?.[0]?.active || 0,
          onLeave: employeeStats?.[0]?.on_leave || 0,
          byDepartment: employeeStats?.[0]?.by_department || {}
        },
        sales: {
          total: salesStats?.[0]?.total || 0,
          monthly: salesStats?.[0]?.monthly || 0,
          bySeller: salesStats?.[0]?.by_seller || {}
        },
        deliveries: {
          pending: deliveryStats?.[0]?.pending || 0,
          completed: deliveryStats?.[0]?.completed || 0,
          byZone: deliveryStats?.[0]?.by_zone || {}
        },
        finances: {
          revenue: financeStats?.[0]?.revenue || 0,
          expenses: financeStats?.[0]?.expenses || 0,
          profit: financeStats?.[0]?.profit || 0
        }
      };
    }
  });
} 