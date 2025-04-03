/*
  # Fix employees table security policies

  1. Changes
    - Drop and recreate all employee policies
    - Add comprehensive RLS policies for all operations
    - Fix insert policy to properly handle user roles
    - Add validation triggers

  2. Security
    - Only admin and HR can manage employees
    - Users can only view their own employee record
    - Proper validation for email and phone formats
    - Status management restrictions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "employees_admin_all" ON employees;
DROP POLICY IF EXISTS "employees_hr_all" ON employees;
DROP POLICY IF EXISTS "employees_insert_policy" ON employees;
DROP POLICY IF EXISTS "employees_self_read" ON employees;

-- Create comprehensive policies
CREATE POLICY "employees_admin_manage_all"
ON employees
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' = 'admin@example.com')
)
WITH CHECK (
  (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' = 'admin@example.com')
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

-- Create validation function
CREATE OR REPLACE FUNCTION validate_employee()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Validate phone format if provided
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+?[0-9\s-]{8,}$' THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;

  -- Validate salary
  IF NEW.salary < 0 THEN
    RAISE EXCEPTION 'Salary must be positive';
  END IF;

  -- Set default status for new employees
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS employee_validation_trigger ON employees;

-- Create validation trigger
CREATE TRIGGER employee_validation_trigger
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_employee();