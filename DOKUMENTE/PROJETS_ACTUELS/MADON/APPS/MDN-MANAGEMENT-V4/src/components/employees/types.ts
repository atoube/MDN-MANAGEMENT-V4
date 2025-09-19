// Créer un nouveau fichier pour les types partagés
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'congé payé' | 'maladie' | 'maternité' | 'paternité' | 'autre';

export type EmployeeRole = 'admin' | 'hr' | 'delivery' | 'stock_manager' | 'employee';

export interface Department {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department_id: string;
  department?: string;
  position: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department_id: string;
    position: string;
    departments: {
      id: string;
      name: string;
    };
  };
  start_date: string;
  end_date: string;
  type: LeaveType;
  status: LeaveStatus;
  total_days: number;
  reason: string;
  created_at: string;
  updated_at: string;
  document_url?: string;
  rejection_reason?: string;
}

export interface AbsenceFormData {
  employee_id: string;
  start_date: string;
  end_date: string;
  type: LeaveType;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  total_days?: number;
  created_at?: string;
  updated_at?: string;
  rejection_reason?: string;
}

// Ajout des types utilitaires
export type SortOrder = 'asc' | 'desc';

export interface ValidationErrors {
  employee_id?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  reason?: string;
}

// Ajout des types pour les dates
export type DateString = string; // format 'YYYY-MM-DD'

// Ajout des types pour les couleurs
export interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

// Mise à jour de LeaveTypeConfig
export interface LeaveTypeConfig {
  id: LeaveType;
  label: string;
  maxDays?: number;
  requiresJustification: boolean;
  colors: {
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
}

// Ajout d'un type pour le formulaire
export interface AbsenceFormState {
  formData: AbsenceFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
}

// Ajout d'un type pour le statut du filtre
export type StatusFilterType = 'all' | 'pending' | 'approved' | 'rejected';

export interface AbsenceResponse {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  status: LeaveStatus;
  total_days: number;
  reason?: string;
  created_at: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    department: string;
    position: string;
  };
}

// Mettre à jour l'interface DatabaseAbsence
export interface DatabaseAbsence {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: LeaveType;
  status: 'pending' | 'approved' | 'rejected';
  total_days: number;
  reason: string | null;
  document_url: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department_id: string;
    position: string;
  };
  department?: {
    id: string;
    name: string;
  };
}

// Interface pour les types d'absence
export interface AbsenceType {
  id: number;
  name: string;
  description: string;
  deducts_balance: boolean;
  requires_justification: boolean;
  max_duration?: number;
  color?: string; // Pour la personnalisation de l'affichage
}

export interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  leave_request_id: string;
  created_at: string;
}

export const LEAVE_TYPES = [
  {
    id: 'congé payé',
    label: 'Congé payé',
    maxDays: 25,
    requiresJustification: false,
    colors: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    }
  },
  {
    id: 'maladie',
    label: 'Congé maladie',
    maxDays: 30,
    requiresJustification: true,
    colors: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    }
  },
  {
    id: 'maternité',
    label: 'Congé maternité',
    maxDays: 98,
    requiresJustification: true,
    colors: {
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    }
  },
  {
    id: 'paternité',
    label: 'Congé paternité',
    maxDays: 14,
    requiresJustification: true,
    colors: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    }
  },
  {
    id: 'autre',
    label: 'Autre',
    maxDays: undefined,
    requiresJustification: true,
    colors: {
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200'
    }
  }
] as const; 