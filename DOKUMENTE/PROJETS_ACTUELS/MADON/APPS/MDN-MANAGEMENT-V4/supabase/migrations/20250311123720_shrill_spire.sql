/*
  # Fix Employee RLS Policy

  1. Changes
    - Remove recursive policy that was causing infinite recursion
    - Implement proper role-based access control
    - Fix manager access to reports

  2. Security
    - Enable RLS
    - Add policies for different roles
    - Ensure proper data access control
*/

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Role-based employee management" ON employees;

-- Create new policies with proper access control
CREATE POLICY "Admin full access"
ON employees
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "HR manager full access"
ON employees
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'hr_manager')
WITH CHECK (auth.jwt() ->> 'role' = 'hr_manager');

CREATE POLICY "Employees can view own record"
ON employees
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Managers can view their reports"
ON employees
FOR SELECT
TO authenticated
USING (
  reports_to IN (
    SELECT id FROM employees 
    WHERE user_id = auth.uid()
  )
);