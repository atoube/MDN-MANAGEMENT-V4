import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { ArrowLeft, Loader2, Calendar, User, AlertCircle, Edit, Plus, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { ProjectDocuments } from './sections/ProjectDocuments';
import { ProjectDocumentEditor } from './sections/ProjectDocumentEditor';
import { ProjectCalendar } from './ProjectCalendar';
import TaskDetail from '@/components/tasks/TaskDetail';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
  start_date: string | null;
  end_date: string | null;
  manager: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  tasks: Task[];
  members?: {
    user_id: string;
    user?: {
      first_name: string;
      last_name: string;
    };
  }[];
}

interface ProjectMemberAccess {
  id: string;
  role: string;
  user_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface SortableItemProps {
  task: Task;
  project: Project;
  onClick: () => void;
}

const taskStatusColumns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'À faire' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'review', title: 'En revue' },
  { id: 'completed', title: 'Terminé' }
];

function SortableItem({ task, project, onClick }: SortableItemProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(task.assigned_to);
  const [priorityPoints, setPriorityPoints] = useState(task.priority_points || 0);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (transform) return;
    onClick();
  };

  const handleMemberChange = async (memberId: string) => {
    try {
// Mock from call
        .update({ 
          assigned_to: memberId === 'unassigned' ? null : memberId,
          updated_at: new Date().toISOString()
        })
// Mock eq call;

      // Removed error check - using mock data
      
      setSelectedMember(memberId === 'unassigned' ? null : memberId);
      toast.success('Membre assigné avec succès');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'assignation';
      toast.error(message);
    }
  };

  const handlePriorityChange = async (points: number) => {
    try {
// Mock from call
        .update({ 
          priority_points: points,
          updated_at: new Date().toISOString()
        })
// Mock eq call;

      // Removed error check - using mock data
      
      setPriorityPoints(points);
      toast.success('Priorité mise à jour avec succès');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la priorité';
      toast.error(message);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className="bg-white p-4 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="font-medium">{task.title}</div>
      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
        {task.description || 'Aucune description'}
      </div>
      
      <div className="mt-3 space-y-2">
        <Select
          value={selectedMember || 'unassigned'}
          onValueChange={handleMemberChange}
        >
          <SelectTrigger className="w-full" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <SelectValue placeholder="Assigner à..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Non assigné</SelectItem>
            {project.members?.map((member) => (
              <SelectItem key={member.user_id} value={member.user_id}>
                {member.user?.first_name} {member.user?.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePriorityChange(priorityPoints - 1);
              }}
              disabled={priorityPoints <= 0}
            >
              -
            </Button>
            <span className="text-sm font-medium">{priorityPoints} points</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePriorityChange(priorityPoints + 1);
              }}
            >
              +
            </Button>
          </div>
          {task.due_date && (
            <span className="text-xs text-gray-500">
              Échéance: {format(new Date(task.due_date), 'dd/MM/yyyy')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tasks');
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [isAssignUserDialogOpen, setIsAssignUserDialogOpen] = useState(false);
  const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [assignedFilter, setAssignedFilter] = useState<string | 'all'>('all');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    project_id: projectId || undefined,
    due_date: null
  });
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const queryClient = useQueryClient();
  const [project, setProject] = useState<Project | null>(null);
  const [tasksByStatus, setTasksByStatus] = useState<Record<TaskStatus, Task[]>>({
    todo: [],
    in_progress: [],
    review: [],
    completed: []
  });
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // Récupérer les utilisateurs pour l'assignation
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock order call;

      // Removed error check - using mock data
      return data || [];
    }
  });

  const { data: projectData, isLoading: isLoadingProject, error: projectError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) {
        console.error('ID du projet non fourni');
        throw new Error('ID du projet non fourni');
      }

      // Vérifier l'authentification
      // Simulated auth call - using mock data
      // Removed auth error check - using mock data
      if (!user) {
        console.error('Utilisateur non authentifié');
        throw new Error('Utilisateur non authentifié');
      }

      // Récupérer le projet de base
