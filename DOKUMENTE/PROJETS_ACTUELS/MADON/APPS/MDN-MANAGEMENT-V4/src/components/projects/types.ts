export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type DocumentType = 'contract' | 'specification' | 'report' | 'deliverable' | 'other';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  skills?: string[];
  department?: string;
  availability?: number; // pourcentage de disponibilité
}

export interface Project {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  deliverables: string[];
  start_date: string;
  end_date: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number; // pourcentage d'avancement
  budget: number;
  actual_cost: number;
  manager_id: string;
  manager?: User;
  created_at: string;
  updated_at: string;
  
  // Relations
  tasks?: ProjectTask[];
  members?: ProjectMember[];
  risks?: ProjectRisk[];
  documents?: ProjectDocument[];
  budgets?: ProjectBudget[];
  comments?: ProjectComment[];
  kpis?: ProjectKPI[];
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: ProjectPriority;
  due_date: string;
  user_id?: string;
  assigned_user?: User;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  allocation_percentage: number;
  start_date: string;
  end_date?: string;
  hourly_rate?: number;
  skills_required: string[];
  user?: User;
}

export interface ProjectRisk {
  id: string;
  project_id: string;
  name: string;
  description: string;
  level: RiskLevel;
  probability: number; // 0-100
  impact: number; // 0-100
  status: 'identified' | 'mitigated' | 'occurred' | 'closed';
  mitigation_plan: string;
  contingency_plan: string;
  owner_id: string;
  owner?: User;
  created_at: string;
  updated_at: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  task_id?: string;
  user_id: string;
  content: string;
  attachments?: string[];
  mentions?: string[]; // IDs des utilisateurs mentionnés
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  name: string;
  type: DocumentType;
  version: string;
  url: string;
  description: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  uploaded_by: string;
  approved_by?: string;
  approval_date?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ProjectBudget {
  id: string;
  project_id: string;
  category: string;
  description: string;
  amount: number;
  type: 'planned' | 'actual';
  date: string;
  invoice_number?: string;
  supplier?: string;
  payment_status?: 'pending' | 'paid' | 'cancelled';
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectKPI {
  id: string;
  project_id: string;
  name: string;
  description: string;
  target: number;
  actual: number;
  unit: string;
  category: 'time' | 'cost' | 'quality' | 'resources' | 'other';
  status: 'on_track' | 'at_risk' | 'off_track';
  trend: 'improving' | 'stable' | 'declining';
  created_at: string;
  updated_at: string;
}

export interface ProjectDashboard {
  project_id: string;
  overall_progress: number;
  budget_status: {
    total_budget: number;
    total_spent: number;
    variance: number;
    forecast: number;
  };
  schedule_status: {
    planned_days: number;
    elapsed_days: number;
    remaining_days: number;
    delay: number;
  };
  resource_utilization: {
    planned_hours: number;
    actual_hours: number;
    resource_count: number;
    utilization_rate: number;
  };
  risk_summary: {
    total_risks: number;
    high_risks: number;
    medium_risks: number;
    low_risks: number;
    mitigated_risks: number;
  };
  quality_metrics: {
    deliverables_completed: number;
    deliverables_on_time: number;
    quality_score: number;
    defects: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  project_id: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'; 