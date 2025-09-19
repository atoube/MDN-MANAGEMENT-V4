export interface Salary {
  id: string;
  employee_id: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_salary: number;
  payment_date: string;
  status: 'pending' | 'paid' | 'cancelled';
  payment_method: 'bank_transfer' | 'check' | 'cash';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SalaryFormData {
  employee_id: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  payment_date: string;
  payment_method: 'bank_transfer' | 'check' | 'cash';
  notes?: string;
}

export interface SalaryWithEmployee extends Salary {
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: {
      id: string;
      name: string;
      description?: string;
    };
    position: string;
    bank_account?: string;
    social_security_number?: string;
  };
} 