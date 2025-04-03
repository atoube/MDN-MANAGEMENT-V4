/*
  # Update RLS policies for modules table

  1. Security Changes
    - Remove existing policies
    - Add new policies for:
      - Viewing modules (all authenticated users)
      - Managing modules (admin only)
    
  Note: Uses DO blocks to safely check for and remove existing policies
*/

-- Safely remove existing policies using anonymous PL/pgSQL blocks
DO $$ 
BEGIN
  -- Remove existing policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'modules'
  ) THEN
    DROP POLICY IF EXISTS "View all modules" ON modules;
    DROP POLICY IF EXISTS "Manage modules as admin" ON modules;
    DROP POLICY IF EXISTS "Anyone can view modules" ON modules;
    DROP POLICY IF EXISTS "Admins can manage modules" ON modules;
    DROP POLICY IF EXISTS "Admins can update module order" ON modules;
    DROP POLICY IF EXISTS "Users can view enabled modules" ON modules;
    DROP POLICY IF EXISTS "Admins can manage all modules" ON modules;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "View all modules"
  ON modules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Manage modules as admin"
  ON modules
  FOR ALL
  TO public
  USING (((auth.jwt() ->> 'email'::text) = 'admin@example.com'::text) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text))
  WITH CHECK (((auth.jwt() ->> 'email'::text) = 'admin@example.com'::text) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text));