/*
  # Fix Clients and Employees Structure

  1. Changes
    - Add first_name and last_name columns to clients table
    - Fix infinite recursion in employees RLS policy
    - Update existing name column data in clients table

  2. Security
    - Update RLS policies to use auth.jwt() instead of users table
*/

-- Add first_name and last_name to clients
DO $$ BEGIN
  -- First backup the name column data
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS first_name text;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_name text;
  
  -- Update the new columns with split name data
  UPDATE clients 
  SET 
    first_name = SPLIT_PART(name, ' ', 1),
    last_name = SUBSTRING(name FROM POSITION(' ' IN name) + 1);

  -- Make the new columns NOT NULL after data migration
  ALTER TABLE clients ALTER COLUMN first_name SET NOT NULL;
  ALTER TABLE clients ALTER COLUMN last_name SET NOT NULL;
END $$;

-- Fix infinite recursion in employees policies
DO $$ BEGIN
  -- Drop problematic policy
  DROP POLICY IF EXISTS "employees_view_own" ON employees;
  
  -- Create new non-recursive policy using auth.jwt()
  CREATE POLICY "employees_view_own" ON employees
    FOR SELECT TO authenticated
    USING (
      auth.uid() = user_id 
      OR 
      (auth.jwt() ->> 'role')::text IN ('admin', 'hr')
    );
END $$;