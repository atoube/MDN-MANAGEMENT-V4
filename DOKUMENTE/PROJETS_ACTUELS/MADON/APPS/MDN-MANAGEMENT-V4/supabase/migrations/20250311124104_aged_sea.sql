/*
  # Update Task Status Constraint

  1. Changes
    - Update status check constraint for tasks table to match frontend values
    - Add default status value
    - Add helpful comment

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing constraint if it exists
DO $$ BEGIN
  ALTER TABLE tasks DROP CONSTRAINT IF EXISTS valid_status;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add new constraint with correct values
ALTER TABLE tasks 
ADD CONSTRAINT valid_status 
CHECK (status IN ('pending', 'in_progress', 'completed'));

-- Set default status
ALTER TABLE tasks
ALTER COLUMN status SET DEFAULT 'pending';

-- Add comment explaining valid status values
COMMENT ON COLUMN tasks.status IS 'Task status: pending, in_progress, or completed';

-- Update any existing tasks with invalid status to 'pending'
UPDATE tasks 
SET status = 'pending' 
WHERE status NOT IN ('pending', 'in_progress', 'completed');