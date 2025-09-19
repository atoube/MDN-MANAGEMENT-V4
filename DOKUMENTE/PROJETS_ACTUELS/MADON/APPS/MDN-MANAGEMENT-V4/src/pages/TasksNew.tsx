import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Settings,
  Kanban,
  Target,
  Timer,
  BarChart3,
  Archive,
  Download,
  Paperclip,
  File,
  Image,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useEmployees } from '../hooks/useEmployees';
import { useTaskPermissions } from '../hooks/useTaskPermissions';
import { ScrumView } from '../components/tasks/ScrumView';
import { TaskModal } from '../components/tasks/TaskModal';
import { ColumnConfigModal } from '../components/tasks/ColumnConfigModal';
import { FileViewer } from '../components/tasks/FileViewer';
import { TaskCard } from '../components/tasks/TaskCard';

// Type spécifique pour les tâches retournées par useTasks
interface TaskFromHook {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_id: string;
  created_by: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  assigned_user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  attachments?: string[];
  story_points?: number;
}

export default function Tasks() {
  const { user } = useAuth();
  const [view, setView] = useState<'kanban' | 'scrum' | 'archives'>('kanban');
  const [selectedTask, setSelectedTask] = useState<TaskFromHook | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    tasks = [],
    filteredTasks = [],
    myTasks = [],
    myCreatedTasks = [],
    tasksForReview = [],
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    validateTask,
    canViewTask,
    canEditTask,
    canValidateTask
  } = useTasks('default-project');
  
  const { employees = [], loading: employeesLoading } = useEmployees();
  const { permissions } = useTaskPermissions();

  const columns = useMemo(() => [
    { id: 'todo', name: 'À faire', color: 'bg-gray-100' },
    { id: 'in_progress', name: 'En cours', color: 'bg-blue-100' },
    { id: 'review', name: 'En révision', color: 'bg-yellow-100' },
    { id: 'completed', name: 'Terminé', color: 'bg-green-100' }
  ], []);

  // Filtrer les tâches selon la vue et les filtres
  const displayTasks = useMemo(() => {
    let tasksToShow = filteredTasks;

    // Filtrer selon la vue
    switch (view) {
      case 'kanban':
        // En Kanban, les employés voient seulement leurs tâches
        if (user?.role === 'employee') {
          tasksToShow = myTasks;
        }
        break;
      case 'scrum':
        // En Scrum, tous voient les tâches des sprints actifs
        tasksToShow = filteredTasks;
        break;
      case 'archives':
        // Archives : seulement les tâches terminées
        tasksToShow = filteredTasks.filter(task => task.status === 'completed');
        break;
    }

    // Appliquer les filtres de recherche
    if (searchTerm) {
      tasksToShow = tasksToShow.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par priorité
    if (priorityFilter !== 'all') {
      tasksToShow = tasksToShow.filter(task => task.priority === priorityFilter);
    }

    // Filtrer par assignation
    if (assignedFilter !== 'all') {
      tasksToShow = tasksToShow.filter(task => task.assigned_to === assignedFilter);
    }

    return tasksToShow;
  }, [filteredTasks, myTasks, view, user, searchTerm, priorityFilter, assignedFilter]);

  // Grouper les tâches par colonne
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, TaskFromHook[]> = {};
    columns.forEach(column => {
      grouped[column.id] = displayTasks.filter(task => task.status === column.id);
    });
    return grouped;
  }, [displayTasks, columns]);

  // Fonctions utilitaires
  const getFileIcon = (filename: string) => {
    if (filename.includes('.pdf')) return <FileText className="h-3 w-3 text-red-500" />;
    if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) return <Image className="h-3 w-3 text-blue-500" />;
    return <File className="h-3 w-3 text-gray-500" />;
  };

  const getTimeRemaining = (task: TaskFromHook) => {
    if (!task.due_date) return null;
    const due = new Date(task.due_date);
    const now = new Date();
    const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'En retard', color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Aujourd\'hui', color: 'text-orange-600' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays}j restant`, color: 'text-yellow-600' };
    } else {
      return { text: `${diffDays}j restant`, color: 'text-green-600' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return variants[priority] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (task: TaskFromHook) => {
    setSelectedTask(task);
    setIsEditMode(false);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: TaskFromHook) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTask.mutateAsync(taskId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleValidateTask = async (taskId: string, approved: boolean) => {
    try {
      validateTask(taskId, approved);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    try {
      await updateTaskStatus.mutateAsync({ id: taskId, status: newStatus });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tâches</h1>
          <p className="text-gray-600">
            {view === 'kanban' && 'Tableau Kanban - Gestion des tâches par statut'}
            {view === 'scrum' && 'Vue Scrum - Gestion des sprints et tâches'}
            {view === 'archives' && 'Archives - Tâches terminées'}
          </p>
        </div>
        <div className="flex gap-2">
          {permissions.canEdit && (
            <Button
              onClick={() => {
                setSelectedTask(null);
                setIsEditMode(false);
                setIsTaskModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Tâche
            </Button>
          )}
        </div>
      </div>

      {/* Vue Kanban/Scrum/Archives */}
      <Tabs value={view} onValueChange={(value) => setView(value as 'kanban' | 'scrum' | 'archives')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kanban">
            <div className="flex items-center gap-2">
              <Kanban className="h-4 w-4" />
              Kanban
            </div>
          </TabsTrigger>
          <TabsTrigger value="scrum">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Scrum
            </div>
          </TabsTrigger>
          <TabsTrigger value="archives">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archives
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une tâche..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes priorités</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assigné à" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {employees.filter(emp => emp.id && emp.first_name && emp.last_name).map(emp => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.first_name} {emp.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map(column => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.name}</h3>
                  <Badge variant="secondary">{tasksByColumn[column.id]?.length || 0}</Badge>
                </div>
                
                <div
                  className={`min-h-[400px] rounded-lg p-4 border-2 border-dashed ${column.color} border-gray-200`}
                  onDrop={(e) => handleDrop(e, column.id)}
                  onDragOver={handleDragOver}
                >
                  {tasksByColumn[column.id]?.map(task => (
                    <Card
                      key={task.id}
                      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                      draggable={permissions.canEdit}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => handleViewDetails(task)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                              {task.title}
                            </h4>
                            <Badge className={getPriorityBadge(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-gray-600 line-clamp-3">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="space-y-2">
                            {task.assigned_user && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <User className="h-3 w-3" />
                                <span>{task.assigned_user.first_name} {task.assigned_user.last_name}</span>
                              </div>
                            )}
                            
                            {task.due_date && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Échéance
                                </span>
                                <span className={getTimeRemaining(task)?.color}>
                                  {getTimeRemaining(task)?.text}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions pour les tâches en révision */}
                          {task.status === 'review' && canValidateTask(task) && (
                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleValidateTask(task.id, true);
                                }}
                                className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleValidateTask(task.id, false);
                                }}
                                className="flex-1 text-xs text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Rejeter
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scrum" className="space-y-6">
          <ScrumView projectId="default-project" />
        </TabsContent>

        <TabsContent value="archives" className="space-y-6">
          {/* En-tête Archives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Archives - Tâches Terminées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {displayTasks.length} tâche(s) terminée(s) trouvée(s)
              </p>
            </CardContent>
          </Card>

          {/* Liste des tâches archivées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={permissions.canEdit ? handleEditTask : undefined}
                onDelete={permissions.canDelete ? handleDeleteTask : undefined}
                showActions={permissions.canEdit || permissions.canDelete}
              />
            ))}
          </div>

          {displayTasks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Archive className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Aucune tâche archivée</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={isEditMode ? updateTask.mutate : createTask.mutate}
          task={selectedTask}
          employees={employees}
          isEdit={isEditMode}
        />
      )}
      
      {isColumnModalOpen && (
        <ColumnConfigModal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          columns={columns}
        />
      )}
    </div>
  );
}
