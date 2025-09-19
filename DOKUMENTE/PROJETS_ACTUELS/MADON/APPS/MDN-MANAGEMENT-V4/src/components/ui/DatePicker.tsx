import React from 'react';
import { DayPicker } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from './Button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onSelect }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={onSelect}
          locale={fr}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}; 