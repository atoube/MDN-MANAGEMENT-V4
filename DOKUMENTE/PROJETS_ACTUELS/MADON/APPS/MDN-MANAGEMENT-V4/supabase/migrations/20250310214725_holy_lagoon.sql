/*
  # Update Employee Permissions System

  1. Changes
    - Add function to check if user is narcomc@gmail.com
    - Update RLS policies for employees table
    - Add proper role-based access control for specific email

  2. Security
    - Special permissions for narcomc@gmail.com
    - Role-based access control for HR and admin users
    - Secure helper functions
*/

-- Create helper function to check if user is narcomc@gmail.com
CREATE OR REPLACE FUNCTION is_special_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT (auth.jwt()->>'email') = 'narcomc@gmail.com';
$$;

-- Create helper function to check if user has admin/HR permissions
CREATE OR REPLACE FUNCTION has_employee_management_permission()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    is_special_admin() OR 
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND (e.role = 'admin' OR e.role = 'hr')
      AND e.status = 'active'
    );
$$;

-- Update RLS policies for employees table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "employees_admin_hr_manage" ON employees;
DROP POLICY IF EXISTS "employees_self_read" ON employees;
DROP POLICY IF EXISTS "employees_admin_manage_all" ON employees;
DROP POLICY IF EXISTS "employees_hr_manage_all" ON employees;

-- Create new policies
CREATE POLICY "employees_management"
ON employees
USING (
  has_employee_management_permission() OR 
  auth.uid() = user_id
)
WITH CHECK (
  has_employee_management_permission()
);

CREATE POLICY "employees_read"
ON employees
FOR SELECT
USING (
  auth.uid() = user_id OR
  has_employee_management_permission()
);

-- Update create_employee function
CREATE OR REPLACE FUNCTION create_employee(
  first_name text,
  last_name text,
  email text,
  phone text,
  role text,
  salary numeric,
  hire_date date
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  new_employee_id uuid;
BEGIN
  -- Check if caller has permission
  IF NOT has_employee_management_permission() THEN
    RAISE EXCEPTION 'permission_denied';
  END IF;

  -- Only special admin or existing admins can create admin users
  IF role = 'admin' AND NOT is_special_admin() AND NOT EXISTS (
    SELECT 1 FROM employees 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'only_admin_can_create_admin';
  END IF;

  -- Validate inputs
  IF NOT email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  IF phone IS NOT NULL AND NOT phone ~ '^\+?[0-9\s-]{8,}$' THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;

  IF salary < 0 THEN
    RAISE EXCEPTION 'invalid_salary';
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM employees WHERE employees.email = create_employee.email) THEN
    RAISE EXCEPTION 'email_exists';
  END IF;

  -- Create auth user
  INSERT INTO auth.users (
    email,
    raw_user_meta_data,
    role,
    email_confirmed_at
  )
  VALUES (
    email,
    jsonb_build_object(
      'role', role,
      'first_name', first_name,
      'last_name', last_name
    ),
    'authenticated',
    now()
  )
  RETURNING id INTO new_user_id;

  -- Create employee record
  INSERT INTO employees (
    first_name,
    last_name,
    email,
    phone,
    role,
    salary,
    hire_date,
    user_id,
    status
  )
  VALUES (
    first_name,
    last_name,
    email,
    phone,
    role,
    salary,
    hire_date,
    new_user_id,
    'active'
  )
  RETURNING id INTO new_employee_id;

  RETURN json_build_object(
    'employee_id', new_employee_id,
    'user_id', new_user_id
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Clean up auth user if employee creation fails
    IF new_user_id IS NOT NULL THEN
      DELETE FROM auth.users WHERE id = new_user_id;
    END IF;
    RAISE;
END;
$$;