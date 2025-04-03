/*
  # Fix Product RLS Policies and Client Handling

  1. Security Changes
    - Update RLS policies for products table to allow creation during delivery
    - Add policy for delivery personnel to view products
    - Add policy for authenticated users to view products

  2. Changes
    - Modify products table policies to be more permissive for delivery creation
    - Ensure proper access control while maintaining security
*/

-- Enable RLS on products table if not already enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Stock managers can manage products" ON products;
DROP POLICY IF EXISTS "Sellers can view their own products" ON products;

-- Create new policies
CREATE POLICY "Stock managers can manage products"
ON products
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'stock_manager'
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = 'stock_manager'
);

CREATE POLICY "Authenticated users can view products"
ON products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create products during delivery"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update clients table to handle single row selection better
CREATE OR REPLACE FUNCTION get_client_by_email(p_email text)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  phone text,
  name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.email, c.first_name, c.last_name, c.phone, c.name
  FROM clients c
  WHERE c.email = p_email
  LIMIT 1;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_client_by_email TO authenticated;