// Mock from call
// Mock select call
// Mock eq call
        .single();

      if (projectError) {
        console.error('Erreur lors de la récupération du projet:', projectError);
        throw projectError;
      }

      if (!project) {
        console.error('Projet non trouvé');
        throw new Error('Projet non trouvé');
      }

      // Récupérer les tâches du projet
// Mock from call
        .select(`
          *,
          assigned_user:profiles!tasks_assigned_to_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `)
// Mock eq call;

      if (tasksError) {
        console.error('Erreur lors de la récupération des tâches:', tasksError);
        throw tasksError;
      }

      // Récupérer les membres du projet
// Mock from call
// Mock select call
// Mock eq call;

      if (membersError) {
        console.error('Erreur lors de la récupération des membres:', membersError);
        throw membersError;
      }

      // Vérifier les permissions
      const isCreator = project.created_by === user.id;
      const isMember = members?.some(member => member.user_id === user.id);
      const isAdmin = members?.some(member => 
        member.user_id === user.id && 
        (member.role === 'admin' || member.role === 'super_admin')
      );

      if (!isCreator && !isMember && !isAdmin) {
        throw new Error('Vous n\'avez pas les permissions nécessaires pour accéder à ce projet');
      }

      // Combiner les données
      return {
        ...project,
        tasks: tasks || [],
        members: members || []
      };
    },
    retry: 1
  });

  // Mettre à jour l'état local quand les données sont chargées
  useEffect(() => {
    if (projectData) {
      setProject(projectData);
      // Organiser les tâches par statut
      const tasksByStatus = projectData.tasks?.reduce((acc: Record<TaskStatus, Task[]>, task: Task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, {} as Record<TaskStatus, Task[]>);
      setTasksByStatus(tasksByStatus || {
        todo: [],
        in_progress: [],
        review: [],
        completed: []
      });
    }
  }, [projectData]);

  const createTaskMutation = useMutation({
    mutationFn: async (task: Partial<Task>) => {
            if (!user) throw new Error('Utilisateur non authentifié');

      // Vérifier l'accès au projet
// Mock from call
// Mock select call
// Mock eq call
        .single();

      if (accessError) {
        console.error('Erreur accès projet:', accessError);
        throw new Error('Erreur lors de la vérification des accès');
      }
      if (!projectAccess) {
        console.error('Projet non trouvé');
        throw new Error('Projet non trouvé');
      }

      console.log('Projet trouvé:', {
        projectId: projectAccess.id,
        projectName: projectAccess.name,
        createdBy: projectAccess.created_by,
        currentUser: user.id,
        userEmail: user.email
      });

      // Vérifier si l'utilisateur est membre du projet
// Mock from call
// Mock select call
// Mock eq call
// Mock eq call
        .maybeSingle();

      if (memberError) {
        console.error('Erreur vérification membre:', memberError);
        throw new Error('Erreur lors de la vérification du statut de membre');
      }

      const member = memberAccess as ProjectMemberAccess | null;

      // Vérifier les permissions
      const isCreator = projectAccess.created_by === user.id;
      const isMember = member !== null;
      const isAdmin = member?.role === 'admin';
      const isSuperAdmin = member?.role === 'super_admin';

      if (!isCreator && !isMember && !isAdmin && !isSuperAdmin) {
        console.error('Permissions insuffisantes');
        throw new Error('Vous n\'avez pas les permissions nécessaires pour créer une tâche');
      }

      // Insérer la tâche
      console.log('Tentative d\'insertion de la tâche:', {
        task,
        userId: user.id,
        userEmail: user.email,
        projectId: task.project_id,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
// Mock from call
        .insert([{
          ...task,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Erreur insertion tâche:', {
          error: insertError,
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw new Error('Erreur lors de la création de la tâche');
      }

      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setIsCreateTaskDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
        project_id: projectId || undefined,
        due_date: null
      });
      toast.success('Tâche créée avec succès');
    },
    onError: (error) => {
      console.error('Erreur création tâche:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors de la création de la tâche';
      toast.error(message);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
// Mock from call
        .update({ 
          ...task,
          updated_at: new Date().toISOString()
        })
// Mock eq call
        .select(`
          id,
          title,
          description,
          status,
          priority,
          project_id,
          created_by,
          assigned_to,
          due_date,
          created_at,
          updated_at,
          assigned_user:profiles!tasks_assigned_to_fkey(id, first_name, last_name)
        `)
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Tâche mise à jour avec succès');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la tâche';
      toast.error(message);
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
// Mock from call
        .update(projectData)
// Mock eq call
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setIsEditProjectDialogOpen(false);
      toast.success('Projet mis à jour avec succès');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du projet';
      toast.error(message);
    }
  });

  const assignUserMutation = useMutation({
    mutationFn: async ({ taskId, userId }: { taskId: string, userId: string }) => {
// Mock from call
        .update({ assigned_to: userId })
// Mock eq call
        .select(`
          id,
          title,
          description,
          status,
          priority,
          project_id,
          created_by,
          assigned_to,
          due_date,
          created_at,
          updated_at,
          assigned_user:profiles!tasks_assigned_to_fkey(id, first_name, last_name)
        `)
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setIsAssignUserDialogOpen(false);
      setSelectedTaskId(null);
      toast.success('Utilisateur assigné avec succès');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'assignation de l\'utilisateur';
      toast.error(message);
    }
  });

  // Calculer la progression du projet
  const projectProgress = useMemo(() => {
    if (!project?.tasks?.length) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  }, [project?.tasks]);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = project?.tasks?.find((t: Task) => t.id === taskId);
    if (!task) return;

    try {
      // Mettre à jour l'état local immédiatement pour un feedback plus rapide
      setTasksByStatus(prev => {
        const newStatusMap = { ...prev };
        // Retirer la tâche de son ancien statut
        newStatusMap[task.status] = newStatusMap[task.status].filter(t => t.id !== task.id);
        // Ajouter la tâche à son nouveau statut
        newStatusMap[newStatus] = [...newStatusMap[newStatus], { ...task, status: newStatus }];
        return newStatusMap;
      });

      // Mettre à jour la base de données
// Mock from call
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
// Mock eq call;

      // Removed error check - using mock data

      // Invalider le cache pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      
      toast.success('Statut de la tâche mis à jour avec succès');
    } catch (error) {
      // En cas d'erreur, restaurer l'état précédent
      setTasksByStatus(prev => {
        const newStatusMap = { ...prev };
        newStatusMap[newStatus] = newStatusMap[newStatus].filter(t => t.id !== task.id);
        newStatusMap[task.status] = [...newStatusMap[task.status], task];
        return newStatusMap;
      });
      const message = error instanceof Error ? error.message : 'Erreur lors du déplacement de la tâche';
      toast.error(message);
    }
  };

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTaskMutation.mutate({
      ...newTask,
      project_id: projectId || undefined
    });
    setNewTask({
      title: '',
      description: '',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      project_id: projectId || undefined,
      due_date: null
    });
    toast.success('Tâche créée avec succès');
  };

  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Filtrer les tâches en fonction des filtres
  const filteredTasks = useMemo(() => {
    return (project?.tasks || []).filter((t: Task) => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesAssigned = assignedFilter === 'all' || t.assigned_to === assignedFilter;
      return matchesSearch && matchesPriority && matchesAssigned;
    });
  }, [project?.tasks, searchTerm, priorityFilter, assignedFilter]);

  // Mettre à jour tasksByStatus quand les tâches filtrées changent
  useEffect(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      completed: []
    };
    
    filteredTasks.forEach((task: Task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    
    setTasksByStatus(grouped);
  }, [filteredTasks]);

  const handleEditProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProjectMutation.mutate(editedProject);
  };

  const handleAssignUser = (userId: string) => {
    if (selectedTaskId) {
      assignUserMutation.mutate({ taskId: selectedTaskId, userId });
    }
  };

  const openAssignUserDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsAssignUserDialogOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriorityFilterChange = (value: TaskPriority | 'all') => {
    setPriorityFilter(value);
  };

  const handleAssignedFilterChange = (value: string) => {
    setAssignedFilter(value);
  };

  const handleStatusChange = (newStatus: 'active' | 'completed') => {
    if (!project) return;
    updateProjectMutation.mutate({
      ...project,
      status: newStatus
    });
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  };

  if (isLoadingProject) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center gap-2" 
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux projets
          </Button>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-24 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="container mx-auto py-6">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-2" 
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Button>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erreur lors du chargement du projet</h2>
          <p className="text-gray-500 mb-4">Une erreur est survenue lors de la récupération des données du projet.</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-6">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-2" 
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Button>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Projet non trouvé</h2>
          <p className="text-gray-500 mb-4">Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/projects')}>Retour à la liste des projets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">
            {project?.name || 'Chargement...'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsCalendarViewOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Calendrier
          </Button>
          <Button onClick={() => setIsCreateTaskDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <Edit className="h-4 w-4 mr-2" />
                Modifier le projet
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditProjectDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier les détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                <AlertCircle className="h-4 w-4 mr-2" />
                Marquer comme actif
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                <AlertCircle className="h-4 w-4 mr-2" />
                Marquer comme terminé
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tâches du projet</h2>
            <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button>Nouvelle tâche</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle tâche</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newTask.title}
                      onChange={handleNewTaskChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newTask.description || ''}
                      onChange={handleNewTaskChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priorité</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: TaskPriority) => 
                        setNewTask(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Date d'échéance</Label>
                    <Input
                      id="due_date"
                      name="due_date"
                      type="date"
                      value={newTask.due_date || ''}
                      onChange={handleNewTaskChange}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={createTaskMutation.isPending}
                    className="w-full"
                  >
                    {createTaskMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      'Créer la tâche'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filtres */}
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher une tâche..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1.5 h-6 w-6 p-0"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="w-[180px]">
                <Select
                  value={priorityFilter}
                  onValueChange={handlePriorityFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Select
                  value={assignedFilter}
                  onValueChange={handleAssignedFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par assignation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les tâches</SelectItem>
                    <SelectItem value="assigned">Assignées</SelectItem>
                    <SelectItem value="unassigned">Non assignées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div className="grid grid-cols-4 gap-4">
              {taskStatusColumns.map((column) => (
                <Card key={column.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{column.title}</span>
                      <Badge variant="outline">
                        {tasksByStatus[column.id]?.length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SortableContext
                      items={tasksByStatus[column.id]?.map((task: Task) => task.id) || []}
                      strategy={verticalListSortingStrategy}
                    >
                      {tasksByStatus[column.id]?.map((task: Task) => (
                        <div key={task.id} className="relative group">
                          <SortableItem 
                            task={task} 
                            project={project} 
                            onClick={() => handleTaskClick(task.id)}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Options</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openAssignUserDialog(task.id)}>
                                  <User className="mr-2 h-4 w-4" />
                                  Assigner un utilisateur
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedTask(task);
                                  setIsEditTaskDialogOpen(true);
                                }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => {
                                    // Logique pour supprimer la tâche
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                  </svg>
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </SortableContext>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DndContext>

          {/* Indicateur de progression du projet */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Progression du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Barre de progression globale */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progression globale</span>
                    <span className="text-sm font-medium">{projectProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${projectProgress}%` }}
                    />
                  </div>
                </div>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Total des tâches</div>
                    <div className="text-2xl font-bold mt-1">{project?.tasks?.length || 0}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-500">Tâches terminées</div>
                    <div className="text-2xl font-bold mt-1 text-green-600">
                      {project?.tasks?.filter(task => task.status === 'completed').length || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-500">En cours</div>
                    <div className="text-2xl font-bold mt-1 text-blue-600">
                      {project?.tasks?.filter(task => task.status === 'in_progress').length || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-gray-500">En revue</div>
                    <div className="text-2xl font-bold mt-1 text-yellow-600">
                      {project?.tasks?.filter(task => task.status === 'review').length || 0}
                    </div>
                  </div>
                </div>

                {/* Alertes */}
                {project?.tasks?.some(task => {
                  if (!task.due_date || task.status === 'completed') return false;
                  const dueDate = new Date(task.due_date);
                  const now = new Date();
                  return dueDate < now;
                }) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Alertes</h3>
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        {project.tasks.filter(task => {
                          if (!task.due_date || task.status === 'completed') return false;
                          return new Date(task.due_date) < new Date();
                        }).length} tâche(s) en retard
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <ProjectDocuments projectId={projectId || ''} />
        </TabsContent>
        <TabsContent value="editor">
          <ProjectDocumentEditor projectId={projectId || ''} />
        </TabsContent>
      </Tabs>

      {/* Dialog pour éditer le projet */}
      <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProject} className="space-y-4">
            <div>
              <Label htmlFor="project-name">Nom du projet</Label>
              <Input
                id="project-name"
                value={editedProject.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProject(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={editedProject.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedProject(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="project-status">Statut</Label>
              <Select
                value={editedProject.status || 'active'}
                onValueChange={(value: 'active' | 'completed') => setEditedProject(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-start-date">Date de début</Label>
                <Input
                  id="project-start-date"
                  type="date"
                  value={editedProject.start_date ? format(new Date(editedProject.start_date), 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProject(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="project-end-date">Date de fin prévue</Label>
                <Input
                  id="project-end-date"
                  type="date"
                  value={editedProject.end_date ? format(new Date(editedProject.end_date), 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProject(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateProjectMutation.isPending}
              >
                {updateProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog pour assigner un utilisateur */}
      <Dialog open={isAssignUserDialogOpen} onOpenChange={setIsAssignUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isLoadingUsers ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                {users?.map(user => (
                  <div 
                    key={user.id} 
                    className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => handleAssignUser(user.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{user.first_name} {user.last_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsAssignUserDialogOpen(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer une tâche */}
      <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (selectedTask) {
              updateTaskMutation.mutate(selectedTask);
              setIsEditTaskDialogOpen(false);
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="task-title">Titre</Label>
              <Input
                id="task-title"
                value={selectedTask?.title || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                required
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={selectedTask?.description || ''}
                onChange={(e) => setSelectedTask(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </div>
            <div>
              <Label htmlFor="task-priority">Priorité</Label>
              <Select
                value={selectedTask?.priority || 'medium'}
                onValueChange={(value: TaskPriority) => 
                  setSelectedTask(prev => prev ? { ...prev, priority: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-due-date">Date d'échéance</Label>
              <Input
                id="task-due-date"
                type="date"
                value={selectedTask?.due_date ? format(new Date(selectedTask.due_date), 'yyyy-MM-dd') : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTask(prev => prev ? { ...prev, due_date: e.target.value } : null)}
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalendarViewOpen} onOpenChange={setIsCalendarViewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Calendrier du projet</DialogTitle>
          </DialogHeader>
          <ProjectCalendar tasks={project?.tasks || []} />
        </DialogContent>
      </Dialog>

      {selectedTaskId && (
        <TaskDetail
          taskId={selectedTaskId}
          projectId={projectId || ''}
          isOpen={isTaskDetailOpen}
          onClose={() => {
            setIsTaskDetailOpen(false);
            setSelectedTaskId(null);
          }}
        />
      )}
    </div>
  );
} 