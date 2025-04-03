/*
  # Fix Sellers RLS Policies

  1. Security Changes
    - Enable RLS on sellers table
    - Add policies for:
      - Authenticated users can view all sellers
      - Users can manage their own sellers
      - Stock managers can manage all sellers

  2. Changes
    - Drop existing policies if any
    - Enable RLS
    - Add new policies with proper conditions
*/

-- Enable RLS
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage their own sellers" ON sellers;
DROP POLICY IF EXISTS "Stock managers can manage sellers" ON sellers;
DROP POLICY IF EXISTS "authenticated_users_view_sellers" ON sellers;

-- Allow users to manage their own sellers
CREATE POLICY "Users can manage their own sellers"
ON sellers
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow stock managers to manage all sellers
CREATE POLICY "Stock managers can manage sellers"
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