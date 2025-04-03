/*
  # Create Tasks Table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text) - pending, in_progress, completed
      - `priority` (text) - low, medium, high
      - `due_date` (timestamptz)
      - `assigned_to` (uuid, references employees)
      - `user_id` (uuid, references users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on tasks table
    - Add policy for users to manage their own tasks
    - Add policy for assigned employees to view and update their tasks
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL,
  due_date timestamptz NOT NULL,
  assigned_to uuid REFERENCES employees(id),
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),

  -- Add constraints for valid status and priority values
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high'))
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own tasks
CREATE POLICY "Users can manage their own tasks"
ON tasks
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- Policy for assigned employees to view and update their tasks
CREATE POLICY "Employees can view and update assigned tasks"
ON tasks
FOR ALL
TO authenticated
USING (
  assigned_to IN (
    SELECT id FROM employees 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  assigned_to IN (
    SELECT id FROM employees 
    WHERE user_id = auth.uid()
  )
);