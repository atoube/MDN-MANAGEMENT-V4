/*
  # Fix Employee RLS Policy

  1. Changes
    - Fix infinite recursion in employee RLS policy
    - Simplify manager access check
    - Maintain existing security model
  
  2. Security
    - Maintain role-based access control
    - Fix performance issues
    - Keep data access secure
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Role-based employee management" ON employees;

-- Create new policy with fixed manager check
CREATE POLICY "Role-based employee management"
ON employees
FOR ALL
TO authenticated
USING (
  CASE auth.jwt() ->> 'role'
    WHEN 'admin' THEN true
    WHEN 'hr_manager' THEN true
    ELSE (
      -- Users can access their own record
      auth.uid() = user_id
      OR
      -- Managers can access their direct reports
      (
        is_manager = true
        AND
        reports_to IN (
          SELECT id 
          FROM employees 
          WHERE user_id = auth.uid()
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