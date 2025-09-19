import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Task, TaskStatus } from '../../types';
import { Plus, List, Kanban, Calendar } from 'lucide-react';
import { TaskModal } from './TaskModal';
import { User } from '../../types';
import { TaskCard } from './TaskCard';
import { KanbanBoard } from './KanbanBoard';
import { CalendarView } from './CalendarView';

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onCreateTask: (data: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  employees: User[];
}

type ViewMode = 'list' | 'kanban' | 'calendar';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClick,
  onCreateTask,
  employees
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    onCreateTask(taskData);
    setIsTaskDialogOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, status: newStatus };
      onTaskClick?.(updatedTask);
    }
  };

  const renderView = () => {
    switch (viewMode) {
      case 'list':
        return (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={onTaskClick}
              />
            ))}
          </div>
        );
      case 'kanban':
        return (
          <KanbanBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onTaskClick={onTaskClick}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            onTaskClick={onTaskClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Liste des tâches</h2>
            <Button onClick={() => setIsTaskDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle tâche
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                <List className="w-4 h-4 mr-2" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                onClick={() => setViewMode('kanban')}
                size="sm"
              >
                <Kanban className="w-4 h-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendrier
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {renderView()}
        </div>
      </Card>

      <TaskModal
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onCreateTask={handleCreateTask}
        employees={employees.map(emp => ({ ...emp, id: emp.id.toString() }))}
        columns={[]}
        sprints={[]}
        currentSprint={null}
        view="kanban"
        isEditMode={false}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
        onEditTask={() => {}}
      />
    </>
  );
}; 