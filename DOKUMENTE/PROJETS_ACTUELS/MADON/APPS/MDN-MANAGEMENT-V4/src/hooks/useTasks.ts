import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types';
import { useEmployees } from './useEmployees';
import { useAuth } from '../contexts/AuthContext';
import { useTaskPermissions } from './useTaskPermissions';
import { useNotifications } from './useNotifications';
import { useGamification } from './useGamification';
import { useComments } from './useComments';

export function useTasks(projectId: string) {
  const queryClient = useQueryClient();
  const [localTasks, setLocalTasks] = useState<any[]>([]);
  const { employees = [] } = useEmployees();
  const { user } = useAuth();
  const { canViewTask, canEditTask, canValidateTask } = useTaskPermissions();
  const { createTaskAssignedNotification, createNotification } = useNotifications();
  const { updateUserStats } = useGamification();
  const { createComment } = useComments();

  // Fonction pour sauvegarder les tâches dans localStorage
  const saveTasksToLocalStorage = (tasksToSave: any[]) => {
    try {
      localStorage.setItem(`tasks-${projectId}`, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches dans localStorage:', error);
    }
  };

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      try {
        // Essayer de récupérer les données depuis l'API Netlify
        const response = await fetch(`/.netlify/functions/tasks?projectId=${projectId}`);
        if (response.ok) {
          return await response.json();
        }
        throw new Error('API non disponible');
      } catch (error) {
        console.log('API non disponible, utilisation des données mockées');
        // Fallback vers les données mockées si l'API n'est pas disponible
        const mockTasks = [
          {
            id: '1',
            title: 'Design Interface',
            description: 'Créer le design de l\'interface utilisateur',
            status: 'in_progress',
            priority: 'high',
            project_id: projectId,
            created_by: '1',
            due_date: '2024-03-20',
            created_at: '2024-03-01T10:00:00Z',
            updated_at: '2024-03-15T14:30:00Z',
            assigned_to: '1',
            assigned_user: {
              id: '1',
              first_name: 'Jean',
              last_name: 'Dupont',
              email: 'jean.dupont@example.com'
            },
            creator: {
              id: '1',
              first_name: 'Jean',
              last_name: 'Dupont',
              email: 'jean.dupont@example.com'
            }
          },
          {
            id: '2',
            title: 'Développement Frontend',
            description: 'Développer l\'interface frontend de l\'application',
            status: 'todo',
            priority: 'high',
            project_id: projectId,
            created_by: '2',
            due_date: '2024-03-25',
            created_at: '2024-03-05T09:00:00Z',
            updated_at: '2024-03-05T09:00:00Z',
            assigned_to: '2',
            assigned_user: {
              id: '2',
              first_name: 'Marie',
              last_name: 'Martin',
              email: 'marie.martin@example.com'
            },
            creator: {
              id: '2',
              first_name: 'Marie',
              last_name: 'Martin',
              email: 'marie.martin@example.com'
            }
          },
          {
            id: '3',
            title: 'Tests Utilisateurs',
            description: 'Effectuer les tests utilisateurs de l\'application',
            status: 'todo',
            priority: 'medium',
            project_id: projectId,
            created_by: '1',
            due_date: '2024-03-30',
            created_at: '2024-03-10T14:00:00Z',
            updated_at: '2024-03-10T14:00:00Z',
            assigned_to: '3',
            assigned_user: {
              id: '3',
              first_name: 'Pierre',
              last_name: 'Durand',
              email: 'pierre.durand@example.com'
            },
            creator: {
              id: '1',
              first_name: 'Jean',
              last_name: 'Dupont',
              email: 'jean.dupont@example.com'
            }
          },
          {
            id: '4',
            title: 'Étude de Marché',
            description: 'Analyser le marché et la concurrence',
            status: 'done',
            priority: 'high',
            project_id: projectId,
            created_by: '2',
            due_date: '2024-03-15',
            created_at: '2024-02-28T08:00:00Z',
            updated_at: '2024-03-15T16:00:00Z',
            assigned_to: '2',
            assigned_user: {
              id: '2',
              first_name: 'Marie',
              last_name: 'Martin',
              email: 'marie.martin@example.com'
            },
            creator: {
              id: '2',
              first_name: 'Marie',
              last_name: 'Martin',
              email: 'marie.martin@example.com'
            }
          },
          {
            id: '5',
            title: 'Gestion des Tâches',
            description: 'Gérer et organiser les tâches du projet',
            status: 'in_progress',
            priority: 'high',
            project_id: projectId,
            created_by: '1',
            due_date: '2024-03-28',
            created_at: '2024-03-12T10:00:00Z',
            updated_at: '2024-03-12T10:00:00Z',
            assigned_to: '9',
            assigned_user: {
              id: '9',
              first_name: 'Ahmadou',
              last_name: 'Dipita',
              email: 'a.dipita@themadon.com'
            },
            creator: {
              id: '1',
              first_name: 'Jean',
              last_name: 'Dupont',
              email: 'jean.dupont@example.com'
            }
          },
          {
            id: '6',
            title: 'Rapport de Progression',
            description: 'Préparer le rapport de progression hebdomadaire',
            status: 'todo',
            priority: 'medium',
            project_id: projectId,
            created_by: '2',
            due_date: '2024-03-22',
            created_at: '2024-03-14T09:00:00Z',
            updated_at: '2024-03-14T09:00:00Z',
            assigned_to: '9',
            assigned_user: {
              id: '9',
              first_name: 'Ahmadou',
              last_name: 'Dipita',
              email: 'a.dipita@themadon.com'
            },
            creator: {
              id: '2',
              first_name: 'Marie',
              last_name: 'Martin',
              email: 'marie.martin@example.com'
            }
          },
          {
            id: '5',
            title: 'Plan Marketing',
            description: 'Élaborer la stratégie marketing',
            status: 'in_progress',
            priority: 'high',
            project_id: projectId,
            created_by: '1',
            due_date: '2024-03-28',
            created_at: '2024-03-08T11:00:00Z',
            updated_at: '2024-03-12T15:30:00Z',
            assigned_to: '4',
            assigned_user: {
              id: '4',
              first_name: 'Sophie',
              last_name: 'Leroy',
              email: 'sophie.leroy@example.com'
            },
            creator: {
              id: '1',
              first_name: 'Jean',
              last_name: 'Dupont',
              email: 'jean.dupont@example.com'
            }
          }
        ];
        
        return mockTasks;
      }
    }
  });

  // Synchroniser les tâches locales avec les tâches de la query
  useEffect(() => {
    if (tasks) {
      // Charger les tâches persistées depuis localStorage
      const savedTasks = localStorage.getItem(`tasks-${projectId}`);
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          setLocalTasks(parsedTasks);
        } catch (error) {
          console.error('Erreur lors du chargement des tâches depuis localStorage:', error);
          setLocalTasks(tasks);
        }
      } else {
        setLocalTasks(tasks);
      }
    }
  }, [tasks, projectId]);

  // Fonction pour créer une notification de création de tâche
  const createTaskCreatedNotification = (taskTitle: string, creatorName: string) => {
    createNotification({
      type: 'task_created',
      title: 'Nouvelle tâche créée',
      message: `Vous avez créé la tâche "${taskTitle}"`,
      userId: user?.id.toString() || '1',
      metadata: {
        taskTitle,
        creatorName,
        timestamp: new Date().toISOString()
      }
    });
  };

  // Fonction pour mettre à jour les métriques (sans dépendance circulaire)
  const updateTaskMetrics = (task: any) => {
    // Sauvegarder les métriques directement dans localStorage
    try {
      const existingMetrics = JSON.parse(localStorage.getItem('taskMetrics') || '[]');
      const newMetric = {
        type: 'task_created',
        userId: user?.id.toString() || '1',
        data: {
          taskId: task.id,
          taskTitle: task.title,
          priority: task.priority,
          assignedTo: task.assigned_to,
          timestamp: new Date().toISOString()
        }
      };
      existingMetrics.push(newMetric);
      localStorage.setItem('taskMetrics', JSON.stringify(existingMetrics));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des métriques:', error);
    }
  };

  // Fonction pour mettre à jour la gamification
  const updateGamificationPoints = (userId: string, action: string, points: number) => {
    // Mettre à jour les statistiques de l'utilisateur
    updateUserStats(userId, {
      tasksCreated: 1, // Incrémenter le nombre de tâches créées
      lastActivity: new Date().toISOString()
    });
  };

  // Fonction pour créer un commentaire sur une tâche
  const createTaskComment = (taskId: string, commentText: string, userId: string) => {
    try {
      // Trouver le nom de l'utilisateur
      console.log('Recherche utilisateur dans useTasks:', { userId, employees: employees.map(emp => ({ id: emp.id, name: `${emp.first_name} ${emp.last_name}` })) });
      
      const userEmployee = employees.find(emp => 
        emp.id.toString() === userId || 
        emp.id === userId ||
        emp.id === parseInt(userId)
      );
      
      console.log('Employé trouvé dans useTasks:', userEmployee);
      
      const userName = userEmployee ? `${userEmployee.first_name} ${userEmployee.last_name}` : 'Utilisateur inconnu';
      
      const newComment = {
        id: Date.now().toString(),
        taskId: taskId,
        userId: userId,
        userName: userName,
        content: commentText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false
      };
      
      // Utiliser le hook useComments pour créer le commentaire
      createComment.mutate(newComment);
      
      // Mettre à jour les métriques pour les commentaires
      const commentMetrics = JSON.parse(localStorage.getItem('commentMetrics') || '[]');
      commentMetrics.push({
        type: 'comment_created',
        userId: userId,
        taskId: taskId,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('commentMetrics', JSON.stringify(commentMetrics));
      
      console.log('Commentaire créé:', newComment);
    } catch (error) {
      console.error('Erreur lors de la création du commentaire:', error);
    }
  };

  const createTask = useMutation({
    mutationFn: async (task: any) => {
      // Trouver l'employé créateur
      const creatorEmployee = employees.find(emp => emp.id.toString() === user?.id.toString());
      
      // Mock creation - simule la création d'une tâche
      const newTask = {
        id: Date.now().toString(),
        ...task,
        status: task.status || 'todo', // S'assurer qu'il y a un statut
        created_by: user?.id.toString() || '1', // Utiliser l'ID de l'utilisateur connecté
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Ajouter les propriétés manquantes pour l'affichage
        assigned_name: task.assigned_user ? `${task.assigned_user.first_name} ${task.assigned_user.last_name}` : 'Non assigné',
        creator_name: creatorEmployee ? `${creatorEmployee.first_name} ${creatorEmployee.last_name}` : 'Utilisateur inconnu',
        creator: creatorEmployee ? {
          id: creatorEmployee.id.toString(),
          first_name: creatorEmployee.first_name,
          last_name: creatorEmployee.last_name,
          email: creatorEmployee.email
        } : undefined,
        attachments: task.attachments || []
      };
      
      console.log('Tâche créée (mock):', newTask);
      
      // Ajouter la tâche à l'état local immédiatement
      setLocalTasks(prev => {
        const exists = prev.find(t => t.id === newTask.id);
        if (exists) return prev;
        const updatedTasks = [...prev, newTask];
        saveTasksToLocalStorage(updatedTasks);
        return updatedTasks;
      });

      // Créer une notification pour la création de tâche
      if (newTask.assigned_to) {
        const assignedEmployee = employees.find(emp => emp.id.toString() === newTask.assigned_to);
        if (assignedEmployee) {
          if (newTask.assigned_to !== user?.id.toString()) {
            // Notification pour quelqu'un d'autre
            createTaskAssignedNotification(
              newTask.title,
              user?.name || 'Utilisateur',
              `${assignedEmployee.first_name} ${assignedEmployee.last_name}`
            );
          } else {
            // Notification pour l'utilisateur qui crée sa propre tâche
            createTaskCreatedNotification(
              newTask.title,
              user?.name || 'Utilisateur'
            );
          }
        }
      } else {
        // Notification pour une tâche non assignée
        createTaskCreatedNotification(
          newTask.title,
          user?.name || 'Utilisateur'
        );
      }

      // Traiter les commentaires si présents
      if (task.comments && task.comments.trim()) {
        createTaskComment(newTask.id, task.comments, user?.id.toString() || '1');
      }

      // Mettre à jour les métriques
      updateTaskMetrics(newTask);
      
      // Mettre à jour la gamification
      updateGamificationPoints(user?.id.toString() || '1', 'task_created', 10);
      
      return newTask;
    },
    onSuccess: () => {
      // Ne pas invalider les queries pour éviter de remplacer les tâches locales
      // queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    }
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      // Mock update - simule la mise à jour d'une tâche
      console.log(`Mise à jour de la tâche ${id}:`, updates);
      
      // Mettre à jour la tâche dans l'état local
      setLocalTasks(prev => {
        const updatedTasks = prev.map(task => 
          task.id === id 
            ? { 
                ...task, 
                ...updates, 
                updated_at: new Date().toISOString(),
                // Ajouter les propriétés manquantes pour l'affichage
                assigned_name: updates.assigned_to ? 
                  (() => {
                    // Récupérer le nom de l'employé depuis la liste des employés
                    const employee = employees.find(emp => emp.id.toString() === updates.assigned_to);
                    return employee ? `${employee.first_name} ${employee.last_name}` : 'Employé inconnu';
                  })() : (updates.assigned_to === '' ? 'Non assigné' : task.assigned_name),
                creator_name: task.creator_name || 'Utilisateur inconnu'
              }
            : task
        );
        saveTasksToLocalStorage(updatedTasks);
        return updatedTasks;
      });
      
      return {
        id,
        ...updates,
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      // Ne pas invalider les queries pour éviter de remplacer les tâches locales
      // queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      // Mock delete - simule la suppression d'une tâche
      console.log(`Suppression de la tâche ${id}`);
      
      // Supprimer la tâche de l'état local
      setLocalTasks(prev => {
        const updatedTasks = prev.filter(task => task.id !== id);
        saveTasksToLocalStorage(updatedTasks);
        return updatedTasks;
      });
      
      return { id };
    },
    onSuccess: () => {
      // Ne pas invalider les queries pour éviter de remplacer les tâches locales
      // queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    }
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
      // Mock update - simule la mise à jour d'une tâche
      console.log(`Mise à jour de la tâche ${id} avec le statut: ${status}`);
      
      // Mettre à jour la tâche dans l'état local
      setLocalTasks(prev => {
        const updatedTasks = prev.map(task => 
          task.id === id 
            ? { 
                ...task, 
                status, 
                updated_at: new Date().toISOString()
              }
            : task
        );
        saveTasksToLocalStorage(updatedTasks);
        return updatedTasks;
      });
      
      return {
        id,
        status,
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      // Ne pas invalider les queries pour éviter de remplacer les tâches locales
      // queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    }
  });

  // Filtrer les tâches selon les permissions de l'utilisateur
  const getFilteredTasks = useCallback(() => {
    if (!user) return [];
    
    return localTasks.filter(task => canViewTask(task));
  }, [localTasks, user, canViewTask]);

  // Obtenir les tâches assignées à l'utilisateur connecté
  const getMyTasks = useCallback(() => {
    if (!user) return [];
    
    const userId = user.id.toString();
    return localTasks.filter(task => 
      task.assigned_to === userId || task.created_by === userId
    );
  }, [localTasks, user]);

  // Obtenir les tâches créées par l'utilisateur connecté
  const getMyCreatedTasks = useCallback(() => {
    if (!user) return [];
    
    const userId = user.id.toString();
    return localTasks.filter(task => task.created_by === userId);
  }, [localTasks, user]);

  // Obtenir les tâches en attente de validation
  const getTasksForReview = useCallback(() => {
    if (!user) return [];
    
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    
    // Seuls admins et managers peuvent voir les tâches en révision
    if (!isAdmin && !isManager) return [];
    
    return localTasks.filter(task => task.status === 'review');
  }, [localTasks, user]);

  // Valider une tâche en révision
  const validateTask = useCallback((taskId: string, approved: boolean) => {
    if (!user) return;
    
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    
    if (!isAdmin && !isManager) {
      throw new Error('Vous n\'avez pas les permissions pour valider cette tâche');
    }

    const task = localTasks.find(t => t.id === taskId);
    if (!task || task.status !== 'review') {
      throw new Error('Cette tâche ne peut pas être validée');
    }

    const newStatus = approved ? 'completed' : 'in_progress';
    
    setLocalTasks(prevTasks => {
      const updatedTasks = prevTasks.map(t =>
        t.id === taskId
          ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
          : t
      );
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });

    console.log(`✅ Tâche ${approved ? 'approuvée' : 'rejetée'}:`, taskId);
  }, [localTasks, user]);

  return {
    tasks: localTasks,
    filteredTasks: getFilteredTasks(),
    myTasks: getMyTasks(),
    myCreatedTasks: getMyCreatedTasks(),
    tasksForReview: getTasksForReview(),
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    validateTask,
    canViewTask,
    canEditTask,
    canValidateTask
  };
}