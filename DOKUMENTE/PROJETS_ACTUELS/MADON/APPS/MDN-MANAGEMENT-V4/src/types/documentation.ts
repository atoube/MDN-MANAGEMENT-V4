export interface Document {
  id: string;
  title: string;
  content: string;
  content_plain: string; // Pour la recherche
  space_id: string;
  folder_id?: string;
  author_id: number;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  version: number;
  tags: string[];
  category: string;
  is_template: boolean;
  template_type?: string;
  permissions: DocumentPermission[];
  collaborators: number[]; // IDs des employés
  views_count: number;
  last_viewed?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  archived_at?: string;
  deleted_at?: string;
  deleted_by?: string;
  last_edited_at?: string;
  last_edited_by?: string;
  parent_version_id?: string;
  workflow_status?: 'pending' | 'approved' | 'rejected';
  workflow_approver_id?: number;
  workflow_notes?: string;
}

export interface DocumentPermission {
  role: 'admin' | 'editor' | 'viewer';
  employee_id: number;
  employee_name: string;
  granted_at: string;
  granted_by: number;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  key: string; // Clé unique pour l'URL
  icon?: string;
  color: string;
  owner_id: number;
  owner_name: string;
  members: SpaceMember[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
  default_permission: 'viewer' | 'editor' | 'admin';
}

export interface SpaceMember {
  employee_id: number;
  employee_name: string;
  role: 'admin' | 'editor' | 'viewer';
  joined_at: string;
  invited_by: number;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  space_id: string;
  parent_folder_id?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  order: number;
}

export interface Comment {
  id: string;
  document_id: string;
  author_id: number;
  author_name: string;
  content: string;
  parent_comment_id?: string; // Pour les réponses
  mentions: number[]; // IDs des employés mentionnés
  created_at: string;
  updated_at: string;
  is_resolved: boolean;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  content: string;
  content_plain: string;
  author_id: number;
  author_name: string;
  changes_summary: string;
  created_at: string;
  is_major_version: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  created_by: number;
  created_at: string;
  updated_at: string;
  usage_count: number;
  is_public: boolean;
}

export interface SearchResult {
  document: Document;
  relevance_score: number;
  matched_fields: string[];
  snippet: string;
}

export interface DocumentAnalytics {
  document_id: string;
  views_count: number;
  unique_viewers: number;
  average_time_spent: number;
  last_viewed: string;
  top_viewers: Array<{
    employee_id: number;
    employee_name: string;
    views_count: number;
  }>;
  recent_activity: Array<{
    action: 'view' | 'edit' | 'comment' | 'share';
    employee_id: number;
    employee_name: string;
    timestamp: string;
  }>;
}

export interface Notification {
  id: string;
  recipient_id: number;
  type: 'mention' | 'comment' | 'share' | 'workflow' | 'update';
  title: string;
  message: string;
  document_id?: string;
  space_id?: string;
  sender_id?: number;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  approver_role: string;
  is_required: boolean;
  estimated_days: number;
}

export interface WorkflowInstance {
  id: string;
  document_id: string;
  workflow_type: string;
  current_step: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  steps: WorkflowStep[];
  current_approver_id?: number;
  started_at: string;
  completed_at?: string;
  notes: string;
}
