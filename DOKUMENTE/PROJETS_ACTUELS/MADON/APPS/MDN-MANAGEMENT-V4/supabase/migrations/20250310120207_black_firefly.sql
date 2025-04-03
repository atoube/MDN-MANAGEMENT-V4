/*
  # Fix employee table RLS policies

  1. Changes
    - Add status column to employees table
    - Drop and recreate RLS policies with proper conditions
    - Ensure proper access control for all roles

  2. Security
    - Enable RLS on employees table
    - Admin and HR can manage all employees
    - Users can view their own records
    - All policies use proper auth checks
*/

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'status'
  ) THEN
    ALTER TABLE employees ADD COLUMN status text DEFAULT 'active'::text;
    ALTER TABLE employees ADD CONSTRAINT valid_employee_status 
      CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text]));
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "HR can manage employees" ON employees;
DROP POLICY IF EXISTS "Users can view their own employee record" ON employees;
DROP POLICY IF EXISTS "Admin can manage employees" ON employees;
DROP POLICY IF EXISTS "allow_admin_manage_employees" ON employees;
DROP POLICY IF EXISTS "allow_hr_manage_employees" ON employees;
DROP POLICY IF EXISTS "allow_users_view_own_record" ON employees;

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create new policies

-- Allow admin to manage all employees (both by email and role)
CREATE POLICY "allow_manage_employees_admin"
ON employees
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'email'::text) = 'admin@example.com'::text OR 
  (auth.jwt() ->> 'role'::text) = 'admin'::text
)
WITH CHECK (
  (auth.jwt() ->> 'email'::text) = 'admin@example.com'::text OR 
  (auth.jwt() ->> 'role'::text) = 'admin'::text
);

-- Allow HR to manage all employees
CREATE POLICY "allow_manage_employees_hr"
ON employees
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'hr'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'hr'::text);

-- Allow users to view their own record
CREATE POLICY "allow_view_own_employee_record"
ON employees
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update existing records to have status if needed
UPDATE employees SET status = 'active' WHERE status IS NULL;