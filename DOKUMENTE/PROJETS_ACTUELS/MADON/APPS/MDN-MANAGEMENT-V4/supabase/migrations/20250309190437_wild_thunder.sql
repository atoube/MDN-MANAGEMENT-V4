/*
  # Finance System Setup

  1. New Tables
    - `accounts`: Stores financial accounts (cash, bank, mobile money)
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text: cash, bank, mobile_money)
      - `balance` (numeric)
      - `currency` (text, default: XOF)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

    - `categories`: Stores transaction categories
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text: income, expense)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

    - `transactions`: Stores financial transactions
      - `id` (uuid, primary key)
      - `date` (timestamp)
      - `type` (text: income, expense)
      - `amount` (numeric)
      - `description` (text)
      - `category_id` (uuid, references categories)
      - `reference` (text)
      - `status` (text: pending, completed, failed)
      - `account_id` (uuid, references accounts)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Functions
    - Add trigger function to update account balances on transaction changes
*/

-- Create accounts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
    CREATE TABLE accounts (
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
  END IF;
END $$;

-- Create categories table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
    CREATE TABLE categories (
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
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

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

-- Create or replace function to update account balance
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

-- Create trigger for account balance updates if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_account_balance_trigger') THEN
    CREATE TRIGGER update_account_balance_trigger
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance();
  END IF;
END $$;