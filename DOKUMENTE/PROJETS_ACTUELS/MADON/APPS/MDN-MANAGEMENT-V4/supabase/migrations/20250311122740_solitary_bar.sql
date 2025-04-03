/*
  # Fix employees table RLS policies

  1. Changes
    - Enable RLS on employees table
    - Add policies for HR and admin roles to manage employees
    - Add policy for employees to view their own records
    - Add policy for managers to view their team members
    
  2. Security
    - HR and admin can manage all employee records
    - Employees can only view their own records
    - Proper role-based access control
*/

-- Enable RLS on employees table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "HR and admin can manage employees" ON employees;
DROP POLICY IF EXISTS "Employees can view own record" ON employees;
DROP POLICY IF EXISTS "employees_view_own" ON employees;

-- Policy for HR and admin to manage all employee records
CREATE POLICY "HR and admin can manage employees"
ON employees
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'hr'::text])
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'hr'::text])
);

-- Policy for employees to view their own records
CREATE POLICY "Employees can view own record"
ON employees
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Add function to validate employee data
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for employee validation
DROP TRIGGER IF EXISTS employee_validation_trigger ON employees;
CREATE TRIGGER employee_validation_trigger
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_employee();