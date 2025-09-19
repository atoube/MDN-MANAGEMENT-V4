import { User } from './user';

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string;
  due_date: string;
  assigned_to: string | null;
  created_by: string | null;
  tags: string[];
  is_recurring: boolean;
  recurrence_pattern?: string;
  subtasks: Subtask[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  manager_id: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'member' | 'admin';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
} 