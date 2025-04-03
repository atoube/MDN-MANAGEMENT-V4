/*
  # Fix employee creation process

  1. Changes
    - Create function to handle employee creation with proper user account setup
    - Add validation for email uniqueness
    - Add proper error handling

  2. Security
    - Ensure proper role assignment
    - Validate input data
*/

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
AS $$
DECLARE
  v_user_id uuid;
  v_employee_id uuid;
BEGIN
  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  -- Validate phone format if provided
  IF p_phone IS NOT NULL AND p_phone !~ '^\+?[0-9\s-]{8,}$' THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;

  -- Validate salary
  IF p_salary < 0 THEN
    RAISE EXCEPTION 'invalid_salary';
  END IF;

  -- Check if email already exists in auth.users
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = p_email
  ) THEN
    RAISE EXCEPTION 'email_exists';
  END IF;

  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt('temporary_password', gen_salt('bf')), -- Temporary password
    NOW(),
    jsonb_build_object('role', p_role),
    jsonb_build_object(
      'first_name', p_first_name,
      'last_name', p_last_name
    ),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO v_user_id;

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
    v_user_id,
    'active'
  )
  RETURNING id INTO v_employee_id;

  RETURN json_build_object(
    'user_id', v_user_id,
    'employee_id', v_employee_id
  );

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'email_exists';
  WHEN OTHERS THEN
    RAISE;
END;
$$;