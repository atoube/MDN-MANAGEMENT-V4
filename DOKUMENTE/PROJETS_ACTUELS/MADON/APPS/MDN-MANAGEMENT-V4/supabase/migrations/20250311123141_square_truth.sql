/*
  # Implement Role Management System with Safe Column Addition

  1. Changes
    - Create enums for roles and positions
    - Add role management tables
    - Safely update employees table
    - Add proper RLS policies
    
  2. Security
    - Separate application user roles from employee roles
    - Role-based access control
    - Safe data migration
*/

-- Create enum for application user roles
CREATE TYPE app_role AS ENUM (
  'admin',           -- Full system access
  'hr_manager',      -- HR management access
  'stock_manager',   -- Stock management access
  'finance_manager', -- Finance management access
  'sales_manager',   -- Sales management access
  'basic_user'       -- Basic access
);

-- Create enum for employee positions
CREATE TYPE employee_position AS ENUM (
  'director',        -- Company director
  'hr_officer',      -- HR department
  'accountant',      -- Finance department
  'sales_rep',       -- Sales department
  'stock_clerk',     -- Stock management
  'delivery_driver', -- Delivery personnel
  'technician',      -- Technical staff
  'support_staff'    -- Support personnel
);

-- Create role permissions table
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  module text NOT NULL,
  can_view boolean DEFAULT false,
  can_create boolean DEFAULT false,
  can_edit boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, module)
);

-- Add role column to auth.users (custom claims)
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'basic_user'::app_role;

-- Safely update employees table
DO $$ 
BEGIN
  -- Add position column as nullable first
  ALTER TABLE employees ADD COLUMN IF NOT EXISTS position employee_position;
  
  -- Set default position for existing employees
  UPDATE employees SET position = 'support_staff'::employee_position WHERE position IS NULL;
  
  -- Make position required
  ALTER TABLE employees ALTER COLUMN position SET NOT NULL;
  
  -- Add other new columns
  ALTER TABLE employees 
    ADD COLUMN IF NOT EXISTS department text,
    ADD COLUMN IF NOT EXISTS reports_to uuid REFERENCES employees(id),
    ADD COLUMN IF NOT EXISTS is_manager boolean DEFAULT false;
END $$;

-- Create department table
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  manager_id uuid REFERENCES employees(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for role_permissions
CREATE POLICY "Admin can manage role permissions"
ON role_permissions
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view role permissions"
ON role_permissions
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for departments
CREATE POLICY "Admin and HR can manage departments"
ON departments
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' IN ('admin', 'hr_manager')
)
WITH CHECK (
  auth.jwt() ->> 'role' IN ('admin', 'hr_manager')
);

CREATE POLICY "Users can view departments"
ON departments
FOR SELECT
TO authenticated
USING (true);

-- Update employees RLS policies
DROP POLICY IF EXISTS "HR and admin can manage employees" ON employees;
DROP POLICY IF EXISTS "Employees can view own record" ON employees;

CREATE POLICY "Role-based employee management"
ON employees
FOR ALL
TO authenticated
USING (
  CASE auth.jwt() ->> 'role'
    WHEN 'admin' THEN true
    WHEN 'hr_manager' THEN true
    ELSE (
      -- Users can view their own record
      auth.uid() = user_id
      OR
      -- Managers can view their department members
      (
        is_manager = true
        AND
        EXISTS (
          SELECT 1 FROM employees e
          WHERE e.reports_to = employees.id
          AND e.user_id = auth.uid()
        )
      )
    )
  END
)
WITH CHECK (
  CASE auth.jwt() ->> 'role'
    WHEN 'admin' THEN true
    WHEN 'hr_manager' THEN true
    ELSE false
  END
);

-- Insert default permissions for admin
INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete)
VALUES
  ('admin', 'employees', true, true, true, true),
  ('admin', 'finance', true, true, true, true),
  ('admin', 'stock', true, true, true, true),
  ('admin', 'sales', true, true, true, true),
  ('hr_manager', 'employees', true, true, true, false),
  ('finance_manager', 'finance', true, true, true, false),
  ('stock_manager', 'stock', true, true, true, false),
  ('sales_manager', 'sales', true, true, true, false),
  ('basic_user', 'employees', true, false, false, false),
  ('basic_user', 'finance', true, false, false, false),
  ('basic_user', 'stock', true, false, false, false),
  ('basic_user', 'sales', true, false, false, false);

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
  user_role app_role,
  module_name text,
  permission text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM role_permissions
    WHERE role = user_role
    AND module = module_name
    AND CASE permission
      WHEN 'view' THEN can_view
      WHEN 'create' THEN can_create
      WHEN 'edit' THEN can_edit
      WHEN 'delete' THEN can_delete
      ELSE false
    END
  );
END;
$$;

-- Update employee validation function
CREATE OR REPLACE FUNCTION validate_employee()
RETURNS trigger AS $$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  -- Validate phone format if provided
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+?[0-9\s-]{8,}$' THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;

  -- Validate salary
  IF NEW.salary < 0 THEN
    RAISE EXCEPTION 'invalid_salary';
  END IF;

  -- Check for duplicate email
  IF EXISTS (
    SELECT 1 FROM employees 
    WHERE email = NEW.email 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'email_exists';
  END IF;

  -- Set is_manager based on position
  NEW.is_manager := NEW.position IN ('director', 'hr_officer');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;