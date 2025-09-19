import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanBoardProps {
  columns: {
    todo: { title: string; tasks: Task[] };
    in_progress: { title: string; tasks: Task[] };
    done: { title: string; tasks: Task[] };
  };
  onDragEnd: (result: any) => void;
  onTaskClick: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  columns,
  onDragEnd,
  onTaskClick
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    onDragEnd({
      source: { droppableId: active.data.current?.status },
      destination: { droppableId: over.data.current?.status },
      draggableId: active.id
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {Object.entries(columns).map(([status, column]) => (
          <Card key={status} className="h-full">
            <CardHeader>
              <CardTitle>{column.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                items={column.tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {column.tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={(taskId, newStatus) => onDragEnd({
                        source: { droppableId: task.status },
                        destination: { droppableId: newStatus },
                        draggableId: taskId
                      })}
                      onEdit={onTaskClick}
                    />
                  ))}
                </div>
              </SortableContext>
            </CardContent>
          </Card>
        ))}
      </div>
    </DndContext>
  );
}; 