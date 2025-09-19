import { useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';

export function useModuleSync() {
  const queryClient = useQueryClient();

  const syncModules = async (changes: {
    module: string;
    action: 'create' | 'update' | 'delete';
    data: any;
  }) => {
    try {
      switch (changes.module) {
        case 'employees':
          // Synchroniser avec tous les modules affectés
          await Promise.all([
            // Mise à jour des projets
            updateProjectAssignments(changes.data),
            // Mise à jour des livraisons
            updateDeliveryAssignments(changes.data),
            // Mise à jour des ventes
            updateSalesAssignments(changes.data),
            // Mise à jour des salaires
            updateSalaryInformation(changes.data)
          ]);
          break;

        case 'absences':
          // Impact sur la planification
          await Promise.all([
            updateProjectSchedule(changes.data),
            updateDeliverySchedule(changes.data),
            updateSalesSchedule(changes.data)
          ]);
          break;

        case 'salaries':
          // Impact sur la comptabilité
          await Promise.all([
            updateAccountingRecords(changes.data),
            updateDGIDeclarations(changes.data),
            updateFinancialReports(changes.data)
          ]);
          break;
      }

      // Invalider les caches appropriés
      invalidateRelatedQueries(changes.module);

    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      throw error;
    }
  };

  const invalidateRelatedQueries = (module: string) => {
    const relatedModules = getRelatedModules(module);
    relatedModules.forEach(mod => {
      queryClient.invalidateQueries({ queryKey: [mod] });
    });
  };

  return { syncModules };
}

// Fonctions utilitaires pour la synchronisation
function getRelatedModules(module: string): string[] {
  const moduleRelations: Record<string, string[]> = {
    employees: ['projects', 'deliveries', 'sales', 'salaries', 'marketing'],
    absences: ['employees', 'projects', 'deliveries', 'sales', 'salaries'],
    salaries: ['employees', 'finances', 'accounting', 'dgi-declarations'],
    projects: ['employees', 'finances', 'marketing'],
    stocks: ['deliveries', 'sales', 'finances'],
    marketing: ['sales', 'finances', 'projects']
  };

  return moduleRelations[module] || [];
} 