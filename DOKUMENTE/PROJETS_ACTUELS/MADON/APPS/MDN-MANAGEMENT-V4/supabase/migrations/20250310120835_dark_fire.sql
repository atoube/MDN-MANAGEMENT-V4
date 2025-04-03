/*
  # Complete employee table setup

  1. Changes
    - Drop and recreate employees table with all required columns and constraints
    - Add proper indexes for performance
    - Set up comprehensive RLS policies
    - Add data validation constraints

  2. Security
    - Enable RLS
    - Add granular policies for different roles
    - Ensure proper data access control
    - Add email format validation
    - Add phone format validation
*/

-- Recreate employees table with all required columns and constraints
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL,
  salary numeric NOT NULL CHECK (salary >= 0),
  hire_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT valid_employee_status CHECK (status IN ('active', 'inactive')),
  CONSTRAINT valid_employee_role CHECK (role IN ('admin', 'hr', 'delivery', 'stock_manager')),
  CONSTRAINT valid_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s-]{8,}$'),
  CONSTRAINT unique_employee_email UNIQUE (email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS employees_email_idx ON employees(email);
CREATE INDEX IF NOT EXISTS employees_status_idx ON employees(status);
CREATE INDEX IF NOT EXISTS employees_user_id_idx ON employees(user_id);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "employees_admin_all" ON employees;
DROP POLICY IF EXISTS "employees_hr_all" ON employees;
DROP POLICY IF EXISTS "employees_self_read" ON employees;

-- Create comprehensive RLS policies

-- Admin can do everything
CREATE POLICY "employees_admin_all"
ON employees
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'email' = 'admin@example.com') OR 
  (auth.jwt() ->> 'role' = 'admin')
)
WITH CHECK (
  (auth.jwt() ->> 'email' = 'admin@example.com') OR 
  (auth.jwt() ->> 'role' = 'admin')
);

-- HR can do everything
CREATE POLICY "employees_hr_all"
ON employees
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role' = 'hr')
)
WITH CHECK (
  (auth.jwt() ->> 'role' = 'hr')
);

-- Employees can read their own data
CREATE POLICY "employees_self_read"
ON employees
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);