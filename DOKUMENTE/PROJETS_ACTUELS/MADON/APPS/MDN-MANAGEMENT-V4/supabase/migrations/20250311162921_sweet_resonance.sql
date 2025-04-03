/*
  # Add RLS policies for sellers table

  1. Security
    - Enable RLS on sellers table
    - Add policies for:
      - Stock managers can manage sellers
      - Authenticated users can view sellers
      - Stock managers can manage seller products

  2. Changes
    - Enable RLS on sellers table
    - Add management policy for stock managers
    - Add read policy for all authenticated users
*/

-- Enable RLS
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Allow stock managers to manage sellers
CREATE POLICY "stock_managers_manage_sellers" 
ON sellers
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE employees.user_id = auth.uid() 
    AND employees.position = 'stock_clerk'
    AND employees.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE employees.user_id = auth.uid() 
    AND employees.position = 'stock_clerk'
    AND employees.status = 'active'
  )
);

-- Allow all authenticated users to view sellers
CREATE POLICY "authenticated_users_view_sellers"
ON sellers
FOR SELECT
TO authenticated
USING (true);