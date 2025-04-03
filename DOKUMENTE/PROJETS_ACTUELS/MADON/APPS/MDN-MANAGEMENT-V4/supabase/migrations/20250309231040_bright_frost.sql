/*
  # Fix RLS policies for modules table

  1. Changes
    - Enable RLS on modules table
    - Drop all existing policies
    - Create new policies:
      - View policy for all authenticated users
      - Manage policy for admin users
    
  2. Security
    - All authenticated users can view modules
    - Only admin users can manage (create, update, delete) modules
    - Admin is identified by email or role
*/

-- Enable RLS on modules table
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "view_modules_policy" ON modules;
DROP POLICY IF EXISTS "manage_modules_policy" ON modules;

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