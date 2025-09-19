// Types de base
export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'admin' | 'hr' | 'delivery' | 'stock_manager' | 'seller' | 'employee' | 'marketing';
  photo_url?: string;
  avatar_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: string;
  hire_date: string;
  photo_url?: string;
  avatar_id?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Absence {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  type: 'vacation' | 'sick_leave' | 'personal_leave' | 'maternity_leave' | 'paternity_leave' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  total_days?: number;
  reason?: string;
  affects_salary: boolean;
  affects_deliveries: boolean;
  affects_sales: boolean;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  name: string;
  path: string;
  icon: string;
  enabled: boolean;
  order_index: number;
  description?: string;
  adminOnly?: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  budget?: number;
  actual_cost?: number;
  progress: number;
  created_by: number;
  project_manager?: number;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled' | 'backlog';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number | string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: number | string;
  created_by: number | string;
  project_id?: number | string;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  story_points?: number;
  sprint_id?: string;
  created_at: string;
  updated_at: string;
  // Propriétés étendues pour l'affichage
  assigned_name?: string;
  creator_name?: string;
  assigned_user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  attachments?: string[];
  tags?: string[];
  is_recurring?: boolean;
  recurrence_pattern?: string;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

export interface Column {
  id: string;
  name: string;
  status: string;
  color: string;
  order: number;
}

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tasks: string[];
  goal?: string;
}

export interface Sale {
  id: number;
  date: string;
  seller_id: number;
  client_name: string;
  client_email?: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface Delivery {
  id: number;
  tracking_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  delivery_address: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
  delivery_date?: string;
  estimated_delivery?: string;
  driver_id?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost?: number;
  category: string;
  supplier?: string;
  stock_quantity: number;
  min_stock_level: number;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
  updated_at: string;
}

// Types pour les formulaires
export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  salary: string;
  hire_date: string;
  photo_url?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

// Types pour les hooks
export interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  createEmployee: (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<Employee>;
  updateEmployee: (id: number, employeeData: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<Employee>;
}

export interface UseModulesReturn {
  modules: Module[];
  loading: boolean;
  error: string | null;
}

// Types pour les composants UI
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  error?: string;
}

export interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

// Types pour les notifications
export interface ToastOptions {
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

// Types pour les données de marketing
export interface MarketingData {
  id: number;
  campaign_name: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

// Types pour les données de finance
export interface FinanceData {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  created_at: string;
}

// Types pour les données de livraison
export interface DeliveryData {
  id: number;
  tracking_number: string;
  customer_name: string;
  status: string;
  delivery_date?: string;
  created_at: string;
}

// Types pour les données de vente
export interface SaleData {
  id: number;
  date: string;
  amount: number;
  status: string;
  created_at: string;
}