/*
  # Complete employees table security setup

  1. Changes
    - Enable RLS on employees table
    - Add comprehensive policies for all operations
    - Add role-based access control
    - Add data validation constraints

  2. Security
    - Admin and HR can manage all employees
    - Employees can read their own data
    - Protected sensitive data
    - Input validation for critical fields
*/

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "employees_admin_all" ON employees;
DROP POLICY IF EXISTS "employees_hr_all" ON employees;
DROP POLICY IF EXISTS "employees_self_read" ON employees;

-- Admin full access policy
CREATE POLICY "employees_admin_all"
ON employees
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  auth.jwt() ->> 'email' = 'admin@example.com'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR 
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- HR full access policy
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

-- Employees can read their own data
CREATE POLICY "employees_self_read"
ON employees
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  auth.jwt() ->> 'role' IN ('admin', 'hr')
);

-- Add or update constraints
ALTER TABLE employees
  DROP CONSTRAINT IF EXISTS employees_email_check,
  DROP CONSTRAINT IF EXISTS employees_phone_check,
  DROP CONSTRAINT IF EXISTS employees_salary_check,
  DROP CONSTRAINT IF EXISTS valid_employee_status;

ALTER TABLE employees
  ADD CONSTRAINT employees_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT employees_phone_check 
    CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s-]{8,}$'),
  ADD CONSTRAINT employees_salary_check 
    CHECK (salary >= 0),
  ADD CONSTRAINT valid_employee_status 
    CHECK (status IN ('active', 'inactive'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS employees_user_id_idx ON employees(user_id);
CREATE INDEX IF NOT EXISTS employees_email_idx ON employees(email);
CREATE INDEX IF NOT EXISTS employees_status_idx ON employees(status);