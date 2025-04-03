/*
  # Finance Module Schema

  1. New Tables
    - `accounts`: Store financial accounts (cash, bank, mobile money)
    - `categories`: Categorize transactions (income/expense categories)
    - `transactions`: Record all financial transactions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Trigger to automatically update account balances

  3. Default Data
    - Insert default transaction categories
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  balance numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'XOF',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_account_type CHECK (type = ANY (ARRAY['cash'::text, 'bank'::text, 'mobile_money'::text]))
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own accounts"
  ON accounts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_category_type CHECK (type = ANY (ARRAY['income'::text, 'expense'::text]))
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

-- Create transactions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions') THEN
    CREATE TABLE transactions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      date timestamptz NOT NULL DEFAULT now(),
      type text NOT NULL,
      amount numeric NOT NULL CHECK (amount >= 0),
      description text NOT NULL,
      category_id uuid REFERENCES categories(id),
      reference text,
      status text NOT NULL DEFAULT 'pending',
      account_id uuid REFERENCES accounts(id),
      created_at timestamptz DEFAULT now(),
      user_id uuid REFERENCES auth.users(id),
      CONSTRAINT valid_transaction_type CHECK (type = ANY (ARRAY['income'::text, 'expense'::text])),
      CONSTRAINT valid_transaction_status CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text]))
    );

    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can manage their own transactions"
      ON transactions
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create function to update account balance
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' THEN
      UPDATE accounts
      SET balance = CASE
        WHEN NEW.type = 'income' THEN balance + NEW.amount
        WHEN NEW.type = 'expense' THEN balance - NEW.amount
      END
      WHERE id = NEW.account_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
      UPDATE accounts
      SET balance = CASE
        WHEN NEW.type = 'income' THEN balance + NEW.amount
        WHEN NEW.type = 'expense' THEN balance - NEW.amount
      END
      WHERE id = NEW.account_id;
    ELSIF OLD.status = 'completed' AND NEW.status != 'completed' THEN
      UPDATE accounts
      SET balance = CASE
        WHEN OLD.type = 'income' THEN balance - OLD.amount
        WHEN OLD.type = 'expense' THEN balance + OLD.amount
      END
      WHERE id = NEW.account_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for account balance updates
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_account_balance_trigger') THEN
    CREATE TRIGGER update_account_balance_trigger
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance();
  END IF;
END $$;

-- Insert default categories
INSERT INTO categories (name, type, user_id)
VALUES
  ('Ventes', 'income', NULL),
  ('Services', 'income', NULL),
  ('Approvisionnement', 'expense', NULL),
  ('Salaires', 'expense', NULL),
  ('Marketing', 'expense', NULL),
  ('Logistique', 'expense', NULL)
ON CONFLICT DO NOTHING;