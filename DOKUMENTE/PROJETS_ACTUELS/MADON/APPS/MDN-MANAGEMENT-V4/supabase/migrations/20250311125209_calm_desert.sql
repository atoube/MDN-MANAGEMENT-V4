/*
  # Add RLS Policy for Clients Table

  1. Security
    - Enable RLS on clients table
    - Add policy for authenticated users to manage their own clients
    - Add policy for delivery personnel to view all clients
*/

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own clients
CREATE POLICY "Users can manage their own clients"
ON clients
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- Policy for delivery personnel to view all clients
CREATE POLICY "Delivery personnel can view all clients"
ON clients
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees
    WHERE employees.user_id = auth.uid()
    AND employees.position = 'delivery_driver'
  )
);