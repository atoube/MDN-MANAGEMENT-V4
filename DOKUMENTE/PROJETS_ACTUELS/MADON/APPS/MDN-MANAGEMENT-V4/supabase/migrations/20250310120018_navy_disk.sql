/*
  # Fix RLS policies for employees table

  1. Changes
    - Drop existing policies to start fresh
    - Create new policies with proper conditions
    - Ensure proper access control for different roles

  2. Security
    - Admin and HR can manage all employees
    - Users can view their own employee record
    - Policies use proper auth checks
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "HR can manage employees" ON employees;
DROP POLICY IF EXISTS "Users can view their own employee record" ON employees;
DROP POLICY IF EXISTS "Admin can manage employees" ON employees;

-- Enable RLS if not already enabled
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper conditions

-- Admin can manage all employees
CREATE POLICY "allow_admin_manage_employees"
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

-- HR can manage all employees
CREATE POLICY "allow_hr_manage_employees"
ON employees
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'hr')
WITH CHECK (auth.jwt() ->> 'role' = 'hr');

-- Users can view their own employee record
CREATE POLICY "allow_users_view_own_record"
ON employees
FOR SELECT
TO authenticated
USING (user_id = auth.uid());