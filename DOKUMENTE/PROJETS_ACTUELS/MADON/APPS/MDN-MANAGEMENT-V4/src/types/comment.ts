import { User } from './user';

export interface Comment {
  id: string;
  content: string;
  task_id: string;
  user: User;
  created_at: string;
  updated_at: string;
} 