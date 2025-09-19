export const testEmployee: Employee = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  position: 'Développeur',
  department: 'IT',
  hire_date: '2023-01-01',
  salary: 50000,
  status: 'active',
  created_at: '2023-01-01'
};

export const testAbsences: Absence[] = [
  {
    id: '1',
    employee_id: '1',
    start_date: '2024-01-15',
    end_date: '2024-01-20',
    status: 'approved',
    type: 'annual',
    reason: 'Vacances',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  // ... autres absences de test
]; 