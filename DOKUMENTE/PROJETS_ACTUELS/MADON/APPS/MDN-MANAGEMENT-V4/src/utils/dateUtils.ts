import { format, differenceInDays, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = 'dd MMMM yyyy'): string => {
  return format(new Date(date), formatStr, { locale: fr });
};

export const calculateDateDifference = (startDate: string | Date, endDate: string | Date): number => {
  return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
};

export const isDateInRange = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  return isWithinInterval(new Date(date), {
    start: new Date(startDate),
    end: new Date(endDate)
  });
}; 