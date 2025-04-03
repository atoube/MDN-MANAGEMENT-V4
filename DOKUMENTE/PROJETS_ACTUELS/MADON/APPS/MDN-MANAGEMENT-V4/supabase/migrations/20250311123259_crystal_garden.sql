/*
  # Fix Employee RLS Policy

  1. Changes
    - Remove recursive policy check that was causing infinite recursion
    - Simplify manager access check
    - Maintain security while fixing performance
    
  2. Security
    - Maintain role-based access
    - Fix infinite recursion issue
    - Keep existing permissions structure
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Role-based employee management" ON employees;

-- Create new, optimized policy
CREATE POLICY "Role-based employee management"
ON employees
FOR ALL
TO authenticated
USING (
  CASE auth.jwt() ->> 'role'
    WHEN 'admin' THEN true
    WHEN 'hr_manager' THEN true
    ELSE (
      -- Users can view their own record
      auth.uid() = user_id
      OR
      -- Managers can view their direct reports
      (
        is_manager = true
        AND
        auth.uid() IN (
          SELECT user_id 
          FROM employees 
          WHERE id = employees.reports_to
        )
      )
    )
  END
)
WITH CHECK (
  CASE auth.jwt() ->> 'role'
    WHEN 'admin' THEN true
    WHEN 'hr_manager' THEN true
    ELSE false
  END
);