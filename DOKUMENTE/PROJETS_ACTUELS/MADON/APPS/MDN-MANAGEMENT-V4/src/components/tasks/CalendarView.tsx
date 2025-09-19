import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Calendar } from '../ui/Calendar';
import { Task } from '../../types';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const tasksForSelectedDate = selectedDate
    ? tasks.filter(
        (task) => task.due_date && new Date(task.due_date).toDateString() === selectedDate.toDateString()
      )
    : [];

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksForSelectedDate.length > 0 ? (
            <div className="space-y-2">
              {tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer hover:bg-accent",
                    getTaskStatusColor(task.status)
                  )}
                  onClick={() => onTaskClick(task)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {task.status === 'todo' && 'À faire'}
                      {task.status === 'in_progress' && 'En cours'}
                      {task.status === 'review' && 'En révision'}
                      {task.status === 'completed' && 'Terminé'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune tâche pour cette date
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 