/*
  # Update delivery system and add delivery costs

  1. Changes
    - Update RLS policies for deliveries table
    - Update RLS policies for delivery_items table
    - Update RLS policies for delivery_tracking table
    - Update RLS policies for delivery_costs table
    - Add trigger to update product stock on delivery completion

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Enable RLS
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_costs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage deliveries" ON deliveries;
DROP POLICY IF EXISTS "Users can manage delivery items" ON delivery_items;
DROP POLICY IF EXISTS "Users can manage delivery tracking" ON delivery_tracking;
DROP POLICY IF EXISTS "Users can manage delivery costs" ON delivery_costs;

-- Deliveries policies
CREATE POLICY "Users can create deliveries"
ON deliveries FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view all deliveries"
ON deliveries FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Delivery personnel can update assigned deliveries"
ON deliveries FOR UPDATE
TO authenticated
USING (
  delivery_person_id IN (
    SELECT id FROM employees 
    WHERE user_id = auth.uid()
  )
);

-- Delivery items policies
CREATE POLICY "Users can create delivery items"
ON delivery_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view delivery items"
ON delivery_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Delivery personnel can update items"
ON delivery_items FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM deliveries d
    JOIN employees e ON e.id = d.delivery_person_id
    WHERE d.id = delivery_items.delivery_id
    AND e.user_id = auth.uid()
  )
);

-- Delivery tracking policies
CREATE POLICY "Users can create tracking entries"
ON delivery_tracking FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view tracking"
ON delivery_tracking FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Delivery personnel can update tracking"
ON delivery_tracking FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM deliveries d
    JOIN employees e ON e.id = d.delivery_person_id
    WHERE d.id = delivery_tracking.delivery_id
    AND e.user_id = auth.uid()
  )
);

-- Delivery costs policies
CREATE POLICY "Users can view delivery costs"
ON delivery_costs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Delivery personnel can manage costs"
ON delivery_costs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM deliveries d
    JOIN employees e ON e.id = d.delivery_person_id
    WHERE d.id = delivery_costs.delivery_id
    AND e.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM deliveries d
    JOIN employees e ON e.id = d.delivery_person_id
    WHERE d.id = delivery_costs.delivery_id
    AND e.user_id = auth.uid()
  )
);

-- Function to update product stock on delivery completion
CREATE OR REPLACE FUNCTION update_stock_on_delivery() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Update product quantities
    UPDATE products p
    SET quantity = p.quantity - di.quantity
    FROM delivery_items di
    WHERE di.delivery_id = NEW.id
    AND di.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock updates
DROP TRIGGER IF EXISTS update_stock_on_delivery_trigger ON deliveries;
CREATE TRIGGER update_stock_on_delivery_trigger
  AFTER UPDATE ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_delivery();