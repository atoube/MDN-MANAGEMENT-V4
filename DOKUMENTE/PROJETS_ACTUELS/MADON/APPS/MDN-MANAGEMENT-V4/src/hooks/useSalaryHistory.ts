import { useQuery } from '@tanstack/react-query';

export function useSalaryHistory(employeeId: string) {
  return useQuery({
    queryKey: ['salary-history', employeeId],
    queryFn: async () => {
      // Mock data pour l'historique des salaires
      const data = [
        {
          id: '1',
          base_amount: 40000,
          bonuses: 5000,
          deductions: 2000,
          net_amount: 43000,
          effective_date: '2024-01-01',
          reason: 'Augmentation annuelle',
          created_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          base_amount: 38000,
          bonuses: 3000,
          deductions: 1800,
          net_amount: 39200,
          effective_date: '2023-01-01',
          reason: 'Augmentation annuelle',
          created_at: '2023-01-01T10:00:00Z'
        },
        {
          id: '3',
          base_amount: 35000,
          bonuses: 2000,
          deductions: 1600,
          net_amount: 35400,
          effective_date: '2022-01-01',
          reason: 'Embauche',
          created_at: '2022-01-01T10:00:00Z'
        }
      ];

      return data;
    }
  });
} 