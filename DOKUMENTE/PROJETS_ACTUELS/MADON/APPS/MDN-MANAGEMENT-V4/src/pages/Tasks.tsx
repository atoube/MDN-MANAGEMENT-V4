import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ClipboardList,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  User
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { useTasks } from '../hooks/useTasks';
import { useEmployees } from '../hooks/useEmployees';

export function Tasks() {
  const { tasks, isLoading: isLoadingTasks, createTask } = useTasks();
  const { employees, isLoading: isLoadingEmployees } = useEmployees();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: 'danger', label: 'Haute' },
      medium: { variant: 'warning', label: 'Moyenne' },
      low: { variant: 'info', label: 'Basse' }
    } as const;

    const priorityInfo = variants[priority as keyof typeof variants];
    return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'warning', label: 'En attente' },
      in_progress: { variant: 'info', label: 'En cours' },
      completed: { variant: 'success', label: 'Terminée' }
    } as const;

    const statusInfo = variants[status as keyof typeof variants];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleCreateTask = async (data: any) => {
    try {
      await createTask.mutateAsync(data);
      setIsTaskDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = 
      searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoadingTasks || isLoadingEmployees) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const totalTasks = tasks?.length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const lateTasks = tasks?.filter(t => 
    t.status !== 'completed' && 
    new Date(t.due_date) < new Date()
  ).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Activités</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez les tâches de l'équipe
          </p>
        </div>
        <Button onClick={() => setIsTaskDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total</h3>
              <p className="text-3xl font-semibold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En cours</h3>
              <p className="text-3xl font-semibold text-gray-900">{inProgressTasks}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Terminées</h3>
              <p className="text-3xl font-semibold text-gray-900">{completedTasks}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En retard</h3>
              <p className="text-3xl font-semibold text-gray-900">{lateTasks}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'pending', label: 'En attente' },
                { value: 'in_progress', label: 'En cours' },
                { value: 'completed', label: 'Terminées' }
              ]}
              className="w-40"
            />
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Toutes priorités' },
                { value: 'high', label: 'Haute' },
                { value: 'medium', label: 'Moyenne' },
                { value: 'low', label: 'Basse' }
              ]}
              className="w-40"
            />
            <Button variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </Button>
          </div>
        </div>

        <Table
          headers={[
            'Tâche',
            'Assignée à',
            'Date limite',
            'Priorité',
            'Statut',
            'Actions'
          ]}
        >
          {filteredTasks?.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {task.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="ml-2 text-sm text-gray-900">
                    {task.employee?.first_name} {task.employee?.last_name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(task.due_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getPriorityBadge(task.priority)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(task.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm">
                    Détails
                  </Button>
                  <Button variant="secondary" size="sm">
                    Modifier
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSubmit={handleCreateTask}
        employees={employees || []}
      />
    </div>
  );
}