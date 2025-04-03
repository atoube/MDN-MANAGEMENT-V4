/*
  # Fix Deliveries and Clients Relationship

  1. Changes
    - Create clients table if it doesn't exist
    - Add client_id column to deliveries table
    - Set up proper foreign key relationship
    - Add RLS policies for clients table

  2. Security
    - Enable RLS on clients table
    - Add appropriate policies for client management
*/

-- First check if clients table exists, if not create it
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    user_id uuid REFERENCES users(id)
  );
END $$;

-- Enable RLS on clients if not already enabled
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Add client_id column to deliveries table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'deliveries' 
    AND column_name = 'client_id'
  ) THEN
    ALTER TABLE deliveries ADD COLUMN client_id uuid;
  END IF;
END $$;

-- Add client relationship to deliveries table
DO $$ BEGIN
  -- Drop existing incorrect foreign key if it exists
  ALTER TABLE deliveries 
    DROP CONSTRAINT IF EXISTS deliveries_client_id_fkey;

  -- Add correct foreign key to clients table
  ALTER TABLE deliveries
    ADD CONSTRAINT deliveries_client_id_fkey 
    FOREIGN KEY (client_id) 
    REFERENCES clients(id);
END $$;

-- Add RLS policies for clients if they don't exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
  CREATE POLICY "Users can insert own clients" ON clients
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can read own clients" ON clients;
  CREATE POLICY "Users can read own clients" ON clients
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own clients" ON clients;
  CREATE POLICY "Users can update own clients" ON clients
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;