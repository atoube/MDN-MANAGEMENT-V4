/*
  # Add Modules and Finance Tables

  1. New Tables
    - `modules`
      - `id` (uuid, primary key)
      - `name` (text)
      - `path` (text)
      - `icon` (text)
      - `enabled` (boolean)
      - `order` (integer)
      - `created_at` (timestamp)

    - `transactions`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `type` (text)
      - `amount` (numeric)
      - `description` (text)
      - `category` (text)
      - `reference` (text)
      - `status` (text)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  icon text NOT NULL,
  enabled boolean DEFAULT true,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL CHECK (amount >= 0),
  description text NOT NULL,
  category text NOT NULL,
  reference text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for modules
CREATE POLICY "Admins can manage modules"
  ON modules
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Everyone can view enabled modules"
  ON modules
  FOR SELECT
  TO authenticated
  USING (enabled = true);

-- Policies for transactions
CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default modules
INSERT INTO modules (name, path, icon, enabled, "order") VALUES
  ('Tableau de bord', '/', 'LayoutDashboard', true, 0),
  ('Livraisons', '/deliveries', 'Truck', true, 1),
  ('Employés', '/employees', 'Users', true, 2),
  ('Vendeurs', '/sellers', 'Store', true, 3),
  ('Stocks', '/stock', 'Package', true, 4),
  ('Activités', '/tasks', 'ClipboardList', true, 5),
  ('Marketing', '/marketing', 'Share2', true, 6),
  ('Finances', '/finance', 'DollarSign', true, 7);