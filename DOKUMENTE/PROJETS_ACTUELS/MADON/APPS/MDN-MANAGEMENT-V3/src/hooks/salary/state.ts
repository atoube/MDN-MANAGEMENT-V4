import type { Employee } from '../../types/salary';

export interface SalaryState {
  employees: Employee[];
  selectedEmployees: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: SalaryState = {
  employees: [],
  selectedEmployees: [],
  loading: false,
  error: null
}; 