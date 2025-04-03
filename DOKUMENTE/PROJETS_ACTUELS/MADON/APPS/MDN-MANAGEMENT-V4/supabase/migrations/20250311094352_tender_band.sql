/*
  # Add Financial and Project Management Modules

  1. New Tables
    - `accounting_entries`: Stores accounting journal entries
      - `id` (uuid, primary key)
      - `date` (date)
      - `type` (text): debit/credit
      - `amount` (numeric)
      - `description` (text)
      - `account_number` (text)
      - `reference` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid)

    - `payroll_entries`: Stores employee payroll information
      - `id` (uuid, primary key)
      - `employee_id` (uuid)
      - `period` (date)
      - `base_salary` (numeric)
      - `bonuses` (numeric)
      - `deductions` (numeric)
      - `net_salary` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid)

    - `payroll_items`: Stores detailed payroll components
      - `id` (uuid, primary key)
      - `payroll_id` (uuid)
      - `type` (text)
      - `description` (text)
      - `amount` (numeric)
      - `created_at` (timestamptz)

    - `dgi_declarations`: Stores tax declarations
      - `id` (uuid, primary key)
      - `period` (date)
      - `type` (text)
      - `amount` (numeric)
      - `status` (text)
      - `reference` (text)
      - `submitted_at` (timestamptz)
      - `created_at` (timestamptz)
      - `user_id` (uuid)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on user roles
*/

-- Create accounting_entries table
CREATE TABLE IF NOT EXISTS accounting_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('debit', 'credit')),
  amount numeric NOT NULL CHECK (amount >= 0),
  description text NOT NULL,
  account_number text NOT NULL,
  reference text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create payroll_entries table
CREATE TABLE IF NOT EXISTS payroll_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id),
  period date NOT NULL,
  base_salary numeric NOT NULL CHECK (base_salary >= 0),
  bonuses numeric NOT NULL DEFAULT 0 CHECK (bonuses >= 0),
  deductions numeric NOT NULL DEFAULT 0 CHECK (deductions >= 0),
  net_salary numeric NOT NULL CHECK (net_salary >= 0),
  status text NOT NULL CHECK (status IN ('draft', 'approved', 'paid')),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create payroll_items table
CREATE TABLE IF NOT EXISTS payroll_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id uuid REFERENCES payroll_entries(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('bonus', 'deduction', 'tax', 'contribution')),
  description text NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create dgi_declarations table
CREATE TABLE IF NOT EXISTS dgi_declarations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  type text NOT NULL CHECK (type IN ('tva', 'is', 'irpp', 'cnps')),
  amount numeric NOT NULL CHECK (amount >= 0),
  status text NOT NULL CHECK (status IN ('draft', 'submitted', 'validated', 'rejected')),
  reference text,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dgi_declarations ENABLE ROW LEVEL SECURITY;

-- Create policies for accounting_entries
CREATE POLICY "Users can view accounting entries"
  ON accounting_entries
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'accountant')
  );

CREATE POLICY "Users can manage accounting entries"
  ON accounting_entries
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'accountant')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'accountant')
  );

-- Create policies for payroll_entries
CREATE POLICY "HR can manage payroll entries"
  ON payroll_entries
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'hr')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'hr')
  );

CREATE POLICY "Employees can view their own payroll"
  ON payroll_entries
  FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for payroll_items
CREATE POLICY "HR can manage payroll items"
  ON payroll_items
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'hr')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'hr')
  );

-- Create policies for dgi_declarations
CREATE POLICY "Accountants can manage DGI declarations"
  ON dgi_declarations
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'accountant')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role'::text) IN ('admin', 'accountant')
  );