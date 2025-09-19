export interface Absence {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface AbsenceWithEmployee extends Absence {
  employees: {
    first_name: string;
    last_name: string;
    department: string;
  };
}

export type NewAbsence = Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'status'>;
export type UpdateAbsence = Partial<Omit<Absence, 'id' | 'created_at' | 'updated_at'>> & { id: string }; 