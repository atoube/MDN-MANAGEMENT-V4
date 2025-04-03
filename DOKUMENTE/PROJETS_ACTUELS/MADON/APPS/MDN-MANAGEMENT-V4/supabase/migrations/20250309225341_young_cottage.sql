/*
  # Update RLS policies for modules table

  1. Security Changes
    - Safely remove existing policies if they exist
    - Add new comprehensive policies for:
      - Reading modules (all authenticated users)
      - Managing modules (admin only)
      - Updating module order (admin only)
    
  Note: Uses DO blocks to safely check for and remove existing policies
*/

-- Safely remove existing policies using anonymous PL/pgSQL blocks
DO $$ 
BEGIN
  -- Remove "Users can view enabled modules" policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'modules' 
    AND policyname = 'Users can view enabled modules'
  ) THEN
    DROP POLICY "Users can view enabled modules" ON modules;
  END IF;

  -- Remove "Admins can manage modules" policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'modules' 
    AND policyname = 'Admins can manage modules'
  ) THEN
    DROP POLICY "Admins can manage modules" ON modules;
  END IF;

  -- Remove "Admins can update module order" policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'modules' 
    AND policyname = 'Admins can update module order'
  ) THEN
    DROP POLICY "Admins can update module order" ON modules;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Anyone can view modules"
  ON modules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage modules"
  ON modules
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update module order"
  ON modules
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);