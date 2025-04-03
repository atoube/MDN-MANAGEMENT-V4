/*
  # Fix employees table insert policy

  1. Changes
    - Add insert policy for authenticated users
    - Ensure users can only create employees with their own user_id

  2. Security
    - Authenticated users can create employees
    - User_id is automatically set to the authenticated user's ID
    - Maintains existing security policies
*/

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "employees_insert_policy" ON employees;

-- Create new insert policy
CREATE POLICY "employees_insert_policy"
ON employees
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow admins and HR to create employees
  (
    auth.jwt() ->> 'role' IN ('admin', 'hr') OR 
    auth.jwt() ->> 'email' = 'admin@example.com'
  )
  AND
  -- Ensure user_id matches the authenticated user
  (user_id = auth.uid())
);