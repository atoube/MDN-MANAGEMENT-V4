import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface TaskPermission {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  canValidate: boolean;
  canCreateSprint: boolean;
  canManageSprint: boolean;
}

export function useTaskPermissions() {
  const { user } = useAuth();

  const permissions = useMemo((): TaskPermission => {
    if (!user) {
      return {
        canView: false,
        canEdit: false,
        canDelete: false,
        canAssign: false,
        canValidate: false,
        canCreateSprint: false,
        canManageSprint: false,
      };
    }

    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    const isHR = user.role === 'hr';
    const isEmployee = user.role === 'employee';

    return {
      canView: true, // Tous les utilisateurs connectés peuvent voir les tâches
      canEdit: isAdmin || isManager || isHR, // Admins, managers et RH peuvent modifier
      canDelete: isAdmin || isManager, // Seuls admins et managers peuvent supprimer
      canAssign: isAdmin || isManager || isHR, // Admins, managers et RH peuvent assigner
      canValidate: isAdmin || isManager, // Seuls admins et managers peuvent valider
      canCreateSprint: isAdmin || isManager, // Seuls admins et managers peuvent créer des sprints
      canManageSprint: isAdmin || isManager, // Seuls admins et managers peuvent gérer les sprints
    };
  }, [user]);

  // Fonction pour vérifier si un utilisateur peut voir une tâche spécifique
  const canViewTask = (task: any): boolean => {
    if (!user) return false;
    
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    const isHR = user.role === 'hr';
    
    // Admins, managers et RH voient toutes les tâches
    if (isAdmin || isManager || isHR) return true;
    
    // Les employés voient seulement leurs tâches assignées ou créées
    const userId = user.id.toString();
    return task.assigned_to === userId || task.created_by === userId;
  };

  // Fonction pour vérifier si un utilisateur peut modifier une tâche spécifique
  const canEditTask = (task: any): boolean => {
    if (!user) return false;
    
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    const isHR = user.role === 'hr';
    
    // Admins, managers et RH peuvent modifier toutes les tâches
    if (isAdmin || isManager || isHR) return true;
    
    // Les employés peuvent modifier seulement leurs tâches créées
    const userId = user.id.toString();
    return task.created_by === userId;
  };

  // Fonction pour vérifier si un utilisateur peut valider une tâche en révision
  const canValidateTask = (task: any): boolean => {
    if (!user) return false;
    
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    
    // Seuls admins et managers peuvent valider
    if (!isAdmin && !isManager) return false;
    
    // La tâche doit être en statut "review"
    return task.status === 'review';
  };

  // Fonction pour vérifier si un utilisateur peut voir les tâches d'un sprint
  const canViewSprintTasks = (sprint: any): boolean => {
    if (!user) return false;
    
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    
    // Admins et managers voient tous les sprints
    if (isAdmin || isManager) return true;
    
    // Les employés voient tous les sprints actifs (selon la demande)
    return sprint.status === 'active';
  };

  return {
    permissions,
    canViewTask,
    canEditTask,
    canValidateTask,
    canViewSprintTasks,
  };
}
