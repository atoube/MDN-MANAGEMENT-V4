/*
  # Fix Employee Permissions System

  1. Changes
    - Add is_admin_or_hr helper function
    - Update RLS policies for employees table
    - Add proper role-based access control

  2. Security
    - Role-based access control for HR and admin users
    - Proper permission checks
    - Secure helper functions
*/

-- Create helper function to check if user is admin or HR
CREATE OR REPLACE FUNCTION is_admin_or_hr()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM employees e
    WHERE e.user_id = auth.uid()
    AND (e.role = 'admin' OR e.role = 'hr')
    AND e.status = 'active'
  );
$$;

-- Update RLS policies for employees table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "employees_admin_hr_manage" ON employees;
DROP POLICY IF EXISTS "employees_self_read" ON employees;

-- Create new policies
CREATE POLICY "employees_admin_hr_manage"
ON employees
USING (
  is_admin_or_hr() OR 
  auth.uid() = user_id
)
WITH CHECK (
  is_admin_or_hr()
);

CREATE POLICY "employees_self_read"
ON employees
FOR SELECT
USING (
  auth.uid() = user_id OR
  is_admin_or_hr()
);

-- Update create_employee function to handle permissions properly
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
  caller_role text;
BEGIN
  -- Check if caller has permission
  IF NOT is_admin_or_hr() THEN
    RAISE EXCEPTION 'permission_denied';
  END IF;

  -- Get caller's role
  SELECT e.role INTO caller_role
  FROM employees e
  WHERE e.user_id = auth.uid();

  -- Only admin can create admin users
  IF role = 'admin' AND caller_role != 'admin' THEN
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
    jsonb_build_object('role', role),
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