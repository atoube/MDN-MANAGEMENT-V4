import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";;
import { Button } from "@/components/ui/Button";;
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarWidgetProps {
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
  }>;
}

export function CalendarWidget({ events }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Calendrier</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </span>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toString()}
                className={`min-h-[80px] p-1 border rounded ${
                  isToday(day) ? 'bg-blue-50' : ''
                } ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}`}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1 mb-1 bg-blue-100 rounded truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 