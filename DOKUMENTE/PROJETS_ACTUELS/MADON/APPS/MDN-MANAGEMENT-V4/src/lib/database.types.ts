export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      modules: {
        Row: {
          id: string
          name: string
          path: string
          icon: string
          enabled: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          path: string
          icon: string
          enabled?: boolean
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          path?: string
          icon?: string
          enabled?: boolean
          order?: number
          created_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          position: string
          role: string
          salary: number
          hire_date: string
          department: string
          user_id: string
          created_at: string
          status: 'active' | 'inactive'
          emergency_contact?: {
            name: string
            phone: string
            relationship: string
          }
          skills?: string[]
          languages?: string[]
          work_preferences?: {
            remote: boolean
            flexible_hours: boolean
          }
          certifications?: {
            name: string
            date: string
            expiry_date?: string
          }[]
          career_history?: {
            position: string
            start_date: string
            end_date?: string
            department: string
            achievements: string
          }[]
          performance_reviews?: {
            date: string
            rating: number
            feedback: string
            goals: string
          }[]
          professional_goals?: {
            short_term: string[]
            long_term: string[]
          }
          training_history?: {
            name: string
            date: string
            provider: string
            status: 'completed' | 'in_progress' | 'planned'
          }[]
          administrative_info?: {
            employee_id: string
            badge_number: string
            access_level: string
            equipment: {
              type: string
              serial_number: string
              assigned_date: string
              return_date?: string
            }[]
            documents: {
              type: string
              number: string
              expiry_date: string
              file_url?: string
            }[]
          }
          leave_balance?: {
            annual: number
            sick: number
            other: number
          }
          benefits?: {
            health_insurance: boolean
            life_insurance: boolean
            retirement_plan: boolean
            other_benefits: string[]
          }
          onboarding?: {
            documents: {
              type: string
              status: 'pending' | 'received' | 'verified'
              notes?: string
            }[]
            training: {
              name: string
              status: 'pending' | 'in_progress' | 'completed'
              completion_date?: string
              notes?: string
            }[]
            equipment: {
              item: string
              status: 'pending' | 'ordered' | 'delivered' | 'setup'
              notes?: string
            }[]
            access: {
              system: string
              status: 'pending' | 'requested' | 'granted'
              notes?: string
            }[]
            meetings: {
              type: string
              status: 'scheduled' | 'completed'
              date?: string
              notes?: string
            }[]
          }
          attendance?: {
            date: string
            status: 'present' | 'absent' | 'late'
            notes?: string
          }[]
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          position: string
          role: string
          salary: number
          hire_date: string
          department: string
          user_id: string
          created_at?: string
          status?: 'active' | 'inactive'
          emergency_contact?: {
            name: string
            phone: string
            relationship: string
          }
          skills?: string[]
          languages?: string[]
          work_preferences?: {
            remote: boolean
            flexible_hours: boolean
          }
          certifications?: {
            name: string
            date: string
            expiry_date?: string
          }[]
          career_history?: {
            position: string
            start_date: string
            end_date?: string
            department: string
            achievements: string
          }[]
          performance_reviews?: {
            date: string
            rating: number
            feedback: string
            goals: string
          }[]
          professional_goals?: {
            short_term: string[]
            long_term: string[]
          }
          training_history?: {
            name: string
            date: string
            provider: string
            status: 'completed' | 'in_progress' | 'planned'
          }[]
          administrative_info?: {
            employee_id: string
            badge_number: string
            access_level: string
            equipment: {
              type: string
              serial_number: string
              assigned_date: string
              return_date?: string
            }[]
            documents: {
              type: string
              number: string
              expiry_date: string
              file_url?: string
            }[]
          }
          leave_balance?: {
            annual: number
            sick: number
            other: number
          }
          benefits?: {
            health_insurance: boolean
            life_insurance: boolean
            retirement_plan: boolean
            other_benefits: string[]
          }
          onboarding?: {
            documents: {
              type: string
              status: 'pending' | 'received' | 'verified'
              notes?: string
            }[]
            training: {
              name: string
              status: 'pending' | 'in_progress' | 'completed'
              completion_date?: string
              notes?: string
            }[]
            equipment: {
              item: string
              status: 'pending' | 'ordered' | 'delivered' | 'setup'
              notes?: string
            }[]
            access: {
              system: string
              status: 'pending' | 'requested' | 'granted'
              notes?: string
            }[]
            meetings: {
              type: string
              status: 'scheduled' | 'completed'
              date?: string
              notes?: string
            }[]
          }
          attendance?: {
            date: string
            status: 'present' | 'absent' | 'late'
            notes?: string
          }[]
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          position?: string
          role?: string
          salary?: number
          hire_date?: string
          department?: string
          user_id?: string
          created_at?: string
          status?: 'active' | 'inactive'
          emergency_contact?: {
            name: string
            phone: string
            relationship: string
          }
          skills?: string[]
          languages?: string[]
          work_preferences?: {
            remote: boolean
            flexible_hours: boolean
          }
          certifications?: {
            name: string
            date: string
            expiry_date?: string
          }[]
          career_history?: {
            position: string
            start_date: string
            end_date?: string
            department: string
            achievements: string
          }[]
          performance_reviews?: {
            date: string
            rating: number
            feedback: string
            goals: string
          }[]
          professional_goals?: {
            short_term: string[]
            long_term: string[]
          }
          training_history?: {
            name: string
            date: string
            provider: string
            status: 'completed' | 'in_progress' | 'planned'
          }[]
          administrative_info?: {
            employee_id: string
            badge_number: string
            access_level: string
            equipment: {
              type: string
              serial_number: string
              assigned_date: string
              return_date?: string
            }[]
            documents: {
              type: string
              number: string
              expiry_date: string
              file_url?: string
            }[]
          }
          leave_balance?: {
            annual: number
            sick: number
            other: number
          }
          benefits?: {
            health_insurance: boolean
            life_insurance: boolean
            retirement_plan: boolean
            other_benefits: string[]
          }
          onboarding?: {
            documents: {
              type: string
              status: 'pending' | 'received' | 'verified'
              notes?: string
            }[]
            training: {
              name: string
              status: 'pending' | 'in_progress' | 'completed'
              completion_date?: string
              notes?: string
            }[]
            equipment: {
              item: string
              status: 'pending' | 'ordered' | 'delivered' | 'setup'
              notes?: string
            }[]
            access: {
              system: string
              status: 'pending' | 'requested' | 'granted'
              notes?: string
            }[]
            meetings: {
              type: string
              status: 'scheduled' | 'completed'
              date?: string
              notes?: string
            }[]
          }
          attendance?: {
            date: string
            status: 'present' | 'absent' | 'late'
            notes?: string
          }[]
        }
      }
      absences: {
        Row: {
          id: string
          employee_id: string
          start_date: string
          end_date: string
          type: 'annual' | 'sick' | 'other'
          status: 'pending' | 'approved' | 'rejected'
          reason: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          start_date: string
          end_date: string
          type: 'annual' | 'sick' | 'other'
          status?: 'pending' | 'approved' | 'rejected'
          reason: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          start_date?: string
          end_date?: string
          type?: 'annual' | 'sick' | 'other'
          status?: 'pending' | 'approved' | 'rejected'
          reason?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      social_media_stats: {
        Row: {
          id: string;
          created_at: string;
          platform: string;
          followers: number;
          growth: number;
          likes: number;
          engagement: number;
          user_id: string;
        };
      };
      social_media_posts: {
        Row: {
          id: string;
          created_at: string;
          platform: string;
          title: string;
          content: string;
          engagement: number;
          likes: number;
          shares: number;
          publish_date: string;
          status: 'draft' | 'published' | 'scheduled';
          user_id: string;
        };
      };
      email_campaigns: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          subject: string;
          content: string;
          recipients: number;
          open_rate: number;
          click_rate: number;
          status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
          scheduled_date?: string;
          sent_date?: string;
          user_id: string;
        };
      };
      social_media_connections: {
        Row: {
          id: string;
          created_at: string;
          platform: string;
          access_token: string;
          refresh_token?: string;
          token_expires_at?: string;
          account_id: string;
          account_name: string;
          account_type: string;
          status: 'active' | 'expired' | 'revoked';
          user_id: string;
        };
      };
      oauth_states: {
        Row: {
          id: string;
          created_at: string;
          state: string;
          platform: string;
          user_id: string;
        };
      };
    }
  }
}

export type Tables = Database['public']['Tables']
export type Module = Tables['modules']['Row']
export type Absence = Tables['absences']['Row']
// ... autres types existants