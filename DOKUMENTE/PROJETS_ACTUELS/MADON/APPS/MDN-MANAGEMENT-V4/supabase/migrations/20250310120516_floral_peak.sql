/*
  # Fix employee management functionality

  1. Changes
    - Add ON DELETE CASCADE to foreign keys
    - Add missing indexes for performance
    - Ensure proper constraints
    - Update RLS policies to allow proper management

  2. Security
    - Maintain RLS policies
    - Add proper constraints
    - Ensure data integrity
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS employees_user_id_idx ON employees(user_id);
CREATE INDEX IF NOT EXISTS employees_email_idx ON employees(email);
CREATE INDEX IF NOT EXISTS employees_status_idx ON employees(status);

-- Ensure proper constraints
ALTER TABLE employees 
  DROP CONSTRAINT IF EXISTS employees_email_check,
  ADD CONSTRAINT employees_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE employees 
  DROP CONSTRAINT IF EXISTS employees_phone_check,
  ADD CONSTRAINT employees_phone_check 
    CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s-]{8,}$');

ALTER TABLE employees 
  DROP CONSTRAINT IF EXISTS employees_salary_check,
  ADD CONSTRAINT employees_salary_check 
    CHECK (salary >= 0);

-- Update foreign keys to cascade
DO $$ 
BEGIN
  -- First drop existing foreign key if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'absences_employee_id_fkey'
  ) THEN
    ALTER TABLE absences 
      DROP CONSTRAINT absences_employee_id_fkey;
  END IF;

  -- Add new foreign key with cascade
  ALTER TABLE absences 
    ADD CONSTRAINT absences_employee_id_fkey 
    FOREIGN KEY (employee_id) 
    REFERENCES employees(id) 
    ON DELETE CASCADE;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "allow_manage_employees_admin" ON employees;
DROP POLICY IF EXISTS "allow_manage_employees_hr" ON employees;
DROP POLICY IF EXISTS "allow_view_own_employee_record" ON employees;

-- Create comprehensive policies
CREATE POLICY "allow_manage_employees_admin"
ON employees
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'email'::text) = 'admin@example.com'::text OR 
  (auth.jwt() ->> 'role'::text) = 'admin'::text
)
WITH CHECK (
  (auth.jwt() ->> 'email'::text) = 'admin@example.com'::text OR 
  (auth.jwt() ->> 'role'::text) = 'admin'::text
);

CREATE POLICY "allow_manage_employees_hr"
ON employees
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'hr'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'hr'::text);

CREATE POLICY "allow_view_own_employee_record"
ON employees
FOR SELECT
TO authenticated
USING (user_id = auth.uid());