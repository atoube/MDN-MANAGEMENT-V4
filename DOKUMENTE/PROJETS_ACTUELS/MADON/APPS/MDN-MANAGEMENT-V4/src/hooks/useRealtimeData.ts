import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { RealtimeChange } from '../types';

export function useRealtimeData() {
  const queryClient = useQueryClient();

  useEffect(() => {
          .on('postgres_changes', {
        event: '*',
        schema: 'public',
      }, (payload: RealtimeChange) => {
        // Toujours invalider les statistiques globales
        queryClient.invalidateQueries({ queryKey: ['global-stats'] });

        // Invalider les modules spécifiques
        switch (payload.table) {
          case 'employees':
          case 'employee_absences':
          case 'projects':
          case 'sales':
          case 'deliveries':
          case 'stocks':
          case 'marketing_activities':
          case 'finances':
            // Invalider le module spécifique
            queryClient.invalidateQueries({ queryKey: [payload.table] });
            // Invalider les modules liés
            getRelatedModules(payload.table).forEach(module => {
              queryClient.invalidateQueries({ queryKey: [module] });
            });
            break;
        }
      })
      .subscribe();

    return () => {
      // Simulated channel removal - using mock data
    };
  }, [queryClient]);
} 