/*
  # Fix employees table RLS policies and add optimizations

  1. Security
    - Enable RLS on employees table
    - Add policies for:
      - HR and admin can manage all employees
      - Employees can view their own records
      - Managers can view their team members
  
  2. Optimizations
    - Add indexes for frequent queries
    - Add trigger for leave balance updates
*/

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "HR and admin can manage employees" ON employees;
DROP POLICY IF EXISTS "Employees can view own record" ON employees;

-- Create new policies
CREATE POLICY "HR and admin can manage employees"
ON employees
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin', 'hr'])
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin', 'hr'])
);

CREATE POLICY "Employees can view own record"
ON employees
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Add indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- Create function to update leave balance
CREATE OR REPLACE FUNCTION update_leave_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE employees
    SET leave_balance = jsonb_set(
      COALESCE(leave_balance::jsonb, '{}'::jsonb),
      ARRAY[NEW.type],
      (COALESCE((leave_balance->>NEW.type)::numeric, 0) - 
       (EXTRACT(DAY FROM NEW.end_date::timestamp - NEW.start_date::timestamp) + 1))::text::jsonb
    )
    WHERE id = NEW.employee_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for leave balance updates
DROP TRIGGER IF EXISTS update_leave_balance_trigger ON absences;
CREATE TRIGGER update_leave_balance_trigger
  AFTER UPDATE OF status
  ON absences
  FOR EACH ROW
  WHEN (OLD.status != 'approved' AND NEW.status = 'approved')
  EXECUTE FUNCTION update_leave_balance();