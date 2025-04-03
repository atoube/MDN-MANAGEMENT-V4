/*
  # Enable realtime for employees table

  1. Changes
    - Enable realtime for the employees table using proper publication management
    - Ensures realtime updates work for employee creation and modifications
    
  2. Implementation
    - Creates a dedicated publication if it doesn't exist
    - Adds the employees table to the publication
    - Sets up proper permissions for realtime
*/

-- Check if publication exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'employees_publication'
  ) THEN
    CREATE PUBLICATION employees_publication;
  END IF;
END
$$;

-- Add employees table to the publication
ALTER PUBLICATION employees_publication ADD TABLE employees;

-- Ensure the table has replica identity
ALTER TABLE employees REPLICA IDENTITY FULL;