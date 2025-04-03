/*
  # Add status column to employees table

  1. Changes
    - Add status column to employees table
    - Set default value to 'active'
    - Add check constraint for valid status values
    - Backfill existing rows with 'active' status

  2. Implementation
    - Uses IF NOT EXISTS to safely add column
    - Adds check constraint for data integrity
*/

DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'status'
  ) THEN
    ALTER TABLE employees 
    ADD COLUMN status text NOT NULL DEFAULT 'active';

    -- Add check constraint for valid status values
    ALTER TABLE employees 
    ADD CONSTRAINT valid_employee_status 
    CHECK (status IN ('active', 'inactive'));

    -- Update existing rows to have 'active' status
    UPDATE employees SET status = 'active' WHERE status IS NULL;
  END IF;
END $$;