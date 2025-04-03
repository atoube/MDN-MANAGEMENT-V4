/*
  # Create delivery tracking tables

  1. New Tables
    - `delivery_items`: Stores items for each delivery
      - `id` (uuid, primary key)
      - `delivery_id` (uuid, references deliveries)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_price` (numeric)
      - `created_at` (timestamp)
    
    - `delivery_tracking`: Stores tracking updates for deliveries
      - `id` (uuid, primary key)
      - `delivery_id` (uuid, references deliveries)
      - `status` (text)
      - `location` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and managing delivery items and tracking
*/

-- Create delivery_items table
CREATE TABLE IF NOT EXISTS delivery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid REFERENCES deliveries(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create delivery_tracking table
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
ALTER TABLE delivery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery_items
CREATE POLICY "Delivery personnel can view assigned delivery items"
  ON delivery_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deliveries d
      JOIN employees e ON e.id = d.delivery_person_id
      WHERE d.id = delivery_items.delivery_id
      AND e.user_id = auth.uid()
    )
  );

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
CREATE POLICY "Delivery personnel can view assigned delivery tracking"
  ON delivery_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deliveries d
      JOIN employees e ON e.id = d.delivery_person_id
      WHERE d.id = delivery_tracking.delivery_id
      AND e.user_id = auth.uid()
    )
  );

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