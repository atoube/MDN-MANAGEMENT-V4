/*
  # Fix Employee Management System

  1. Changes
    - Add proper role management in auth.users
    - Update RLS policies with proper role checks
    - Add function to manage user roles
    - Ensure proper authorization flow

  2. Security
    - Secure role management
    - Proper RLS policies
    - Role-based access control
*/

-- Create a secure function to check admin and HR roles
CREATE OR REPLACE FUNCTION is_admin_or_hr() 
RETURNS boolean AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 
      FROM auth.users 
      WHERE id = auth.uid() 
      AND (
        raw_user_meta_data->>'role' = 'admin' 
        OR raw_user_meta_data->>'role' = 'hr'
        OR email = 'admin@example.com'
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employees_admin_hr_manage" ON employees;
DROP POLICY IF EXISTS "employees_view_own" ON employees;

-- Policy for admin and HR to manage all employees
CREATE POLICY "employees_admin_hr_manage"
ON employees
FOR ALL
TO authenticated
USING (
  is_admin_or_hr()
)
WITH CHECK (
  is_admin_or_hr()
);

-- Policy for employees to view their own data
CREATE POLICY "employees_view_own"
ON employees
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Function to set user role during signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN NEW.email = 'admin@example.com' THEN 
        jsonb_build_object('role', 'admin')
      ELSE 
        jsonb_build_object('role', 'employee')
    END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to set role for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();