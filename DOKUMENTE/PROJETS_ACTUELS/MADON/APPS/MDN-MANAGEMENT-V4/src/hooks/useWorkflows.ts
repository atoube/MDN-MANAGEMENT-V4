import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  executionCount: number;
  lastExecuted?: string;
}

export interface WorkflowTrigger {
  type: 'task_created' | 'task_updated' | 'task_completed' | 'task_assigned' | 'comment_added' | 'time_logged' | 'status_changed';
  conditions?: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
}

export interface WorkflowAction {
  type: 'assign_task' | 'change_status' | 'add_tag' | 'remove_tag' | 'set_priority' | 'set_due_date' | 'send_notification' | 'create_subtask' | 'add_comment';
  parameters: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  taskId: string;
  executedAt: string;
  status: 'success' | 'failed' | 'partial';
  actionsExecuted: string[];
  errorMessage?: string;
}

export function useWorkflows() {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setIsLoading] = useState(false);

  // Charger les workflows depuis localStorage
  useEffect(() => {
    const savedWorkflows = localStorage.getItem('workflows');
    const savedExecutions = localStorage.getItem('workflowExecutions');
    
    if (savedWorkflows) {
      try {
        const parsedWorkflows = JSON.parse(savedWorkflows);
        setWorkflows(parsedWorkflows);
      } catch (error) {
        console.error('Erreur lors du chargement des workflows:', error);
      }
    } else {
      // Créer des workflows de démonstration
      const demoWorkflows: WorkflowRule[] = [
        {
          id: 'workflow-1',
          name: 'Auto-assignation des bugs urgents',
          description: 'Assigne automatiquement les bugs urgents à l\'équipe de support',
          trigger: {
            type: 'task_created',
            conditions: { priority: 'urgent' }
          },
          conditions: [
            { field: 'title', operator: 'contains', value: 'bug' },
            { field: 'priority', operator: 'equals', value: 'urgent' }
          ],
          actions: [
            { type: 'assign_task', parameters: { userId: '2' } }, // Admin System
            { type: 'add_tag', parameters: { tag: 'urgent' } },
            { type: 'send_notification', parameters: { message: 'Bug urgent assigné automatiquement' } }
          ],
          isActive: true,
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionCount: 0
        },
        {
          id: 'workflow-2',
          name: 'Validation automatique des tâches terminées',
          description: 'Marque automatiquement les tâches comme terminées après validation',
          trigger: {
            type: 'status_changed',
            conditions: { newStatus: 'review' }
          },
          conditions: [
            { field: 'status', operator: 'equals', value: 'review' },
            { field: 'assigned_to', operator: 'is_not_empty', value: null }
          ],
          actions: [
            { type: 'change_status', parameters: { status: 'completed' } },
            { type: 'add_comment', parameters: { comment: 'Tâche validée automatiquement par le workflow' } }
          ],
          isActive: true,
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionCount: 0
        },
        {
          id: 'workflow-3',
          name: 'Rappel d\'échéance',
          description: 'Envoie une notification quand une tâche approche de son échéance',
          trigger: {
            type: 'time_logged',
            conditions: { hoursBeforeDue: 24 }
          },
          conditions: [
            { field: 'due_date', operator: 'is_not_empty', value: null },
            { field: 'status', operator: 'not_equals', value: 'completed' }
          ],
          actions: [
            { type: 'send_notification', parameters: { message: 'Tâche approchant de son échéance' } },
            { type: 'set_priority', parameters: { priority: 'high' } }
          ],
          isActive: true,
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionCount: 0
        },
        {
          id: 'workflow-4',
          name: 'Création de sous-tâches pour les features',
          description: 'Crée automatiquement des sous-tâches pour les nouvelles fonctionnalités',
          trigger: {
            type: 'task_created',
            conditions: { category: 'feature' }
          },
          conditions: [
            { field: 'title', operator: 'contains', value: 'feature' },
            { field: 'priority', operator: 'equals', value: 'high' }
          ],
          actions: [
            { type: 'create_subtask', parameters: { title: 'Analyse des exigences', description: 'Analyser et documenter les exigences' } },
            { type: 'create_subtask', parameters: { title: 'Conception technique', description: 'Créer la conception technique' } },
            { type: 'create_subtask', parameters: { title: 'Développement', description: 'Développer la fonctionnalité' } },
            { type: 'create_subtask', parameters: { title: 'Tests', description: 'Tester la fonctionnalité' } }
          ],
          isActive: true,
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionCount: 0
        },
        {
          id: 'workflow-5',
          name: 'Archivage automatique',
          description: 'Archive automatiquement les tâches terminées après 30 jours',
          trigger: {
            type: 'task_completed',
            conditions: { daysSinceCompletion: 30 }
          },
          conditions: [
            { field: 'status', operator: 'equals', value: 'completed' },
            { field: 'updated_at', operator: 'less_than', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          actions: [
            { type: 'change_status', parameters: { status: 'archived' } },
            { type: 'add_tag', parameters: { tag: 'archived' } }
          ],
          isActive: false, // Désactivé par défaut
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionCount: 0
        }
      ];
      
      setWorkflows(demoWorkflows);
      localStorage.setItem('workflows', JSON.stringify(demoWorkflows));
    }

    if (savedExecutions) {
      try {
        const parsedExecutions = JSON.parse(savedExecutions);
        setExecutions(parsedExecutions);
      } catch (error) {
        console.error('Erreur lors du chargement des exécutions:', error);
      }
    }
  }, []);

  // Sauvegarder les workflows
  const saveWorkflows = useCallback((newWorkflows: WorkflowRule[]) => {
    localStorage.setItem('workflows', JSON.stringify(newWorkflows));
    setWorkflows(newWorkflows);
  }, []);

  // Sauvegarder les exécutions
  const saveExecutions = useCallback((newExecutions: WorkflowExecution[]) => {
    localStorage.setItem('workflowExecutions', JSON.stringify(newExecutions));
    setExecutions(newExecutions);
  }, []);

  // Créer un nouveau workflow
  const createWorkflow = useCallback((workflowData: Omit<WorkflowRule, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'executionCount'>) => {
    if (!user) return;

    const newWorkflow: WorkflowRule = {
      ...workflowData,
      id: `workflow-${Date.now()}`,
      createdBy: user.id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 0
    };

    const updatedWorkflows = [...workflows, newWorkflow];
    saveWorkflows(updatedWorkflows);
    
    console.log('✅ Workflow créé:', newWorkflow.name);
    return newWorkflow;
  }, [workflows, saveWorkflows, user]);

  // Mettre à jour un workflow
  const updateWorkflow = useCallback((workflowId: string, updates: Partial<WorkflowRule>) => {
    const updatedWorkflows = workflows.map(workflow =>
      workflow.id === workflowId
        ? { ...workflow, ...updates, updatedAt: new Date().toISOString() }
        : workflow
    );
    
    saveWorkflows(updatedWorkflows);
    console.log('✅ Workflow mis à jour:', workflowId);
  }, [workflows, saveWorkflows]);

  // Supprimer un workflow
  const deleteWorkflow = useCallback((workflowId: string) => {
    const updatedWorkflows = workflows.filter(workflow => workflow.id !== workflowId);
    saveWorkflows(updatedWorkflows);
    console.log('✅ Workflow supprimé:', workflowId);
  }, [workflows, saveWorkflows]);

  // Activer/Désactiver un workflow
  const toggleWorkflow = useCallback((workflowId: string) => {
    const updatedWorkflows = workflows.map(workflow =>
      workflow.id === workflowId
        ? { ...workflow, isActive: !workflow.isActive, updatedAt: new Date().toISOString() }
        : workflow
    );
    
    saveWorkflows(updatedWorkflows);
    console.log('✅ Workflow togglé:', workflowId);
  }, [workflows, saveWorkflows]);

  // Exécuter un workflow
  const executeWorkflow = useCallback((workflowId: string, taskId: string, context: Record<string, any> = {}) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow || !workflow.isActive) return;

    const execution: WorkflowExecution = {
      id: `execution-${Date.now()}`,
      workflowId,
      taskId,
      executedAt: new Date().toISOString(),
      status: 'success',
      actionsExecuted: []
    };

    try {
      // Vérifier les conditions
      const conditionsMet = workflow.conditions.every(condition => {
        const fieldValue = context[condition.field];
        
        switch (condition.operator) {
          case 'equals':
            return fieldValue === condition.value;
          case 'not_equals':
            return fieldValue !== condition.value;
          case 'contains':
            return fieldValue && fieldValue.toString().toLowerCase().includes(condition.value.toLowerCase());
          case 'greater_than':
            return fieldValue > condition.value;
          case 'less_than':
            return fieldValue < condition.value;
          case 'is_empty':
            return !fieldValue || fieldValue === '';
          case 'is_not_empty':
            return fieldValue && fieldValue !== '';
          default:
            return false;
        }
      });

      if (conditionsMet) {
        // Exécuter les actions
        workflow.actions.forEach(action => {
          try {
            // Simuler l'exécution de l'action
            console.log(`Exécution de l'action: ${action.type}`, action.parameters);
            execution.actionsExecuted.push(action.type);
          } catch (error) {
            console.error(`Erreur lors de l'exécution de l'action ${action.type}:`, error);
            execution.status = 'partial';
          }
        });

        // Mettre à jour le compteur d'exécution
        const updatedWorkflows = workflows.map(w =>
          w.id === workflowId
            ? { ...w, executionCount: w.executionCount + 1, lastExecuted: execution.executedAt }
            : w
        );
        saveWorkflows(updatedWorkflows);
      } else {
        execution.status = 'failed';
        execution.errorMessage = 'Conditions non remplies';
      }
    } catch (error) {
      execution.status = 'failed';
      execution.errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    }

    // Sauvegarder l'exécution
    const updatedExecutions = [...executions, execution];
    saveExecutions(updatedExecutions);

    console.log('✅ Workflow exécuté:', workflowId, execution.status);
    return execution;
  }, [workflows, executions, saveWorkflows, saveExecutions]);

  // Obtenir les workflows actifs
  const getActiveWorkflows = useCallback(() => {
    return workflows.filter(workflow => workflow.isActive);
  }, [workflows]);

  // Obtenir les exécutions d'un workflow
  const getWorkflowExecutions = useCallback((workflowId: string) => {
    return executions.filter(execution => execution.executionId === workflowId);
  }, [executions]);

  // Obtenir les statistiques des workflows
  const getWorkflowStats = useCallback(() => {
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.isActive).length;
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'success').length;
    const failedExecutions = executions.filter(e => e.status === 'failed').length;

    return {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0
    };
  }, [workflows, executions]);

  // Rechercher des workflows
  const searchWorkflows = useCallback((query: string) => {
    if (!query.trim()) return workflows;
    
    return workflows.filter(workflow =>
      workflow.name.toLowerCase().includes(query.toLowerCase()) ||
      workflow.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [workflows]);

  return {
    workflows,
    executions,
    loading,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
    executeWorkflow,
    getActiveWorkflows,
    getWorkflowExecutions,
    getWorkflowStats,
    searchWorkflows
  };
}
