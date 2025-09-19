import React from 'react';
import { useGeneralTasks } from '../hooks/useGeneralTasks';
import { TaskList } from '../components/tasks/TaskList';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDashboard } from '../components/tasks/TaskDashboard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Plus, LayoutGrid, List, Search, Filter } from 'lucide-react';
import { Task } from '../types';

export function TasksPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list');
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    status: '' as '' | 'todo' | 'in_progress' | 'done',
    priority: '' as '' | 'low' | 'medium' | 'high',
    search: ''
  });
  
  const { tasks, isLoading, createTask, updateTaskStatus } = useGeneralTasks();

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createTask.mutateAsync(taskData);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus.mutateAsync({ id: taskId, status: newStatus });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      // Filtre par statut
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      
      // Filtre par priorité
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [tasks, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tâches Générales</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Tâche
          </Button>
        </div>
      </div>

      {/* Tableau de bord */}
      <div className="mb-8">
        <TaskDashboard tasks={tasks || []} />
      </div>

      {/* Filtres et options d'affichage */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Rechercher une tâche..."
                value={filters.search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as '' | 'todo' | 'in_progress' | 'done' }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="done">Terminé</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.priority}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value as '' | 'low' | 'medium' | 'high' }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les priorités</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('kanban')}
                  className="rounded-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des tâches */}
      {isLoading ? (
        <div className="text-center py-8">Chargement des tâches...</div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
        />
      )}

      <TaskModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreateTask={handleCreateTask}
        employees={[]}
        columns={[]}
        sprints={[]}
        currentSprint={null}
        view="kanban"
        isEditMode={false}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
        onEditTask={() => {}}
      />
    </div>
  );
} 