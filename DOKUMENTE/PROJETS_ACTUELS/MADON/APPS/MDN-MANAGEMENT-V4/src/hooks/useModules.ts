import { useState, useEffect } from 'react';

export interface Module {
  id: number;
  name: string;
  path: string;
  icon: string;
  enabled: boolean;
  order_index: number;
  created_at: string;
}

export function useModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data pour les modules
        const mockModules: Module[] = [
          {
            id: 1,
            name: 'Tableau de Bord',
            path: '/dashboard',
            icon: 'LayoutDashboard',
            enabled: true,
            order_index: 1,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 2,
            name: 'Projets',
            path: '/projects',
            icon: 'Package',
            enabled: true,
            order_index: 2,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 3,
            name: 'Employés',
            path: '/employees',
            icon: 'Users',
            enabled: true,
            order_index: 3,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 4,
            name: 'Ventes',
            path: '/sales',
            icon: 'DollarSign',
            enabled: true,
            order_index: 4,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 5,
            name: 'Vendeurs',
            path: '/sellers',
            icon: 'Store',
            enabled: true,
            order_index: 5,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 6,
            name: 'Livraisons',
            path: '/deliveries',
            icon: 'Truck',
            enabled: true,
            order_index: 6,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 7,
            name: 'Stocks',
            path: '/stocks',
            icon: 'Package',
            enabled: true,
            order_index: 7,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 8,
            name: 'Finance',
            path: '/finance',
            icon: 'DollarSign',
            enabled: true,
            order_index: 8,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 9,
            name: 'Tâches',
            path: '/tasks',
            icon: 'ClipboardList',
            enabled: true,
            order_index: 9,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 10,
            name: 'Marketing',
            path: '/marketing',
            icon: 'Share2',
            enabled: true,
            order_index: 10,
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: 11,
            name: 'Achats',
            path: '/purchases',
            icon: 'ShoppingCart',
            enabled: true,
            order_index: 11,
            created_at: '2024-01-01T10:00:00Z'
          }
        ];
        
        setModules(mockModules);
      } catch (err) {
        setError('Erreur lors du chargement des modules');
        console.error('Erreur useModules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return { modules, loading, error };
}