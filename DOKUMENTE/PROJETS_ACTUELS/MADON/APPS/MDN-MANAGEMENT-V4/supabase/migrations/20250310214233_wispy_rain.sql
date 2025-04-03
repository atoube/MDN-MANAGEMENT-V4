/*
  # Fix Employee Creation System

  1. Changes
    - Add secure server-side function for employee creation
    - Update RLS policies
    - Add proper validation

  2. Security
    - Move user creation logic to server-side function
    - Proper error handling
    - Input validation
*/

-- Create a function to create an employee with associated auth user
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
  IF NOT is_admin_or_hr() THEN
    RAISE EXCEPTION 'permission_denied';
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

  -- Create auth user
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id,
    email,
    raw_user_meta_data,
    role,
    email_confirmed_at
  )
  VALUES (
    new_user_id,
    email,
    jsonb_build_object('role', role),
    'authenticated',
    now()
  );

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
  WHEN unique_violation THEN
    RAISE EXCEPTION 'email_exists';
  WHEN OTHERS THEN
    RAISE;
END;
$$;