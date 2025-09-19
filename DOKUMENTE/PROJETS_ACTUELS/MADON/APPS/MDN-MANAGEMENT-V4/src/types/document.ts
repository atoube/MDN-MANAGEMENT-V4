import { User } from './user';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  version: number;
  is_locked: boolean;
  locked_by?: string;
  tags: string[];
  metadata: {
    [key: string]: any;
  };
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface Permission {
  id: string;
  entity_id: string; // ID du document ou dossier
  entity_type: 'document' | 'folder';
  user_id?: string;
  group_id?: string;
  permission: 'read' | 'write' | 'admin';
  created_at: string;
  created_by: string;
}

export interface Share {
  id: string;
  document_id: string;
  shared_by: string;
  shared_with: string;
  permission: 'read' | 'write' | 'admin';
  expires_at?: string;
  created_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  created_at: string;
  created_by: string;
  size: number;
  changes: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  user_id: string;
  action: 'view' | 'edit' | 'delete' | 'share' | 'download' | 'lock' | 'unlock';
  created_at: string;
  details?: {
    [key: string]: any;
  };
}

export interface DocumentFilters {
  search?: string;
  type?: string;
  tags?: string[];
  created_by?: string;
  date_range?: {
    start: string;
    end: string;
  };
  is_favorite?: boolean;
}

export type DocumentCategory = 
  | 'contrat'
  | 'facture'
  | 'rapport'
  | 'presentation'
  | 'autre';

export interface DocumentFilters {
  category?: DocumentCategory;
  search?: string;
  tags?: string[];
  is_public?: boolean;
} 