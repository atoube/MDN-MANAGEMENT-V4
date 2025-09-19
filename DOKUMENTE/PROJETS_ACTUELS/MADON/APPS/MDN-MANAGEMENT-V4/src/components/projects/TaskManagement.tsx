import { useState, ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Search, Plus } from 'lucide-react';
import CreateTaskForm from './CreateTaskForm';

interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface TaskManagementProps {
  projectId: string;
}

export default function TaskManagement({ projectId }: TaskManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      // Mock data
        const data = [];
        const error = null;
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data as Task[];
    }
  });

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tasksByStatus = {
    todo: filteredTasks?.filter(task => task.status === 'todo') || [],
    in_progress: filteredTasks?.filter(task => task.status === 'in_progress') || [],
    review: filteredTasks?.filter(task => task.status === 'review') || [],
    completed: filteredTasks?.filter(task => task.status === 'completed') || [],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tâches</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Tâche
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une tâche..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: Task['status'] | 'all') => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="todo">À faire</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="review">En revue</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(value: Task['priority'] | 'all') => setPriorityFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les priorités</SelectItem>
            <SelectItem value="low">Basse</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{getTaskStatusLabel(status as Task['status'])}</h3>
              <Badge variant="secondary">{tasks.length}</Badge>
            </div>
            <div className="space-y-2">
              {tasks.map(task => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-2">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <Badge variant={getPriorityVariant(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                    {task.due_date && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>Échéance : {new Date(task.due_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle tâche.
            </DialogDescription>
          </DialogHeader>
          <CreateTaskForm 
            projectId={projectId} 
            onSuccess={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getTaskStatusLabel(status: Task['status']): string {
  switch (status) {
    case 'todo':
      return 'À faire';
    case 'in_progress':
      return 'En cours';
    case 'review':
      return 'En revue';
    case 'completed':
      return 'Terminé';
    default:
      return status;
  }
}

function getPriorityLabel(priority: Task['priority']): string {
  switch (priority) {
    case 'low':
      return 'Basse';
    case 'medium':
      return 'Moyenne';
    case 'high':
      return 'Haute';
    default:
      return priority;
  }
}

function getPriorityVariant(priority: Task['priority']): "outline" | "default" | "destructive" | "secondary" | "danger" | "success" | "warning" | "info" {
  switch (priority) {
    case 'low':
      return 'outline';
    case 'medium':
      return 'default';
    case 'high':
      return 'warning';
    default:
      return 'outline';
  }
} 