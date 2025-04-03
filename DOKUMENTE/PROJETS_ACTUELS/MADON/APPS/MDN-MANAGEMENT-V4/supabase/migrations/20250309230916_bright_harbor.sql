/*
  # Fix RLS policies for modules table

  1. Changes
    - Drop all existing policies to ensure clean state
    - Create new policies with unique names
    - Add policy for viewing modules (all authenticated users)
    - Add policy for managing modules (admin only)

  2. Security
    - All authenticated users can view modules
    - Only admin can manage modules (create, update, delete)
    - Admin is identified by email or role
*/

-- First, drop all existing policies to ensure clean state
DO $$ 
BEGIN
  -- Drop all policies on the modules table
  EXECUTE (
    SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON modules;', E'\n')
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'modules'
  );
END $$;

-- Create new policies with unique names
-- Policy for viewing modules (all authenticated users)
CREATE POLICY "view_modules_policy" ON modules
FOR SELECT
TO authenticated
USING (true);

-- Policy for managing modules (admin only)
CREATE POLICY "manage_modules_policy" ON modules
FOR ALL
TO authenticated
USING (
  auth.jwt()->>'email' = 'admin@example.com' OR
  auth.jwt()->>'role' = 'admin'
)
WITH CHECK (
  auth.jwt()->>'email' = 'admin@example.com' OR
  auth.jwt()->>'role' = 'admin'
);