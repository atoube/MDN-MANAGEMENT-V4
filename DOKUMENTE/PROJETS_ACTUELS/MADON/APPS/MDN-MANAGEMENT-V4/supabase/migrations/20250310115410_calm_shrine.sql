/*
  # Update employees table RLS policies

  1. Security Changes
    - Enable RLS on employees table if not already enabled
    - Ensure policies exist for:
      - HR role management
      - User self-view
      - Admin management
    
  2. Implementation
    - Uses DO blocks to safely check and create policies
    - Avoids duplicate policy creation
*/

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- HR management policy
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "HR can manage employees" ON employees;
  CREATE POLICY "HR can manage employees"
    ON employees
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'hr'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'hr'::text);
END $$;

-- User self-view policy
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own employee record" ON employees;
  CREATE POLICY "Users can view their own employee record"
    ON employees
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Admin management policy
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admin can manage employees" ON employees;
  CREATE POLICY "Admin can manage employees"
    ON employees
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);
END $$;