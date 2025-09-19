import { useState, useEffect } from 'react';

interface RailwayConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}

interface ConnectionStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useRailwayConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const [config] = useState<RailwayConfig>({
    host: import.meta.env.VITE_RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
    port: parseInt(import.meta.env.VITE_RAILWAY_DB_PORT || '26824'),
    user: import.meta.env.VITE_RAILWAY_DB_USER || 'root',
    password: import.meta.env.VITE_RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
    database: import.meta.env.VITE_RAILWAY_DB_NAME || 'railway',
    ssl: import.meta.env.VITE_RAILWAY_DB_SSL === 'true'
  });

  const testConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/.netlify/functions/test-connection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({
          isConnected: true,
          isLoading: false,
          error: null,
          lastChecked: new Date()
        });
        return data;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion inconnue';
      setStatus({
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date()
      });
      throw error;
    }
  };

  const getMockData = (endpoint: string) => {
    const mockData = {
      'employees': [
        {
          id: 1,
          first_name: 'Jean',
          last_name: 'Dupont',
          email: 'jean.dupont@madon.com',
          phone: '+33 1 23 45 67 89',
          position: 'Développeur Senior',
          department: 'IT',
          hire_date: '2022-01-15',
          salary: 55000,
          status: 'active' as const,
          created_at: '2022-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          first_name: 'Marie',
          last_name: 'Martin',
          email: 'marie.martin@madon.com',
          phone: '+33 1 23 45 67 90',
          position: 'Chef de Projet',
          department: 'Management',
          hire_date: '2021-03-20',
          salary: 65000,
          status: 'active' as const,
          created_at: '2021-03-20T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 3,
          first_name: 'Pierre',
          last_name: 'Durand',
          email: 'pierre.durand@madon.com',
          phone: '+33 1 23 45 67 91',
          position: 'Designer UX/UI',
          department: 'Design',
          hire_date: '2023-06-10',
          salary: 48000,
          status: 'active' as const,
          created_at: '2023-06-10T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ],
      'tasks': [
        {
          id: 1,
          title: 'Refonte de l\'interface utilisateur',
          description: 'Améliorer l\'expérience utilisateur de l\'application',
          status: 'in_progress' as const,
          priority: 'high' as const,
          assigned_to: 1,
          created_by: 2,
          due_date: '2024-12-31',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          title: 'Documentation technique',
          description: 'Rédiger la documentation pour les nouveaux développeurs',
          status: 'todo' as const,
          priority: 'medium' as const,
          assigned_to: 2,
          created_by: 1,
          due_date: '2024-12-15',
          created_at: '2024-01-05T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 3,
          title: 'Tests d\'intégration',
          description: 'Mettre en place les tests automatisés',
          status: 'completed' as const,
          priority: 'high' as const,
          assigned_to: 1,
          created_by: 2,
          due_date: '2024-01-10',
          completed_at: '2024-01-10T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        }
      ],
      'documents': [
        {
          id: 1,
          title: 'Guide d\'utilisation',
          description: 'Guide complet pour les utilisateurs',
          category: 'Documentation Technique',
          file_type: 'pdf',
          status: 'published' as const,
          uploaded_by: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          title: 'Politique de sécurité',
          description: 'Politique de sécurité de l\'entreprise',
          category: 'Procédures RH',
          file_type: 'docx',
          status: 'draft' as const,
          uploaded_by: 2,
          created_at: '2024-01-05T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ],
      'users': [
        {
          id: 1,
          email: 'admin@madon.com',
          first_name: 'Admin',
          last_name: 'MADON',
          role: 'admin',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ]
    };

    return mockData[endpoint as keyof typeof mockData] || [];
  };

  const executeQuery = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`/.netlify/functions/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        // API non disponible, utiliser des données mockées
        console.warn(`API ${endpoint} non disponible, utilisation des données mockées`);
        return getMockData(endpoint);
      } else {
        throw new Error(`Erreur API: ${response.status}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la requête ${endpoint}:`, error);
      // En cas d'erreur, retourner des données mockées
      console.warn(`Utilisation des données mockées pour ${endpoint}`);
      return getMockData(endpoint);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    ...status,
    config,
    testConnection,
    executeQuery
  };
};
