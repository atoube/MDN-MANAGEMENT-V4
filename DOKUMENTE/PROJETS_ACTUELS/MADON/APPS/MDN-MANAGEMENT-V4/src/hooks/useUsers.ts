import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import type { User } from '../types';

export function useUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Mock data
        const data = [];
        const error = null;
// Mock order call;
      
      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
      }
      return data as User[];
    }
  });

  return {
    users,
    isLoading
  };
} 