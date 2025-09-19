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
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useEmployees } from '../hooks/useEmployees';
import { useTaskPermissions } from '../hooks/useTaskPermissions';
import { ScrumView } from '../components/tasks/ScrumView';
import { TaskModal } from '../components/tasks/TaskModal';
import { ColumnConfigModal } from '../components/tasks/ColumnConfigModal';
import { SprintModal } from '../components/tasks/SprintModal';
import { FileViewer } from '../components/tasks/FileViewer';
// import type { Task } from '../types'; // Non utilisé pour l'instant

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
  assigned_name?: string;
  creator_name?: string;
  story_points?: number;
  attachments?: string[];
  assigned_to?: string;
  start_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  sprint_id?: string;
}

interface Sprint {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export default function Tasks() {
  const { user } = useAuth();
  const [view, setView] = useState<'kanban' | 'scrum' | 'archives'>('kanban');
  const [selectedTask, setSelectedTask] = useState<TaskFromHook | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
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
    { id: 'done', name: 'Terminé', color: 'bg-green-100' },
    { id: 'backlog', name: 'Backlog', color: 'bg-purple-100' }
  ], []);
  const sprints: Sprint[] = [];
  const loading = isLoading || employeesLoading;
  
  // const updateTask = useCallback(() => {}, []); // Non utilisé pour l'instant
  // const deleteTask = useCallback(() => {}, []); // Non utilisé pour l'instant
  const getCompletedTasks = useCallback(() => [], []);
  const exportTasksToPDF = useCallback(() => {}, []);
  const addColumn = useCallback(() => {}, []);
  const addSprint = useCallback(() => {}, []);

  // Filtrer les tâches selon la vue et l'utilisateur
  const filteredTasks = useMemo(() => {
    let filtered = tasks || [];

    // Dans la vue KANBAN, ne montrer que les tâches assignées à l'utilisateur connecté
    if (view === 'kanban' && user) {
      console.log('🔍 Filtrage KANBAN pour utilisateur:', user.id, user.first_name, user.last_name);
      console.log('📋 Tâches avant filtrage:', filtered.length);
      
      filtered = filtered.filter(task => {
        console.log('🔍 Vérification tâche:', task.title, {
          'task.assigned_to': task.assigned_to,
          'task.assigned_user?.id': task.assigned_user?.id,
          'user.id': user.id,
          'user.id.toString()': user.id.toString(),
          'task.assigned_name': task.assigned_name,
          'user.first_name': user.first_name,
          'user.last_name': user.last_name
        });
        
        const isAssignedToUser = 
          task.assigned_to === user.id || 
          task.assigned_to === user.id.toString() ||
          task.assigned_user?.id === user.id ||
          task.assigned_user?.id === user.id.toString() ||
          (task.assigned_name && user.first_name && user.last_name && 
           task.assigned_name.toLowerCase().includes(user.first_name.toLowerCase()) &&
           task.assigned_name.toLowerCase().includes(user.last_name.toLowerCase()));
        
        if (isAssignedToUser) {
          console.log('✅ Tâche assignée trouvée:', task.title, 'assigned_to:', task.assigned_to, 'assigned_user.id:', task.assigned_user?.id);
        } else {
          console.log('❌ Tâche non assignée à cet utilisateur:', task.title);
        }
        
        return isAssignedToUser;
      });
      
      console.log('📋 Tâches après filtrage KANBAN:', filtered.length);
    }

    // Dans la vue Scrum, montrer toutes les tâches du sprint
    if (view === 'scrum') {
      console.log('🔍 Vue SCRUM - Affichage de toutes les tâches:', filtered.length);
      // Pour l'instant, on ne filtre pas par sprint car la propriété n'existe pas dans le type Task
      // filtered reste inchangé - montrer toutes les tâches
    }

    // Dans la vue Archives, montrer toutes les tâches terminées
    if (view === 'archives') {
      filtered = filtered.filter(task => task.status === 'done');
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrer par priorité
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Filtrer par assignation
    if (assignedFilter !== 'all') {
      filtered = filtered.filter(task => task.assigned_user?.id === assignedFilter);
    }

    return filtered;
  }, [tasks, view, user, currentSprint, searchTerm, priorityFilter, assignedFilter]);

  // Grouper les tâches par colonne
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, TaskFromHook[]> = {};
    columns.forEach(column => {
      grouped[column.id] = filteredTasks.filter(task => task.status === column.id);
    });
    return grouped;
  }, [filteredTasks, columns]);

  // Fonctions utilitaires
  const getFileIcon = (filename: string) => {
    if (filename.includes('.pdf')) return <FileText className="h-3 w-3 text-red-500" />;
    if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) return <Image className="h-3 w-3 text-blue-500" />;
    return <File className="h-3 w-3 text-gray-500" />;
  };

  const getTaskLifetime = (task: TaskFromHook) => {
    const start = new Date(task.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${diffDays}j`;
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
    return <Badge className={variants[priority] || variants.medium}>{priority}</Badge>;
  };

  // Gestion du drag & drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id.toString() === taskId);
    
    if (task && task.status !== columnId) {
      // Pour l'instant, on ne peut pas mettre à jour car updateTask n'est pas implémenté
      console.log('Task dropped:', taskId, 'to column:', columnId);
    }
  };

  // Gestion des tâches
  const handleCreateTask = async (taskData: Partial<TaskFromHook>) => {
    try {
      await createTask.mutateAsync({
        title: taskData.title || '',
        description: taskData.description || '',
        status: 'todo',
        priority: taskData.priority || 'medium',
        created_by: user?.id?.toString() || '1',
        project_id: 'default-project',
        due_date: taskData.due_date || ''
      });
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TaskFromHook>) => {
    try {
      await updateTask.mutateAsync({ id: taskId, updates });
      setIsEditMode(false);
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTask.mutateAsync(taskId);
        // Fermer le modal si c'est la tâche actuellement ouverte
        if (selectedTask?.id === taskId) {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
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

  const handleExportPDF = () => {
    // const tasksToExport = view === 'archives' ? getCompletedTasks() : tasks; // Non utilisé pour l'instant
    exportTasksToPDF();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des tâches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tâches</h1>
          <p className="text-gray-600">Kanban configurable, vue Scrum et archives</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsColumnModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurer Colonnes
          </Button>
          {view === 'scrum' && (
            <Button variant="outline" onClick={() => setIsSprintModalOpen(true)}>
              <Target className="h-4 w-4 mr-2" />
              Gérer Sprints
            </Button>
          )}
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button onClick={() => {
            setSelectedTask(null);
            setIsEditMode(false);
            setIsTaskModalOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Tâche
          </Button>
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
                      placeholder="Rechercher des tâches..."
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

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {columns.map(column => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.name}</h3>
                  <Badge variant="secondary">{tasksByColumn[column.id]?.length || 0}</Badge>
                </div>
                
                <div
                  className="min-h-[500px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200"
                  onDrop={(e) => handleDrop(e, column.id)}
                  onDragOver={handleDragOver}
                >
                  {tasksByColumn[column.id]?.map(task => (
                    <Card
                      key={task.id}
                      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => handleViewDetails(task)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {task.assigned_name || 'Non assigné'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                {getTaskLifetime(task)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Créé par: {task.creator_name}
                              </span>
                            </div>
                            
                            {/* Fichiers attachés */}
                            {task.attachments && task.attachments.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Paperclip className="h-3 w-3" />
                                <span>{task.attachments.length} fichier(s)</span>
                                <div className="flex gap-1">
                                  {task.attachments.slice(0, 3).map((attachment, index) => (
                                    <div key={index} className="flex items-center">
                                      {getFileIcon(attachment)}
                                    </div>
                                  ))}
                                  {task.attachments.length > 3 && (
                                    <span className="text-xs">+{task.attachments.length - 3}</span>
                                  )}
                                </div>
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
                            
                            {task.story_points && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <BarChart3 className="h-3 w-3" />
                                {task.story_points} SP
                              </div>
                            )}
                          </div>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher dans le sprint..."
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

          {/* Scrum Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {columns.filter(col => col.id !== 'backlog').map(column => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.name}</h3>
                  <Badge variant="secondary">{tasksByColumn[column.id]?.length || 0}</Badge>
                </div>
                
                <div
                  className="min-h-[400px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200"
                  onDrop={(e) => handleDrop(e, column.id)}
                  onDragOver={handleDragOver}
                >
                  {tasksByColumn[column.id]?.map(task => (
                    <Card
                      key={task.id}
                      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => handleViewDetails(task)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {task.assigned_name || 'Non assigné'}
                              </span>
                              {task.story_points && (
                                <span className="flex items-center gap-1">
                                  <BarChart3 className="h-3 w-3" />
                                  {task.story_points} SP
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Créé par: {task.creator_name}
                              </span>
                            </div>
                            
                            {/* Fichiers attachés */}
                            {task.attachments && task.attachments.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Paperclip className="h-3 w-3" />
                                <span>{task.attachments.length} fichier(s)</span>
                                <div className="flex gap-1">
                                  {task.attachments.slice(0, 3).map((attachment, index) => (
                                    <div key={index} className="flex items-center">
                                      {getFileIcon(attachment)}
                                    </div>
                                  ))}
                                  {task.attachments.length > 3 && (
                                    <span className="text-xs">+{task.attachments.length - 3}</span>
                                  )}
                                </div>
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
                {getCompletedTasks().length} tâches terminées au total
              </p>
            </CardContent>
          </Card>

          {/* Filtres Archives */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher dans les archives..."
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

          {/* Liste des tâches archivées */}
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewDetails(task)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        {getPriorityBadge(task.priority)}
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Terminé
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Assigné à:</span> {task.assigned_name || 'Non assigné'}
                        </div>
                        <div>
                          <span className="font-medium">Créé par:</span> {task.creator_name}
                        </div>
                        <div>
                          <span className="font-medium">Terminé le:</span> {new Date(task.updated_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Durée:</span> {task.actual_hours || 0}h
                        </div>
                      </div>
                      
                      {/* Fichiers attachés dans la vue Archives */}
                      {task.attachments && task.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <FileViewer files={task.attachments} />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune tâche terminée trouvée</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Tâche */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
          setIsEditMode(false);
        }}
        task={selectedTask}
        employees={employees}
        columns={columns}
        sprints={sprints}
        currentSprint={currentSprint}
        view={view}
        isEditMode={isEditMode}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />

      {/* Modal Configuration Colonnes */}
      <ColumnConfigModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        onAddColumn={addColumn}
      />

      {/* Modal Gestion Sprints */}
      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        sprints={sprints}
        onAddSprint={addSprint}
        onSetCurrentSprint={setCurrentSprint}
        currentSprint={currentSprint}
      />
    </div>
  );
}