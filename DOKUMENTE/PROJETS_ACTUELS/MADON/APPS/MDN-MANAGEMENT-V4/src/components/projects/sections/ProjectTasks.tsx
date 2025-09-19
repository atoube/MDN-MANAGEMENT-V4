import { useState, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Project, Task, TaskPriority, TaskStatus, ProjectMember } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { DndContext, useSensor, useSensors, DragEndEvent, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { toast } from 'react-hot-toast';
import { Trash2, Edit2, Calendar, User, Filter, Search, BarChart2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

interface ProjectTasksProps {
  project: Project & {
    members?: ProjectMember[];
  };
}

const statusColumns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'À faire', color: 'bg-gray-50 border-gray-200' },
  { id: 'in_progress', title: 'En cours', color: 'bg-blue-50 border-blue-200' },
  { id: 'review', title: 'En révision', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'completed', title: 'Terminé', color: 'bg-green-50 border-green-200' }
];

const priorityOptions = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' }
];

export function ProjectTasks({ project }: ProjectTasksProps) {
  const queryClient = useQueryClient();
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string | 'all'>('all');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    due_date: '',
    project_id: project.id,
    created_by: '',
    assigned_to: null
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createTaskMutation = useMutation({
    mutationFn: async (task: Partial<Task>) => {
            if (!user) throw new Error('Utilisateur non authentifié');
// Mock from call
        .insert([{ ...task, created_by: user.id }])
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      setIsNewTaskDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
        due_date: '',
        project_id: project.id,
        created_by: '',
        assigned_to: null
      });
      toast.success('Tâche créée avec succès');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erreur lors de la création de la tâche';
      toast.error(message);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
// Mock from call
        .update(task)
// Mock eq call
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      setIsEditTaskDialogOpen(false);
      setSelectedTask(null);
      toast.success('Tâche mise à jour avec succès');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la tâche';
      toast.error(message);
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
// Mock from call
        .delete()
// Mock eq call;

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      toast.success('Tâche supprimée avec succès');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erreur lors de la suppression de la tâche';
      toast.error(message);
    }
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = project.tasks?.find((t: Task) => t.id === taskId);
    if (!task) return;

    try {
      await updateTaskMutation.mutateAsync({
        ...task,
        status: newStatus
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors du déplacement de la tâche';
      toast.error(message);
    }
  };

  const handleNewTaskChange = (field: keyof Task, value: string | TaskPriority | TaskStatus | undefined) => {
    setNewTask((prev: Partial<Task>) => ({ ...prev, [field]: value }));
  };

  const handleEditTaskChange = (field: keyof Task, value: string | TaskPriority | TaskStatus | undefined) => {
    if (!selectedTask) return;
    setSelectedTask((prev: Task | null) => prev ? { ...prev, [field]: value } : null);
  };

  const handleCreateTask = () => {
    if (!newTask.title) {
      toast.error('Le titre de la tâche est requis');
      return;
    }
    createTaskMutation.mutate(newTask);
  };

  const handleUpdateTask = () => {
    if (!selectedTask) return;
    if (!selectedTask.title) {
      toast.error('Le titre de la tâche est requis');
      return;
    }
    updateTaskMutation.mutate(selectedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskDialogOpen(true);
  };

  const getPriorityVariant = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
    }
  };

  // Fonction pour filtrer les tâches
  const filteredTasks = (tasks: Task[] | undefined) => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      const matchesAssignee = filterAssignee === 'all' || task.assigned_to === filterAssignee;
      
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  };

  // Fonction pour calculer le pourcentage de tâches terminées
  const calculateCompletionPercentage = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  // Fonction pour vérifier si une tâche est en retard
  const isTaskOverdue = (task: Task) => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'completed';
  };

  // Fonction pour obtenir la couleur de la date d'échéance
  const getDueDateColor = (task: Task) => {
    if (!task.due_date) return 'text-gray-500';
    if (isTaskOverdue(task)) return 'text-red-500';
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Si la date d'échéance est dans les 3 prochains jours
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return dueDate <= threeDaysFromNow ? 'text-amber-500' : 'text-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tâches du projet</h2>
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nouvelle tâche</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleNewTaskChange('title', e.target.value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    handleNewTaskChange('description', e.target.value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: TaskPriority) => {
                    handleNewTaskChange('priority', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Date d'échéance</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleNewTaskChange('due_date', e.target.value);
                  }}
                />
              </div>
              <Button onClick={handleCreateTask}>Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de progression */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-medium">Progression du projet</span>
          </div>
          <span className="text-sm font-medium">{calculateCompletionPercentage()}%</span>
        </div>
        <Progress value={calculateCompletionPercentage()} className="h-2" />
      </div>

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une tâche..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as TaskPriority | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les priorités</SelectItem>
            <SelectItem value="low">Basse</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={(value) => setFilterAssignee(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par assigné" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les assignés</SelectItem>
            {project.members?.map((member: ProjectMember) => (
              <SelectItem key={member.user_id} value={member.user_id}>
                {member.user?.first_name} {member.user?.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={() => {
          setSearchTerm('');
          setFilterPriority('all');
          setFilterAssignee('all');
        }}>
          <Filter className="h-4 w-4 mr-2" />
          Réinitialiser les filtres
        </Button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {statusColumns.map((column) => (
            <Card key={column.id} className={`${column.color} border-2`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{column.title}</span>
                  <Badge variant="outline" className="ml-2">
                    {filteredTasks(project.tasks?.filter((task: Task) => task.status === column.id)).length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SortableContext
                  items={filteredTasks(project.tasks?.filter((task: Task) => task.status === column.id)).map((task: Task) => task.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 min-h-[200px]">
                    {filteredTasks(project.tasks?.filter((task: Task) => task.status === column.id)).map((task: Task) => (
                      <SortableItem key={task.id} id={task.id}>
                        <div className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${isTaskOverdue(task) ? 'border-l-4 border-red-500' : ''}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{task.title}</h4>
                              {task.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {task.priority && (
                                <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                                  {task.priority === 'low' ? 'Basse' : task.priority === 'medium' ? 'Moyenne' : 'Haute'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {task.due_date && (
                            <div className={`mt-2 flex items-center text-xs ${getDueDateColor(task)}`}>
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(task.due_date).toLocaleDateString('fr-FR')}
                              {isTaskOverdue(task) && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Clock className="h-3 w-3 ml-1 text-red-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Tâche en retard</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {task.assigned_to && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <User className="h-3 w-3 mr-1" />
                                  {task.assigned_user?.first_name} {task.assigned_user?.last_name}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTask(task);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        </div>
      </DndContext>

      <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  value={selectedTask.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleEditTaskChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedTask.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleEditTaskChange('description', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-priority">Priorité</Label>
                <Select
                  value={selectedTask.priority}
                  onValueChange={(value: TaskPriority) => handleEditTaskChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-due_date">Date d'échéance</Label>
                <Input
                  id="edit-due_date"
                  type="date"
                  value={selectedTask.due_date || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleEditTaskChange('due_date', e.target.value)}
                />
              </div>
              <Button onClick={handleUpdateTask}>Mettre à jour</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 