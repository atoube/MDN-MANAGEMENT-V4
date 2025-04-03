import type { Absence } from '../database.types';

export const testAbsences: Absence[] = [
  {
    id: '1',
    employee_id: '1',
    start_date: '2024-03-15',
    end_date: '2024-03-20',
    type: 'annual',
    status: 'approved',
    reason: 'Vacances de printemps',
    notes: 'Remplacé par Sophie Martin',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    employee_id: '2',
    start_date: '2024-02-10',
    end_date: '2024-02-12',
    type: 'sick',
    status: 'approved',
    reason: 'Grippe',
    notes: 'Certificat médical fourni',
    created_at: '2024-02-09T15:30:00Z',
    updated_at: '2024-02-09T15:30:00Z'
  },
  {
    id: '3',
    employee_id: '3',
    start_date: '2024-03-25',
    end_date: '2024-03-26',
    type: 'other',
    status: 'pending',
    reason: 'Formation professionnelle',
    notes: 'Formation sur les nouvelles technologies',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z'
  },
  {
    id: '4',
    employee_id: '4',
    start_date: '2024-04-01',
    end_date: '2024-04-05',
    type: 'annual',
    status: 'rejected',
    reason: 'Vacances de Pâques',
    notes: 'Période de forte activité',
    created_at: '2024-03-05T14:20:00Z',
    updated_at: '2024-03-05T14:20:00Z'
  }
]; 