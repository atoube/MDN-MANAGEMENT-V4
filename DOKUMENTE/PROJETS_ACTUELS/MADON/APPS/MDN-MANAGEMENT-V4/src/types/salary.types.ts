import { Employee } from './index';

export interface EmployeeWithSalary extends Employee {
  salary_details: {
    base_salary: number;
    bonuses: number;
    deductions: number;
    net_salary: number;
    last_update: string;
  };
}

export interface Salary {
  id: number;
  employee_id: number;
  base_amount: number;
  bonuses: number;
  deductions: number;
  net_amount: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
} 