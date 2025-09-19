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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'active' | 'completed' | 'archived'
          priority: 'low' | 'medium' | 'high'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status: 'active' | 'completed' | 'archived'
          priority: 'low' | 'medium' | 'high'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'completed' | 'archived'
          priority?: 'low' | 'medium' | 'high'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_documents: {
        Row: {
          id: string
          name: string
          description: string | null
          file_path: string
          file_type: string
          file_size: number
          created_at: string
          created_by: string
          project_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          file_path: string
          file_type: string
          file_size: number
          created_at?: string
          created_by: string
          project_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          file_path?: string
          file_type?: string
          file_size?: number
          created_at?: string
          created_by?: string
          project_id?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'member' | 'admin' | 'creator'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: 'member' | 'admin' | 'creator'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'member' | 'admin' | 'creator'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
