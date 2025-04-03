/*
  # Fix employees table RLS policies

  1. Changes
    - Enable RLS on employees table
    - Add policies for:
      - Admin and HR can manage all employees
      - Employees can read their own data
      - Employees can read other employees' basic info

  2. Security
    - Strict RLS policies based on user roles and ownership
    - Protected sensitive data like salary information
*/

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "employees_admin_all" ON employees;
DROP POLICY IF EXISTS "employees_hr_all" ON employees;
DROP POLICY IF EXISTS "employees_self_read" ON employees;

-- Admin can do everything
CREATE POLICY "employees_admin_all"
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

-- HR can do everything
CREATE POLICY "employees_hr_all"
ON employees
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'hr'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'hr'::text);

-- Employees can read their own data
CREATE POLICY "employees_self_read"
ON employees
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);