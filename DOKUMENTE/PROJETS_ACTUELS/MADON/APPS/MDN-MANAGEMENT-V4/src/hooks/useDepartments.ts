import { useQuery } from '@tanstack/react-query';
import { Department } from '../types/department';

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      // Mock data pour les départements avec contexte camerounais
      const data = [
        {
          id: '1',
          name: 'Ressources Humaines',
          description: 'Gestion du personnel et des relations sociales',
          manager_id: 'user1',
          location: 'Douala, Cameroun',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Informatique et Digital',
          description: 'Développement et maintenance des systèmes informatiques',
          manager_id: 'user2',
          location: 'Douala, Cameroun',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '3',
          name: 'Marketing et Communication',
          description: 'Promotion et communication des produits et services',
          manager_id: 'user3',
          location: 'Yaoundé, Cameroun',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '4',
          name: 'Ventes et Relations Clients',
          description: 'Gestion des ventes et relations clients',
          manager_id: 'user4',
          location: 'Douala, Cameroun',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '5',
          name: 'Finance et Comptabilité',
          description: 'Gestion financière et comptabilité',
          manager_id: 'user5',
          location: 'Yaoundé, Cameroun',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '6',
          name: 'Logistique et Transport',
          description: 'Gestion de la logistique et des transports',
          manager_id: 'user6',
          location: 'Douala, Cameroun',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '7',
          name: 'Développement Commercial',
          description: 'Expansion commerciale et nouveaux marchés',
          manager_id: 'user7',
          location: 'Bafoussam, Cameroun',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        }
      ];

      return data as unknown as Department[];
    },
  });
} 