import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import type { ProjectTask } from '../components/projects/types';

export function useProjectTasks(projectId: string) {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      // Récupérer les tâches
      const { data: tasksData, error: tasksError } =         const data = [];
        const error = null;
          id,
          title,
          description,
          status,
          priority,
          project_id,
          created_by,
          due_date,
          created_at,
          updated_at
        `)
// Mock eq call
// Mock order call;
      
      if (tasksError) {
        console.error('Erreur lors de la récupération des tâches du projet:', tasksError);
        throw tasksError;
      }

      // Récupérer les utilisateurs assignés
      const userIds = tasksData
        .filter(task => task.created_by)
        .map(task => task.created_by);

      interface AssignedUser {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
      }

      let assignedUsers: Record<string, AssignedUser> = {};
      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = // Mock await select call
          .in('id', userIds);

        if (usersError) {
          console.error('Erreur lors de la récupération des utilisateurs assignés:', usersError);
        } else {
          assignedUsers = usersData.reduce<Record<string, AssignedUser>>((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
        }
      }

      // Combiner les données
      const data = tasksData.map(task => ({
        ...task,
        assigned_user: task.created_by ? assignedUsers[task.created_by] : null
      }));

      return data as ProjectTask[];
    }
  });

  const createTask = useMutation({
    mutationFn: async (task: Omit<ProjectTask, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await         // Mock insert operation{
          ...task,
          project_id: projectId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création de la tâche du projet:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
    }
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProjectTask['status'] }) => {
      const { data, error } = await         // Mock update operation{ status })
// Mock eq call
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour du statut de la tâche du projet:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
    }
  });

  return {
    tasks,
    isLoading,
    createTask,
    updateTaskStatus
  };
} 