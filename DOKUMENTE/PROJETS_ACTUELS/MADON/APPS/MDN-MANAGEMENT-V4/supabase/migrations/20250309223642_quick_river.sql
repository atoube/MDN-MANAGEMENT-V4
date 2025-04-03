/*
  # Create modules table and setup policies

  1. New Tables
    - `modules`
      - `id` (uuid, primary key)
      - `name` (text)
      - `path` (text)
      - `icon` (text)
      - `enabled` (boolean)
      - `order` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `modules` table
    - Add policies for admins and authenticated users

  3. Initial Data
    - Insert default modules
*/

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage modules" ON modules;
  DROP POLICY IF EXISTS "Everyone can view enabled modules" ON modules;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  icon text NOT NULL,
  enabled boolean DEFAULT true,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage modules" ON modules
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Everyone can view enabled modules" ON modules
  FOR SELECT
  TO authenticated
  USING (enabled = true);

-- Insert initial data if the table is empty
INSERT INTO modules (name, path, icon, enabled, "order")
SELECT * FROM (
  VALUES
    ('Tableau de bord', '/', 'LayoutDashboard', true, 0),
    ('Livraisons', '/deliveries', 'Truck', true, 1),
    ('Employés', '/employees', 'Users', true, 2),
    ('Vendeurs', '/sellers', 'Store', true, 3),
    ('Stocks', '/stock', 'Package', true, 4),
    ('Activités', '/tasks', 'ClipboardList', true, 5),
    ('Marketing', '/marketing', 'Share2', true, 6),
    ('Finances', '/finance', 'DollarSign', true, 7)
) AS data(name, path, icon, enabled, "order")
WHERE NOT EXISTS (SELECT 1 FROM modules LIMIT 1);