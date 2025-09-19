import { Journal } from '@/types/accounting';

export const getJournalLabel = (journalId: string, journals: Journal[]): string => {
  return journals.find(j => j.id === journalId)?.label || '';
};

export const getJournalCode = (journalId: string, journals: Journal[]): string => {
  return journals.find(j => j.id === journalId)?.code || '';
};

export const isJournalActive = (journalId: string, journals: Journal[]): boolean => {
  return journals.find(j => j.id === journalId)?.isActive || false;
};

export const getJournalsByType = (type: Journal['type'], journals: Journal[]): Journal[] => {
  return journals.filter(j => j.type === type);
}; 