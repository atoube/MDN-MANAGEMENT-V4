// Types pour le tableau de bord
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  pendingTasks: number;
  totalEmployees: number;
  activeEmployees: number;
  totalDocuments: number;
  recentDocuments: number;
}

export interface WidgetConfig {
  stats?: {
    type: 'count' | 'percentage' | 'currency';
    value: number;
    label: string;
  };
  chart?: {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    data: Array<{ label: string; value: number }>;
    options?: Record<string, unknown>;
  };
  calendar?: {
    view: 'day' | 'week' | 'month';
    events: Array<{ id: string; title: string; start: string; end: string }>;
  };
  tasks?: {
    filter: 'all' | 'pending' | 'completed';
    limit: number;
  };
  documents?: {
    filter: 'all' | 'recent' | 'shared';
    limit: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'calendar' | 'tasks' | 'documents';
  title: string;
  position: number;
  size: 'small' | 'medium' | 'large';
  config: WidgetConfig;
}

// Types pour les activités
export interface Activity {
  id: string;
  type: 'task' | 'document' | 'meeting' | 'comment';
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
}

// Types pour les employés
export interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  manager_id?: string;
  avatar_url?: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  created_at: string;
  updated_at: string;
}

// Types pour les livraisons
export interface Delivery {
  id: string;
  order_id: string;
  carrier_id: string;
  tracking_number: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  estimated_delivery: string;
  actual_delivery?: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  notes?: string;
}

export interface Carrier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  rates: CarrierRate[];
  status: 'active' | 'inactive';
}

export interface CarrierRate {
  id: string;
  carrier_id: string;
  weight_min: number;
  weight_max: number;
  price: number;
  currency: string;
}

// Types pour les vendeurs
export interface Seller {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  contract_start: string;
  contract_end: string;
  commission_rate: number;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
}

// Types pour les stocks
export interface Inventory {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  min_quantity: number;
  max_quantity: number;
  last_restock: string;
  next_restock?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  manager_id: string;
  capacity: number;
  status: 'active' | 'inactive';
}

// Types pour les salaires
export interface Salary {
  id: string;
  employee_id: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_salary: number;
  period_start: string;
  period_end: string;
  status: 'pending' | 'paid' | 'cancelled';
  payment_date?: string;
}

export interface Payroll {
  id: string;
  period_start: string;
  period_end: string;
  total_salaries: number;
  total_taxes: number;
  total_deductions: number;
  status: 'draft' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
}

// Types pour les finances
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  date: string;
  category: string;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Budget {
  id: string;
  department: string;
  year: number;
  month: number;
  amount: number;
  spent: number;
  remaining: number;
  status: 'active' | 'exceeded' | 'completed';
}

// Types pour le marketing
export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'print' | 'other';
  start_date: string;
  end_date: string;
  budget: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  roi?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Types pour la comptabilité
export interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  code: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive';
}

export interface Invoice {
  id: string;
  number: string;
  client_id: string;
  amount: number;
  currency: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// Types pour les déclarations DGI
export interface TaxDeclaration {
  id: string;
  type: 'tva' | 'ir' | 'is' | 'other';
  period_start: string;
  period_end: string;
  amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submission_date?: string;
  reference_number?: string;
  documents: string[];
}

import { ProjectStatus, ProjectPriority } from './project';

export interface KPI {
  id: string;
  title: string;
  value: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Widget {
  id: string;
  type: 'kpi' | 'chart' | 'calendar' | 'notifications' | 'reports';
  title: string;
  position: number;
  size: 'small' | 'medium' | 'large';
  config: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: 'task' | 'delivery' | 'meeting' | 'alert';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'task' | 'delivery' | 'other';
  priority: ProjectPriority;
  status: ProjectStatus;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  period: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardConfig {
  widgets: Widget[];
  layout: Record<string, unknown>;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoRefresh: boolean;
  };
} 