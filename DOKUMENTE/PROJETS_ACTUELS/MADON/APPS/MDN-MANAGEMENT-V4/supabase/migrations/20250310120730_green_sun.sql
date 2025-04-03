/*
  # Fix employee RLS policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive RLS policies for employees table
    - Add proper validation constraints

  2. Security
    - Enable RLS
    - Add policies for admin, HR, and employees
    - Ensure proper data access control
*/

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "allow_manage_employees_admin" ON employees;
DROP POLICY IF EXISTS "allow_manage_employees_hr" ON employees;
DROP POLICY IF EXISTS "allow_view_own_employee_record" ON employees;

-- Create new policies
CREATE POLICY "employees_admin_all"
ON employees
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'admin@example.com' OR
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'email' = 'admin@example.com' OR
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "employees_hr_all"
ON employees
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'hr'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'hr'
);

CREATE POLICY "employees_self_read"
ON employees
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'employees' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE employees 
    ADD COLUMN status text DEFAULT 'active'::text NOT NULL;

    ALTER TABLE employees
    ADD CONSTRAINT valid_employee_status
    CHECK (status IN ('active', 'inactive'));
  END IF;
END $$;