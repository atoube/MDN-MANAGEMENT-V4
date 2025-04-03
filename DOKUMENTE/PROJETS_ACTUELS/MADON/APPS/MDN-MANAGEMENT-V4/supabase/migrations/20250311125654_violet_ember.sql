/*
  # Update clients table RLS policies

  1. Security Changes
    - Enable RLS on clients table
    - Add policy for authenticated users to read all clients
    - Add policy for authenticated users to insert clients
    - Add policy for users to manage their own clients
*/

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can manage own clients" ON clients;
DROP POLICY IF EXISTS "Users can read all clients" ON clients;

-- Create new policies
CREATE POLICY "Users can read all clients"
ON clients FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert clients"
ON clients FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can manage own clients"
ON clients FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);