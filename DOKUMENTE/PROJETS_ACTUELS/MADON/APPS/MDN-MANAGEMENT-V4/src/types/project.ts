export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectMemberRole = 'member' | 'admin' | 'creator';

export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  created_at: string;
  user: User;
} 