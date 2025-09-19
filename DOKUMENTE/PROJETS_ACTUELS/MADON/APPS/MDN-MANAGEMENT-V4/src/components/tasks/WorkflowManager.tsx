import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Workflow, 
  Plus, 
  Search,
  Edit3,
  Trash2,
  Play,
  Pause,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useWorkflows } from '../../hooks/useWorkflows';
import { useAuth } from '../../contexts/AuthContext';

export function WorkflowManager() {
  const { user } = useAuth();
  const {
    workflows,
    executions,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
    getWorkflowStats,
    searchWorkflows
  } = useWorkflows();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Formulaire de création/édition
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: {
      type: 'task_created' as 'task_created' | 'task_updated' | 'task_completed' | 'task_assigned' | 'comment_added' | 'time_logged' | 'status_changed',
      conditions: {}
    },
    conditions: [] as Array<{ field: string; operator: string; value: any }>,
    actions: [] as Array<{ type: string; parameters: Record<string, any> }>,
    isActive: true
  });

  const stats = getWorkflowStats();
  const filteredWorkflows = React.useMemo(() => {
    let filtered = searchQuery ? searchWorkflows(searchQuery) : workflows;
    
    if (showActiveOnly) {
      filtered = filtered.filter(workflow => workflow.isActive);
    }
    
    return filtered;
  }, [workflows, searchQuery, showActiveOnly, searchWorkflows]);

  const getTriggerLabel = (type: string) => {
    const labels: Record<string, string> = {
      'task_created': 'Tâche créée',
      'task_updated': 'Tâche mise à jour',
      'task_completed': 'Tâche terminée',
      'task_assigned': 'Tâche assignée',
      'comment_added': 'Commentaire ajouté',
      'time_logged': 'Temps enregistré',
      'status_changed': 'Statut changé'
    };
    return labels[type] || type;
  };

  const getActionLabel = (type: string) => {
    const labels: Record<string, string> = {
      'assign_task': 'Assigner la tâche',
      'change_status': 'Changer le statut',
      'add_tag': 'Ajouter un tag',
      'remove_tag': 'Retirer un tag',
      'set_priority': 'Définir la priorité',
      'set_due_date': 'Définir l\'échéance',
      'send_notification': 'Envoyer une notification',
      'create_subtask': 'Créer une sous-tâche',
      'add_comment': 'Ajouter un commentaire'
    };
    return labels[type] || type;
  };

  const handleCreateWorkflow = () => {
    if (!formData.name.trim()) return;

    const workflowData = {
      ...formData,
      trigger: formData.trigger,
      conditions: formData.conditions.filter(condition => condition.field && condition.operator),
      actions: formData.actions.filter(action => action.type)
    };

    createWorkflow(workflowData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      trigger: { type: 'task_created', conditions: {} },
      conditions: [],
      actions: [],
      isActive: true
    });
    setIsCreating(false);
  };

  const handleEditWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      setFormData({
        name: workflow.name,
        description: workflow.description,
        trigger: workflow.trigger,
        conditions: workflow.conditions,
        actions: workflow.actions,
        isActive: workflow.isActive
      });
      setEditingWorkflow(workflowId);
      setIsCreating(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editingWorkflow || !formData.name.trim()) return;

    const updates = {
      ...formData,
      trigger: formData.trigger,
      conditions: formData.conditions.filter(condition => condition.field && condition.operator),
      actions: formData.actions.filter(action => action.type)
    };

    updateWorkflow(editingWorkflow, updates);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      trigger: { type: 'task_created', conditions: {} },
      conditions: [],
      actions: [],
      isActive: true
    });
    setEditingWorkflow(null);
    setIsCreating(false);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow && confirm(`Êtes-vous sûr de vouloir supprimer le workflow "${workflow.name}" ?`)) {
      deleteWorkflow(workflowId);
    }
  };

  const handleToggleWorkflow = (workflowId: string) => {
    toggleWorkflow(workflowId);
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: 'equals', value: '' }]
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'assign_task', parameters: {} }]
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const cancelForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger: { type: 'task_created', conditions: {} },
      conditions: [],
      actions: [],
      isActive: true
    });
    setEditingWorkflow(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Workflows</h2>
          <p className="text-gray-600">Automatisez vos processus de travail avec des règles intelligentes</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Workflow
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Workflow className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total workflows</p>
                <p className="text-lg font-semibold">{stats.totalWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-lg font-semibold">{stats.activeWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Exécutions</p>
                <p className="text-lg font-semibold">{stats.totalExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Réussies</p>
                <p className="text-lg font-semibold">{stats.successfulExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Échouées</p>
                <p className="text-lg font-semibold">{stats.failedExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de création/édition */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingWorkflow ? 'Modifier le workflow' : 'Créer un nouveau workflow'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du workflow *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Auto-assignation des bugs urgents"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Déclencheur
                </label>
                <select
                  value={formData.trigger.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    trigger: { ...prev.trigger, type: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="task_created">Tâche créée</option>
                  <option value="task_updated">Tâche mise à jour</option>
                  <option value="task_completed">Tâche terminée</option>
                  <option value="task_assigned">Tâche assignée</option>
                  <option value="comment_added">Commentaire ajouté</option>
                  <option value="time_logged">Temps enregistré</option>
                  <option value="status_changed">Statut changé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du workflow..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Conditions
                </label>
                <Button size="sm" onClick={addCondition}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <select
                      value={condition.field}
                      onChange={(e) => updateCondition(index, 'field', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Champ</option>
                      <option value="title">Titre</option>
                      <option value="priority">Priorité</option>
                      <option value="status">Statut</option>
                      <option value="assigned_to">Assigné à</option>
                      <option value="due_date">Échéance</option>
                    </select>
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="equals">Égal à</option>
                      <option value="not_equals">Différent de</option>
                      <option value="contains">Contient</option>
                      <option value="greater_than">Supérieur à</option>
                      <option value="less_than">Inférieur à</option>
                      <option value="is_empty">Est vide</option>
                      <option value="is_not_empty">N'est pas vide</option>
                    </select>
                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      placeholder="Valeur"
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Actions
                </label>
                <Button size="sm" onClick={addAction}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {formData.actions.map((action, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <select
                      value={action.type}
                      onChange={(e) => updateAction(index, 'type', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="assign_task">Assigner la tâche</option>
                      <option value="change_status">Changer le statut</option>
                      <option value="add_tag">Ajouter un tag</option>
                      <option value="remove_tag">Retirer un tag</option>
                      <option value="set_priority">Définir la priorité</option>
                      <option value="set_due_date">Définir l'échéance</option>
                      <option value="send_notification">Envoyer une notification</option>
                      <option value="create_subtask">Créer une sous-tâche</option>
                      <option value="add_comment">Ajouter un commentaire</option>
                    </select>
                    <Input
                      value={JSON.stringify(action.parameters)}
                      onChange={(e) => {
                        try {
                          const params = JSON.parse(e.target.value);
                          updateAction(index, 'parameters', params);
                        } catch {
                          // Ignore invalid JSON
                        }
                      }}
                      placeholder='{"key": "value"}'
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAction(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Workflow actif
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingWorkflow ? handleSaveEdit : handleCreateWorkflow}>
                {editingWorkflow ? 'Sauvegarder' : 'Créer le workflow'}
              </Button>
              <Button variant="outline" onClick={cancelForm}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un workflow..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant={showActiveOnly ? "default" : "outline"}
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className="flex items-center gap-2"
            >
              {showActiveOnly ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              Actifs seulement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les workflows ({filteredWorkflows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWorkflows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Workflow className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Aucun workflow trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkflows.map((workflow) => (
                <div key={workflow.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                          <Badge variant={workflow.isActive ? "default" : "secondary"}>
                            {workflow.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{workflow.description}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleWorkflow(workflow.id)}
                        >
                          {workflow.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditWorkflow(workflow.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Déclencheur:</span>
                        <span className="ml-1 text-gray-600">{getTriggerLabel(workflow.trigger.type)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Conditions:</span>
                        <span className="ml-1 text-gray-600">{workflow.conditions.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Actions:</span>
                        <span className="ml-1 text-gray-600">{workflow.actions.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Exécuté {workflow.executionCount} fois</span>
                      <span>Créé le {new Date(workflow.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
