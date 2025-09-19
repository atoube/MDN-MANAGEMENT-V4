export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
} 