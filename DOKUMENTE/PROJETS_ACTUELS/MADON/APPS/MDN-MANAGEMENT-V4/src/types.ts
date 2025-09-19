export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  user_id?: string;
  assigned_user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProjectTask extends Task {
  project_id: string;
} 