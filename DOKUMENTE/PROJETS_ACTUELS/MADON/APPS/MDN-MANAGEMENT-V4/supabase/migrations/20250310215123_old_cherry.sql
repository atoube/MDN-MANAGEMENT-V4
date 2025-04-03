/*
  # Fix Create Employee Function

  1. Changes
    - Drop existing create_employee function
    - Recreate function with improved parameter naming
    - Maintain all existing security and validation checks
    - Fix role ambiguity issues
*/

-- Drop existing function first
DROP FUNCTION IF EXISTS create_employee(text, text, text, text, text, numeric, date);

-- Recreate function with fixed parameter names
CREATE OR REPLACE FUNCTION create_employee(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_role text,
  p_salary numeric,
  p_hire_date date
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
  IF p_role = 'admin' AND NOT is_special_admin() AND NOT EXISTS (
    SELECT 1 FROM employees 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'only_admin_can_create_admin';
  END IF;

  -- Validate inputs
  IF NOT p_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  IF p_phone IS NOT NULL AND NOT p_phone ~ '^\+?[0-9\s-]{8,}$' THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;

  IF p_salary < 0 THEN
    RAISE EXCEPTION 'invalid_salary';
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM employees WHERE email = p_email) THEN
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
    p_email,
    jsonb_build_object(
      'role', p_role,
      'first_name', p_first_name,
      'last_name', p_last_name
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
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    p_role,
    p_salary,
    p_hire_date,
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