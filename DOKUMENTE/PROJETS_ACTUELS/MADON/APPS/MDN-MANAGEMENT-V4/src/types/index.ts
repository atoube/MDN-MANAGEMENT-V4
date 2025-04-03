import { Database } from '../lib/database.types';

export type Tables = Database['public']['Tables'];

export type SocialMediaStats = Tables['social_media_stats']['Row'];
export type SocialMediaPost = Tables['social_media_posts']['Row'];
export type EmailCampaign = Tables['email_campaigns']['Row'];
export type SocialMediaConnection = Tables['social_media_connections']['Row'];

export * from './marketing';

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  hire_date: string;
  salary: number;
  status: 'active' | 'inactive';
  created_at: string;
  role: string;
  user_id: string;
  addresses?: {
    full_address: string;
    city: string;
    country: string;
    postal_code: string;
  }[];
  attendance?: {
    regular_hours?: {
      days?: string[];
    };
    absences?: number;
  };
  leave_balance?: {
    annual: number;
    sick: number;
    other: number;
  };
  performance_reviews?: {
    date: string;
    rating: number;
    feedback: string;
    goals: string;
  }[];
  training_history?: {
    name: string;
    date: string;
    provider: string;
    completion_status: 'completed' | 'in_progress' | 'planned';
  }[];
  professional_goals?: {
    short_term: string[];
    long_term: string[];
  };
  onboarding?: {
    documents: {
      type: string;
      status: 'pending' | 'received' | 'verified';
      notes?: string;
    }[];
    training: {
      name: string;
      status: 'pending' | 'in_progress' | 'completed';
      completion_date?: string;
      notes?: string;
    }[];
    equipment: {
      item: string;
      status: 'pending' | 'ordered' | 'delivered' | 'setup';
      notes?: string;
    }[];
    access: {
      system: string;
      status: 'pending' | 'requested' | 'granted';
      notes?: string;
    }[];
    meetings: {
      type: string;
      status: 'scheduled' | 'completed';
      date?: string;
      notes?: string;
    }[];
  };
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills?: string[];
  languages?: string[];
  work_preferences?: {
    remote: boolean;
    flexible_hours: boolean;
  };
  certifications?: {
    name: string;
    date: string;
    expiry_date?: string;
  }[];
  education_level?: string;
  educations?: {
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date?: string;
    grade?: string;
  }[];
  benefits?: {
    health_insurance: boolean;
    life_insurance: boolean;
    retirement_plan: boolean;
    other_benefits: string[];
  };
  administrative_info?: {
    employee_id: string;
    badge_number: string;
    access_level: string;
    equipment: {
      type: string;
      serial_number: string;
      assigned_date: string;
      return_date?: string;
    }[];
    documents: {
      type: string;
      number: string;
      expiry_date: string;
      file_url?: string;
    }[];
  };
}

// Types pour les données optionnelles qui ne sont pas dans la base de données
export interface EmployeeExtendedData {
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills?: string[];
  languages?: string[];
  work_preferences?: {
    remote: boolean;
    flexible_hours: boolean;
  };
  certifications?: {
    name: string;
    date: string;
    expiry_date?: string;
  }[];
  career_history?: {
    position: string;
    start_date: string;
    end_date?: string;
    department: string;
    achievements: string;
  }[];
  professional_goals?: {
    short_term: string[];
    long_term: string[];
  };
  training_history?: {
    name: string;
    date: string;
    provider: string;
    status: 'completed' | 'in_progress' | 'planned';
  }[];
  administrative_info?: {
    employee_id: string;
    badge_number: string;
    access_level: string;
    equipment: {
      type: string;
      serial_number: string;
      assigned_date: string;
      return_date?: string;
    }[];
    documents: {
      type: string;
      number: string;
      expiry_date: string;
      file_url?: string;
    }[];
  };
  benefits?: {
    health_insurance: boolean;
    life_insurance: boolean;
    retirement_plan: boolean;
    other_benefits: string[];
  };
  onboarding?: {
    documents: {
      type: string;
      status: 'pending' | 'received' | 'verified';
      notes?: string;
    }[];
    training: {
      name: string;
      status: 'pending' | 'in_progress' | 'completed';
      completion_date?: string;
      notes?: string;
    }[];
    equipment: {
      item: string;
      status: 'pending' | 'ordered' | 'delivered' | 'setup';
      notes?: string;
    }[];
    access: {
      system: string;
      status: 'pending' | 'requested' | 'granted';
      notes?: string;
    }[];
    meetings: {
      type: string;
      status: 'scheduled' | 'completed';
      date?: string;
      notes?: string;
    }[];
  };
  attendance?: {
    date: string;
    status: 'present' | 'absent' | 'late';
    notes?: string;
  }[];
}

export interface Absence {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: 'annual' | 'sick' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export type NewAbsence = Omit<Absence, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAbsence = Partial<Omit<Absence, 'id' | 'created_at' | 'updated_at'>> & {
  id: string;
};

// Removing Seller type since it doesn't exist in Database type
// export type Seller = Database['public']['Tables']['sellers']['Row'];
// Removing these types since they don't exist in the Database type
// export type Product = Database['public']['Tables']['products']['Row'];
// export type StockMovement = Database['public']['Tables']['stock_movements']['Row']; 
// export type Task = Database['public']['Tables']['tasks']['Row'];

export type UserRole = 'admin' | 'hr' | 'delivery' | 'stock_manager' | 'seller' | 'employee' | 'marketing';

export interface DashboardStats {
  totalEmployees: number;
  totalSellers: number;
  totalProducts: number;
  pendingDeliveries: number;
  lowStockProducts: number;
  urgentTasks: number;
}

export interface ChartData {
  name: string;
  value: number;
}