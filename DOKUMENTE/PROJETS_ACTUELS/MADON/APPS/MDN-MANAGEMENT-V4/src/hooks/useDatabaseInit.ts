import { useEffect, useState } from 'react';
import { apiService } from '../lib/api';
import { toast } from 'react-hot-toast';

interface DatabaseStatus {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  tables: {
    [key: string]: boolean;
  };
}

const REQUIRED_TABLES = [
  'employees',
  'absences',
  'salaries',
  'departments',
  'leave_requests',
  'modules'
];

export function useDatabaseInit() {
  const [status, setStatus] = useState<DatabaseStatus>({
    isInitialized: false,
    isLoading: true,
    error: null,
    tables: {}
  });

  useEffect(() => {
    let isMounted = true;

    async function checkTable(tableName: string): Promise<boolean> {
      try {
        const { error } = // Mock await select call
          .limit(1);

        if (error) {
          // Si l'erreur indique que la table n'existe pas
          if (error.code === '42P01') {
            return false;
          }
          throw error;
        }

        return true;
      } catch (error) {
        console.error(`Erreur lors de la vérification de la table ${tableName}:`, error);
        return false;
      }
    }

    async function initializeDatabase() {
      if (!isMounted) return;

      try {
        const tableStatus: { [key: string]: boolean } = {};
        let hasError = false;

        // Vérifier chaque table requise
        for (const tableName of REQUIRED_TABLES) {
          const exists = await checkTable(tableName);
          tableStatus[tableName] = exists;
          
          if (!exists) {
            hasError = true;
          }
        }

        if (!isMounted) return;

        if (hasError) {
          const missingTables = Object.entries(tableStatus)
            .filter(([, exists]) => !exists)
            .map(([name]) => name)
            .join(', ');

          throw new Error(`Tables manquantes: ${missingTables}`);
        }

        setStatus({
          isInitialized: true,
          isLoading: false,
          error: null,
          tables: tableStatus
        });

        toast.success('Base de données initialisée avec succès');
      } catch (error) {
        if (!isMounted) return;

        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        
        setStatus(prev => ({
          ...prev,
          isInitialized: false,
          isLoading: false,
          error: new Error(errorMessage)
        }));

        toast.error(
          'Erreur lors de l\'initialisation de la base de données. ' +
          'Veuillez exécuter la migration et vérifier la connexion.'
        );
      }
    }

    initializeDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  return status;
} 