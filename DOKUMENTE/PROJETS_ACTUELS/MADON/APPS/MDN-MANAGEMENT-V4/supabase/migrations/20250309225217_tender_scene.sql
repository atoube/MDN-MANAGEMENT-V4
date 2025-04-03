/*
  # Add RLS policies for modules table

  1. Security
    - Enable RLS on modules table
    - Add policy for authenticated users to read enabled modules
    - Add policy for admins to manage all modules
*/

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Policy for reading enabled modules (all authenticated users)
CREATE POLICY "Users can view enabled modules"
  ON modules
  FOR SELECT
  TO authenticated
  USING (enabled = true);

-- Policy for managing all modules (admin only)
CREATE POLICY "Admins can manage all modules"
  ON modules
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'admin@example.com'::text)
  WITH CHECK ((auth.jwt() ->> 'email'::text) = 'admin@example.com'::text);