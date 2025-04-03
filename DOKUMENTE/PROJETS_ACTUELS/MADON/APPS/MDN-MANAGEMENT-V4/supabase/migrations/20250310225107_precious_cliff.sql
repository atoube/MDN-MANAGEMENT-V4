/*
  # Create deliveries schema

  1. New Tables
    - `deliveries`
      - `id` (uuid, primary key)
      - `tracking_number` (text, unique)
      - `status` (text, check: pending, in_progress, delivered, cancelled)
      - `delivery_date` (date)
      - `delivery_person_id` (uuid, references employees)
      - `address` (text)
      - `cost` (numeric)
      - `created_at` (timestamptz)

    - `delivery_items`
      - `id` (uuid, primary key)
      - `delivery_id` (uuid, references deliveries)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_price` (numeric)
      - `created_at` (timestamptz)

    - `delivery_tracking`
      - `id` (uuid, primary key)
      - `delivery_id` (uuid, references deliveries)
      - `status` (text)
      - `location` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for delivery personnel and authenticated users
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Delivery personnel can manage assigned delivery items" ON delivery_items;
  DROP POLICY IF EXISTS "Delivery personnel can manage assigned delivery tracking" ON delivery_tracking;
  DROP POLICY IF EXISTS "Delivery personnel can manage assigned deliveries" ON deliveries;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create deliveries table if it doesn't exist
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'delivered', 'cancelled')),
  delivery_date date NOT NULL,
  delivery_person_id uuid REFERENCES employees(id),
  address text NOT NULL,
  cost numeric NOT NULL CHECK (cost >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create delivery_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS delivery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid REFERENCES deliveries(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create delivery_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid REFERENCES deliveries(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'delivered', 'cancelled')),
  location text,
  notes text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for deliveries
CREATE POLICY "Delivery personnel can manage assigned deliveries"
  ON deliveries
  FOR ALL
  TO authenticated
  USING (
    delivery_person_id IN (
      SELECT id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for delivery_items
CREATE POLICY "Delivery personnel can manage assigned delivery items"
  ON delivery_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deliveries d
      JOIN employees e ON e.id = d.delivery_person_id
      WHERE d.id = delivery_items.delivery_id
      AND e.user_id = auth.uid()
    )
  );

-- Create policies for delivery_tracking
CREATE POLICY "Delivery personnel can manage assigned delivery tracking"
  ON delivery_tracking
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deliveries d
      JOIN employees e ON e.id = d.delivery_person_id
      WHERE d.id = delivery_tracking.delivery_id
      AND e.user_id = auth.uid()
    )
  );

-- Create function to generate tracking number
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS trigger AS $$
BEGIN
  NEW.tracking_number := 'DEL-' || to_char(NEW.created_at, 'YYYYMMDD') || '-' || 
                        substring(NEW.id::text from 1 for 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tracking number generation
DROP TRIGGER IF EXISTS set_tracking_number ON deliveries;
CREATE TRIGGER set_tracking_number
  BEFORE INSERT ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION generate_tracking_number();