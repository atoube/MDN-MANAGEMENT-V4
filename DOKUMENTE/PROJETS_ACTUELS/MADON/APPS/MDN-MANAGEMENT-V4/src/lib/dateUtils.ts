import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm', { locale: fr });
} 