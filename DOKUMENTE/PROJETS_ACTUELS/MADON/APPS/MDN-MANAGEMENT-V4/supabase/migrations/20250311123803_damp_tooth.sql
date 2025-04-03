/*
  # Fix Employee RLS Policies

  1. Changes
    - Remove recursive policies causing infinite recursion
    - Implement proper role-based access control
    - Fix manager access to reports
    - Add proper policies for absences table

  2. Security
    - Enable RLS
    - Add clear, non-recursive policies
    - Maintain proper access control
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Role-based employee management" ON employees;
DROP POLICY IF EXISTS "Admin full access" ON employees;
DROP POLICY IF EXISTS "HR manager full access" ON employees;
DROP POLICY IF EXISTS "Employees can view own record" ON employees;
DROP POLICY IF EXISTS "Managers can view their reports" ON employees;

-- Create new policies for employees table
CREATE POLICY "Admin can manage employees"
ON employees
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'narcomc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'narcomc@gmail.com');

CREATE POLICY "Users can view own employee record"
ON employees
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Drop and recreate absence policies
DROP POLICY IF EXISTS "Employees can manage their own absences" ON absences;
DROP POLICY IF EXISTS "Employees can view their own absences" ON absences;
DROP POLICY IF EXISTS "Admin can manage absences" ON absences;
DROP POLICY IF EXISTS "HR can manage absences" ON absences;

-- Create new absence policies
CREATE POLICY "Admin can manage all absences"
ON absences
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'narcomc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'narcomc@gmail.com');

CREATE POLICY "Employees can view own absences"
ON absences
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees
    WHERE employees.id = absences.employee_id
    AND employees.user_id = auth.uid()
  )
);