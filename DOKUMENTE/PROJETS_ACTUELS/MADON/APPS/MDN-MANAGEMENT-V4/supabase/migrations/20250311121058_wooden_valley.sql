/*
  # Fix tasks table relationship with employees

  1. Changes
    - Add assigned_to column to tasks table
    - Add foreign key constraint to employees table
    - Enable RLS
    - Add RLS policies for task management

  2. Security
    - Enable RLS on tasks table
    - Add policies for task management:
      - Users can view tasks they created or are assigned to
      - Users can manage tasks they created
*/

-- Add assigned_to column and foreign key
DO $$ BEGIN
  ALTER TABLE tasks 
    ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES employees(id);
END $$;

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DO $$ BEGIN
  -- Drop existing policies if any
  DROP POLICY IF EXISTS "Users can view assigned tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;

  -- Create new policies
  CREATE POLICY "Users can view assigned tasks" ON tasks
    FOR SELECT TO authenticated
    USING (
      auth.uid() = user_id 
      OR 
      assigned_to IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can manage own tasks" ON tasks
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;