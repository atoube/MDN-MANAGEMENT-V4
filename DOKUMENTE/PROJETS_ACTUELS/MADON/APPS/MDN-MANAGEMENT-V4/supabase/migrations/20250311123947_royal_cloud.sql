/*
  # Add Priority Column to Tasks Table

  1. Changes
    - Add priority column to tasks table
    - Add check constraint for valid priority values
    - Update existing RLS policies

  2. Security
    - Maintain existing RLS policies
    - Add validation for priority values
*/

-- Add priority column with check constraint
ALTER TABLE tasks 
ADD COLUMN priority text NOT NULL DEFAULT 'medium'
CHECK (priority IN ('low', 'medium', 'high'));

-- Add comment to explain priority values
COMMENT ON COLUMN tasks.priority IS 'Task priority level: low, medium, or high';

-- Update existing tasks to have a default priority
UPDATE tasks SET priority = 'medium' WHERE priority IS NULL;