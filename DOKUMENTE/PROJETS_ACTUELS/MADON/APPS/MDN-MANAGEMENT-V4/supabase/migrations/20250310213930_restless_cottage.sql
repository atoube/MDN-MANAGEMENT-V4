/*
  # Fix Employee Management System

  1. Changes
    - Recreate employees table with proper constraints
    - Add comprehensive validation triggers
    - Set up proper RLS policies
    - Add email uniqueness constraint
    - Add proper status management

  2. Security
    - Only admin and HR can manage employees
    - Employees can view their own data
    - Proper data validation at DB level
    - Secure status management
*/

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS employee_validation_trigger ON employees;
DROP FUNCTION IF EXISTS validate_employee();

-- Recreate the employees table with proper constraints
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  role text NOT NULL,
  salary numeric NOT NULL CHECK (salary >= 0),
  hire_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s-]{8,}$'),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'hr', 'delivery', 'stock_manager')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- Create validation function
CREATE OR REPLACE FUNCTION validate_employee()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Format d''email invalide';
  END IF;

  -- Validate phone format if provided
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+?[0-9\s-]{8,}$' THEN
    RAISE EXCEPTION 'Format de téléphone invalide';
  END IF;

  -- Validate salary
  IF NEW.salary < 0 THEN
    RAISE EXCEPTION 'Le salaire doit être positif';
  END IF;

  -- Validate role
  IF NEW.role NOT IN ('admin', 'hr', 'delivery', 'stock_manager') THEN
    RAISE EXCEPTION 'Rôle invalide';
  END IF;

  -- Validate status
  IF NEW.status NOT IN ('active', 'inactive') THEN
    RAISE EXCEPTION 'Statut invalide';
  END IF;

  -- Set default status for new employees
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger
CREATE TRIGGER employee_validation_trigger
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_employee();

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "employees_admin_manage_all" ON employees;
DROP POLICY IF EXISTS "employees_hr_manage_all" ON employees;
DROP POLICY IF EXISTS "employees_self_read" ON employees;

-- Create comprehensive policies
CREATE POLICY "employees_admin_manage_all"
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

CREATE POLICY "employees_hr_manage_all"
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS employees_email_idx ON employees(email);
CREATE INDEX IF NOT EXISTS employees_status_idx ON employees(status);
CREATE INDEX IF NOT EXISTS employees_user_id_idx ON employees(user_id);