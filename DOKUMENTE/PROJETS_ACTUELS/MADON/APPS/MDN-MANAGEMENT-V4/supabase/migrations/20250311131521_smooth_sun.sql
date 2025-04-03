/*
  # Add Cost Column to Deliveries Table

  1. Changes
    - Add cost column to deliveries table to track delivery total cost
    - Set default value to 0 to maintain data consistency
    - Add check constraint to ensure cost is non-negative

  2. Notes
    - Cost is stored as numeric to handle currency values accurately
    - Non-negative constraint prevents invalid cost values
*/

-- Add cost column to deliveries table
ALTER TABLE deliveries 
ADD COLUMN IF NOT EXISTS cost numeric DEFAULT 0 NOT NULL;

-- Add check constraint to ensure cost is non-negative
ALTER TABLE deliveries 
ADD CONSTRAINT deliveries_cost_check 
CHECK (cost >= 0);

-- Update existing rows to calculate cost from delivery_items if needed
UPDATE deliveries d
SET cost = COALESCE(
  (
    SELECT SUM(total_price)
    FROM delivery_items
    WHERE delivery_id = d.id
  ),
  0
)
WHERE cost = 0;

COMMENT ON COLUMN deliveries.cost IS 'Total cost of the delivery including all items';