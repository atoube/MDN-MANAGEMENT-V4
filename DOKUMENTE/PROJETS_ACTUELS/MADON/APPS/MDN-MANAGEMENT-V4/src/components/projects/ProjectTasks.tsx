import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import { ProjectTask, TaskStatus, ProjectPriority } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  review: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

interface ProjectTasksProps {
  projectId: string;
}

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project_id: projectId,
    due_date: new Date().toISOString().split('T')[0]
  });
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      // Récupérer les tâches
      const { data: tasksData, error: tasksError } =         const data = [];
        const error = null;
          id,
          title,
          description,
          status,
          priority,
          project_id,
          user_id,
          due_date,
          created_at,
          updated_at
        `)
// Mock eq call
// Mock order call;
      
      if (tasksError) {
        console.error('Erreur lors de la récupération des tâches du projet:', tasksError);
        throw tasksError;
      }

      // Récupérer les utilisateurs assignés
      const userIds = tasksData
        .filter(task => task.user_id)
        .map(task => task.user_id);

      let assignedUsers = {};
      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = // Mock await select call
          .in('id', userIds);

        if (usersError) {
          console.error('Erreur lors de la récupération des utilisateurs assignés:', usersError);
        } else {
          assignedUsers = usersData.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
        }
      }

      // Combiner les données
      const data = tasksData.map(task => ({
        ...task,
        assigned_user: task.user_id ? assignedUsers[task.user_id] : null
      }));

      return data as ProjectTask[];
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: Partial<ProjectTask>) => {
      const taskData = {
        ...task,
        project_id: projectId,
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Création de la tâche avec les données:', taskData);

      const { data, error } = await         // Mock insert operation[taskData])
        .select()
        .single();

      if (error) {
        console.error('Erreur détaillée:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
      setIsCreateDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project_id: projectId,
        due_date: new Date().toISOString().split('T')[0]
      });
      toast.success('Tâche créée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la tâche');
      console.error('Erreur création tâche:', error);
    }
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  };

  if (isLoading) {
    return <div>Chargement des tâches...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tâches du projet</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nouvelle tâche</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value: TaskStatus) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">À faire</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="review">En révision</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: ProjectPriority) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Date d'échéance</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? 'Création...' : 'Créer la tâche'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="flex gap-2">
                    <Badge className={statusColors[task.status]}>
                      {task.status === 'todo' && 'À faire'}
                      {task.status === 'in_progress' && 'En cours'}
                      {task.status === 'review' && 'En révision'}
                      {task.status === 'completed' && 'Terminée'}
                    </Badge>
                    <Badge className={priorityColors[task.priority]}>
                      {task.priority === 'low' && 'Basse'}
                      {task.priority === 'medium' && 'Moyenne'}
                      {task.priority === 'high' && 'Haute'}
                      {task.priority === 'urgent' && 'Urgente'}
                    </Badge>
                  </div>
                  {task.due_date && (
                    <p className="text-sm text-gray-500">
                      Échéance: {format(new Date(task.due_date), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  )}
                  {task.assigned_user && (
                    <p className="text-sm text-gray-500">
                      Assignée à: {task.assigned_user.first_name} {task.assigned_user.last_name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 