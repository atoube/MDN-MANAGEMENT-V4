import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types/task';

export const useGeneralTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['generalTasks'],
    queryFn: async () => {
      // Mock data pour les tâches générales avec contexte camerounais
      const data = [
        {
          id: '1',
          title: 'Réunion équipe MDN',
          description: 'Réunion hebdomadaire de l\'équipe MDN Management',
          status: 'todo',
          priority: 'medium',
          project_id: null,
          created_by: 'user1',
          due_date: '2024-03-22',
          created_at: '2024-03-15T10:00:00Z',
          updated_at: '2024-03-15T10:00:00Z',
          assigned_user: {
            id: 'user1',
            first_name: 'Ahmadou',
            last_name: 'Bello'
          }
        },
        {
          id: '2',
          title: 'Formation sécurité informatique',
          description: 'Formation sur la sécurité informatique pour l\'équipe',
          status: 'in_progress',
          priority: 'high',
          project_id: null,
          created_by: 'user2',
          due_date: '2024-03-25',
          created_at: '2024-03-10T09:00:00Z',
          updated_at: '2024-03-18T14:30:00Z',
          assigned_user: {
            id: 'user2',
            first_name: 'Fatou',
            last_name: 'Ndiaye'
          }
        },
        {
          id: '3',
          title: 'Préparation présentation clients',
          description: 'Préparer la présentation pour les clients camerounais',
          status: 'todo',
          priority: 'high',
          project_id: null,
          created_by: 'user3',
          due_date: '2024-03-20',
          created_at: '2024-03-16T14:00:00Z',
          updated_at: '2024-03-16T14:00:00Z',
          assigned_user: {
            id: 'user3',
            first_name: 'Kouassi',
            last_name: 'Mensah'
          }
        },
        {
          id: '4',
          title: 'Maintenance serveurs',
          description: 'Maintenance préventive des serveurs de production',
          status: 'completed',
          priority: 'medium',
          project_id: null,
          created_by: 'user1',
          due_date: '2024-03-18',
          created_at: '2024-03-12T08:00:00Z',
          updated_at: '2024-03-18T16:00:00Z',
          assigned_user: {
            id: 'user1',
            first_name: 'Ahmadou',
            last_name: 'Bello'
          }
        },
        {
          id: '5',
          title: 'Audit sécurité réseau',
          description: 'Audit de sécurité du réseau d\'entreprise',
          status: 'in_progress',
          priority: 'urgent',
          project_id: null,
          created_by: 'user2',
          due_date: '2024-03-28',
          created_at: '2024-03-14T11:30:00Z',
          updated_at: '2024-03-19T15:45:00Z',
          assigned_user: {
            id: 'user2',
            first_name: 'Fatou',
            last_name: 'Ndiaye'
          }
        }
      ];

      return data as unknown as Task[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock insert operation
      const data = {
        id: Date.now().toString(),
        ...newTask,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalTasks'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      // Mock update operation
      const data = {
        id,
        ...updates,
        updated_at: new Date().toISOString()
      };

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalTasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      // Mock delete operation
      console.log(`Suppression de la tâche ${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalTasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}; 