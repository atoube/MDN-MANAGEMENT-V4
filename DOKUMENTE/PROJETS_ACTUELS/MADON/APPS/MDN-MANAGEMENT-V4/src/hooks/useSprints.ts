import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTaskPermissions } from './useTaskPermissions';

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tasks: string[]; // IDs des tâches dans le sprint
  goal?: string;
}

export function useSprints() {
  const { user } = useAuth();
  const { permissions } = useTaskPermissions();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les sprints depuis localStorage
  useEffect(() => {
    const savedSprints = localStorage.getItem('sprints');
    if (savedSprints) {
      try {
        const parsedSprints = JSON.parse(savedSprints);
        setSprints(parsedSprints);
      } catch (error) {
        console.error('Erreur lors du chargement des sprints:', error);
      }
    } else {
      // Créer des sprints de démonstration
      const demoSprints: Sprint[] = [
        {
          id: 'sprint-1',
          name: 'Sprint 1 - Interface Utilisateur',
          description: 'Développement de l\'interface utilisateur principale',
          startDate: '2024-03-01',
          endDate: '2024-03-15',
          status: 'completed',
          createdBy: '1',
          createdAt: '2024-02-25T10:00:00Z',
          updatedAt: '2024-03-15T18:00:00Z',
          tasks: ['1', '2', '3'],
          goal: 'Finaliser l\'interface utilisateur avec toutes les fonctionnalités de base'
        },
        {
          id: 'sprint-2',
          name: 'Sprint 2 - Gestion des Employés',
          description: 'Implémentation de la gestion complète des employés',
          startDate: '2024-03-16',
          endDate: '2024-03-30',
          status: 'active',
          createdBy: '1',
          createdAt: '2024-03-10T10:00:00Z',
          updatedAt: '2024-03-16T09:00:00Z',
          tasks: ['4', '5', '6', '7'],
          goal: 'Compléter le module de gestion des employés avec toutes les fonctionnalités'
        },
        {
          id: 'sprint-3',
          name: 'Sprint 3 - Notifications et Rapports',
          description: 'Système de notifications et génération de rapports',
          startDate: '2024-04-01',
          endDate: '2024-04-15',
          status: 'planning',
          createdBy: '1',
          createdAt: '2024-03-25T10:00:00Z',
          updatedAt: '2024-03-25T10:00:00Z',
          tasks: ['8', '9'],
          goal: 'Implémenter le système de notifications et les rapports avancés'
        }
      ];
      
      setSprints(demoSprints);
      localStorage.setItem('sprints', JSON.stringify(demoSprints));
    }
  }, []);

  // Sauvegarder les sprints dans localStorage
  const saveSprints = useCallback((newSprints: Sprint[]) => {
    localStorage.setItem('sprints', JSON.stringify(newSprints));
    setSprints(newSprints);
  }, []);

  // Créer un nouveau sprint
  const createSprint = useCallback((sprintData: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => {
    if (!permissions.canCreateSprint) {
      throw new Error('Vous n\'avez pas les permissions pour créer un sprint');
    }

    const newSprint: Sprint = {
      ...sprintData,
      id: `sprint-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: []
    };

    const updatedSprints = [...sprints, newSprint];
    saveSprints(updatedSprints);
    
    console.log('✅ Sprint créé:', newSprint.name);
    return newSprint;
  }, [sprints, saveSprints, permissions.canCreateSprint]);

  // Mettre à jour un sprint
  const updateSprint = useCallback((sprintId: string, updates: Partial<Sprint>) => {
    if (!permissions.canManageSprint) {
      throw new Error('Vous n\'avez pas les permissions pour modifier un sprint');
    }

    const updatedSprints = sprints.map(sprint =>
      sprint.id === sprintId
        ? { ...sprint, ...updates, updatedAt: new Date().toISOString() }
        : sprint
    );
    
    saveSprints(updatedSprints);
    console.log('✅ Sprint mis à jour:', sprintId);
  }, [sprints, saveSprints, permissions.canManageSprint]);

  // Supprimer un sprint
  const deleteSprint = useCallback((sprintId: string) => {
    if (!permissions.canManageSprint) {
      throw new Error('Vous n\'avez pas les permissions pour supprimer un sprint');
    }

    const updatedSprints = sprints.filter(sprint => sprint.id !== sprintId);
    saveSprints(updatedSprints);
    console.log('✅ Sprint supprimé:', sprintId);
  }, [sprints, saveSprints, permissions.canManageSprint]);

  // Ajouter une tâche à un sprint
  const addTaskToSprint = useCallback((sprintId: string, taskId: string) => {
    if (!permissions.canManageSprint) {
      throw new Error('Vous n\'avez pas les permissions pour gérer les tâches du sprint');
    }

    const updatedSprints = sprints.map(sprint =>
      sprint.id === sprintId
        ? { 
            ...sprint, 
            tasks: [...sprint.tasks, taskId],
            updatedAt: new Date().toISOString()
          }
        : sprint
    );
    
    saveSprints(updatedSprints);
    console.log('✅ Tâche ajoutée au sprint:', taskId, sprintId);
  }, [sprints, saveSprints, permissions.canManageSprint]);

  // Retirer une tâche d'un sprint
  const removeTaskFromSprint = useCallback((sprintId: string, taskId: string) => {
    if (!permissions.canManageSprint) {
      throw new Error('Vous n\'avez pas les permissions pour gérer les tâches du sprint');
    }

    const updatedSprints = sprints.map(sprint =>
      sprint.id === sprintId
        ? { 
            ...sprint, 
            tasks: sprint.tasks.filter(id => id !== taskId),
            updatedAt: new Date().toISOString()
          }
        : sprint
    );
    
    saveSprints(updatedSprints);
    console.log('✅ Tâche retirée du sprint:', taskId, sprintId);
  }, [sprints, saveSprints, permissions.canManageSprint]);

  // Filtrer les sprints selon les permissions
  const getVisibleSprints = useCallback(() => {
    if (!user) return [];
    
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    
    // Admins et managers voient tous les sprints
    if (isAdmin || isManager) return sprints;
    
    // Les employés voient tous les sprints actifs
    return sprints.filter(sprint => sprint.status === 'active');
  }, [sprints, user]);

  // Obtenir le sprint actif
  const getActiveSprint = useCallback(() => {
    return sprints.find(sprint => sprint.status === 'active');
  }, [sprints]);

  return {
    sprints,
    loading,
    createSprint,
    updateSprint,
    deleteSprint,
    addTaskToSprint,
    removeTaskFromSprint,
    getVisibleSprints,
    getActiveSprint,
  };
}
