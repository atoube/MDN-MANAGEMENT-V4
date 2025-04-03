/*
  # Add RLS policies for absences table

  1. Security
    - Enable RLS on absences table
    - Add policies for:
      - HR management
      - Employee self-management
      - Admin management
    
  2. Implementation
    - Uses DO blocks to safely manage policies
    - Prevents duplicate policy creation
*/

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- HR management policy
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "HR can manage absences" ON absences;
  CREATE POLICY "HR can manage absences"
    ON absences
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'hr'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'hr'::text);
END $$;

-- Employee self-management policy
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Employees can manage their own absences" ON absences;
  CREATE POLICY "Employees can manage their own absences"
    ON absences
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM employees
        WHERE employees.id = absences.employee_id
        AND employees.user_id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM employees
        WHERE employees.id = absences.employee_id
        AND employees.user_id = auth.uid()
      )
    );
END $$;

-- Admin management policy
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admin can manage absences" ON absences;
  CREATE POLICY "Admin can manage absences"
    ON absences
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);
END $$;