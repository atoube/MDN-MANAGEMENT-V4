import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Trash2, Edit2, Save, X, Paperclip, File, Image, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useComments } from '../../hooks/useComments';
import { FileViewer } from './FileViewer';
import type { Task, Employee, Column, Sprint } from '../../types';

// Type étendu pour le formulaire
interface TaskFormData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  story_points?: number;
  sprint_id?: string;
  comments?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  employees: Employee[];
  columns: Column[];
  sprints: Sprint[];
  currentSprint: Sprint | null;
  view: 'kanban' | 'scrum' | 'archives';
  isEditMode: boolean;
  onCreateTask: (data: Partial<Task>) => void;
  onUpdateTask: (id: string, data: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export function TaskModal({
  isOpen,
  onClose,
  task,
  employees,
  columns,
  sprints,
  currentSprint,
  view,
  isEditMode,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask
}: TaskModalProps) {
  const { notifySuccess, notifyError } = useNotificationContext();
  const { user } = useAuth();
  const { comments } = useComments();
  const [formData, setFormData] = useState<TaskFormData>({});
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Fonction pour récupérer les commentaires de la tâche
  const getTaskComments = (taskId: string) => {
    return comments.filter(comment => comment.taskId === taskId);
  };

  // Fonction pour créer un commentaire sur une tâche
  const createTaskComment = (taskId: string, commentText: string, userId: string) => {
    try {
      // Trouver le nom de l'utilisateur
      console.log('Recherche utilisateur:', { userId, employees: employees.map(emp => ({ id: emp.id, name: `${emp.first_name} ${emp.last_name}` })) });
      
      const userEmployee = employees.find(emp => 
        emp.id.toString() === userId || 
        emp.id === userId ||
        emp.id === parseInt(userId)
      );
      
      console.log('Employé trouvé:', userEmployee);
      
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
      
      // Sauvegarder le commentaire dans localStorage
      const existingComments = JSON.parse(localStorage.getItem('taskComments') || '[]');
      existingComments.push(newComment);
      localStorage.setItem('taskComments', JSON.stringify(existingComments));
      
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
      
      // Vider le champ commentaires après sauvegarde
      setFormData(prev => ({ ...prev, comments: '' }));
      
    } catch (error) {
      console.error('Erreur lors de la création du commentaire:', error);
    }
  };

  // Fonctions utilitaires
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'todo': 'À faire',
      'in_progress': 'En cours',
      'review': 'En révision',
      'done': 'Terminé',
      'backlog': 'Backlog'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    if (isOpen) {
      if (task && isEditMode) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          assigned_to: task.assigned_to || task.assigned_user?.id || '',
          due_date: task.due_date || '',
          start_date: task.start_date || '',
          estimated_hours: task.estimated_hours || undefined,
          actual_hours: task.actual_hours || undefined,
          story_points: task.story_points || undefined,
          sprint_id: task.sprint_id || (view === 'scrum' ? currentSprint?.id : undefined),
          comments: ''
        });
      } else {
        // Réinitialiser le formulaire pour une nouvelle tâche
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          assigned_to: '',
          due_date: '',
          start_date: '',
          estimated_hours: undefined,
          actual_hours: undefined,
          story_points: undefined,
          sprint_id: view === 'scrum' ? currentSprint?.id : undefined,
          comments: ''
        });
      }
      // Réinitialiser les fichiers attachés
      setAttachedFiles([]);
    }
  }, [isOpen, task, view, currentSprint, isEditMode]);

  // Fonctions pour gérer les fichiers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) {
      toast.error('Le titre est obligatoire');
      notifyError('Le titre de la tâche est obligatoire.', 'Erreur de validation');
      return;
    }

    try {
      // Ajouter les fichiers attachés aux données de la tâche
      const taskData = {
        ...formData,
        attachments: attachedFiles.map(file => file.name)
      };

      if (task && isEditMode) {
        onUpdateTask(task.id, taskData);
        
        // Traiter les commentaires si présents lors de la mise à jour
        if (formData.comments && formData.comments.trim()) {
          console.log('Utilisateur connecté:', user);
          console.log('ID utilisateur:', user?.id);
          createTaskComment(task.id, formData.comments, user?.id?.toString() || '1');
        }
        
        notifySuccess(`Tâche "${formData.title}" mise à jour avec succès.`, 'Tâche modifiée');
      } else {
        // Pour une nouvelle tâche, ajouter automatiquement le créateur
        const newTaskData = {
          ...taskData,
          created_by: user?.id?.toString() || '1'
        };
        console.log('TaskModal: Appel de onCreateTask avec:', newTaskData);
        console.log('Utilisateur connecté pour nouvelle tâche:', user);
        onCreateTask(newTaskData);
        const assignedEmployee = employees.find(emp => emp.id.toString() === formData.assigned_to);
        const assigneeText = assignedEmployee ? ` assignée à ${assignedEmployee.first_name} ${assignedEmployee.last_name}` : '';
        const attachmentText = attachedFiles.length > 0 ? ` avec ${attachedFiles.length} fichier(s) attaché(s)` : '';
        notifySuccess(`Tâche "${formData.title}" créée avec succès${assigneeText}${attachmentText}.`, 'Tâche créée');
      }
    } catch (error) {
      notifyError('Une erreur est survenue lors de la sauvegarde de la tâche.', 'Erreur de sauvegarde');
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      backlog: { label: 'Backlog', className: 'bg-gray-100 text-gray-800' },
      todo: { label: 'À faire', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'En cours', className: 'bg-orange-100 text-orange-800' },
      review: { label: 'En révision', className: 'bg-purple-100 text-purple-800' },
      done: { label: 'Terminé', className: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isEditMode ? 'Modifier la Tâche' : (task ? 'Détails de la Tâche' : 'Nouvelle Tâche')}
            </DialogTitle>
            {!task && (
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle tâche.
              </DialogDescription>
            )}
            <div className="flex gap-2">
              {task && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditTask(task)}
                    disabled={isEditMode}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {!isEditMode && task ? (
          /* Mode Visualisation */
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Titre</Label>
                <p className="mt-1 text-base font-medium">{task?.title || 'Sans titre'}</p>
              </div>
              
              {task?.description && (
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Description</Label>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Priorité</Label>
                  <div className="mt-1">
                    {getPriorityBadge(task?.priority || 'medium')}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Statut</Label>
                  <p className="mt-1 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getStatusText(task?.status || '')}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Assigné à</Label>
                  <p className="mt-1 text-sm">{task?.assigned_name || 'Non assigné'}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Créé par</Label>
                  <p className="mt-1 text-sm">{task?.creator_name || 'Utilisateur inconnu'}</p>
                </div>
              </div>
            </div>

            {/* Dates et durées */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-800">Planification</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {task?.start_date && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Date de début</Label>
                    <p className="mt-1 text-sm">{new Date(task.start_date).toLocaleDateString()}</p>
                  </div>
                )}
                
                {task?.due_date && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Date limite</Label>
                    <p className="mt-1 text-sm">{new Date(task.due_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {task?.estimated_hours && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Heures estimées</Label>
                    <p className="mt-1 text-sm">{task.estimated_hours}h</p>
                  </div>
                )}
                
                {task?.actual_hours && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Heures réelles</Label>
                    <p className="mt-1 text-sm">{task.actual_hours}h</p>
                  </div>
                )}
                
                {task?.story_points && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Story Points</Label>
                    <p className="mt-1 text-sm">{task.story_points} pts</p>
                  </div>
                )}
              </div>
            </div>

            {/* Commentaires */}
            {task && getTaskComments(task.id).length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-800">Commentaires</h3>
                <div className="space-y-3">
                  {getTaskComments(task.id).map((comment) => (
                    <div key={comment.id} className="bg-white p-3 rounded border-l-4 border-green-400">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {comment.userId === user?.id ? 'Vous' : `Utilisateur ${comment.userId}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dates de création et modification */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-800">Historique</h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                {task?.created_at && (
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Créé le</Label>
                    <p>{new Date(task.created_at).toLocaleDateString()} à {new Date(task.created_at).toLocaleTimeString()}</p>
                  </div>
                )}
                
                {task?.updated_at && (
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Modifié le</Label>
                    <p>{new Date(task.updated_at).toLocaleDateString()} à {new Date(task.updated_at).toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Mode Édition */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Titre de la tâche"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description détaillée de la tâche"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="comments">Commentaires</Label>
              <Textarea
                id="comments"
                value={formData.comments || ''}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                placeholder="Ajoutez des commentaires ou notes sur cette tâche"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority || 'medium'}
                  onValueChange={(value) => handleInputChange('priority', value as Task['priority'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assigned_to">Assigné à</Label>
                <Select
                  value={formData.assigned_to || ''}
                  onValueChange={(value) => handleInputChange('assigned_to', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Non assigné</SelectItem>
                    {employees.filter(emp => emp.id && emp.first_name && emp.last_name).map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.first_name} {emp.last_name} ({emp.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Date de début</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="due_date">Date limite</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date || ''}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="estimated_hours">Heures estimées</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimated_hours || ''}
                  onChange={(e) => handleInputChange('estimated_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="actual_hours">Heures réelles</Label>
                <Input
                  id="actual_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.actual_hours || ''}
                  onChange={(e) => handleInputChange('actual_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="story_points">Story Points</Label>
                <Input
                  id="story_points"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.story_points || ''}
                  onChange={(e) => handleInputChange('story_points', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>
            </div>

            {view === 'scrum' && (
              <div>
                <Label htmlFor="sprint_id">Sprint</Label>
                <Select
                  value={formData.sprint_id || ''}
                  onValueChange={(value) => handleInputChange('sprint_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map(sprint => (
                      <SelectItem key={sprint.id} value={sprint.id}>
                        {sprint.name} ({new Date(sprint.start_date).toLocaleDateString('fr-FR')} - {new Date(sprint.end_date).toLocaleDateString('fr-FR')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Section des fichiers attachés */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="attachments">Fichiers attachés</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('attachments')?.click()}
                  className="w-full"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Ajouter des fichiers
                </Button>
              </div>
            </div>

            {/* Liste des fichiers attachés */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Fichiers sélectionnés ({attachedFiles.length})</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Informations de la tâche (si en mode édition) */}
          {task && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Informations de la tâche</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Statut:</span>
                  <div className="mt-1">{getStatusBadge(task.status)}</div>
                </div>
                <div>
                  <span className="font-medium">Priorité:</span>
                  <div className="mt-1">{getPriorityBadge(task.priority)}</div>
                </div>
                <div>
                  <span className="font-medium">Créé par:</span>
                  <div className="mt-1">{task.creator_name}</div>
                </div>
                <div>
                  <span className="font-medium">Créé le:</span>
                  <div className="mt-1">{new Date(task.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
                {task.assigned_name && (
                  <div>
                    <span className="font-medium">Assigné à:</span>
                    <div className="mt-1">{task.assigned_name}</div>
                  </div>
                )}
                {task.updated_at && (
                  <div>
                    <span className="font-medium">Modifié le:</span>
                    <div className="mt-1">{new Date(task.updated_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Sauvegarder' : 'Créer'}
            </Button>
          </div>
        </form>
        )}

        {/* Affichage des fichiers attachés (commun aux deux modes) */}
        {task && task.attachments && task.attachments.length > 0 && (
          <div className="border-t pt-4 mt-6">
            <FileViewer files={task.attachments} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
