/*
  # Add Default Accounts and Categories

  1. Changes
    - Add default accounts for common payment methods
    - Add default categories for income and expenses
    - Ensure proper user_id assignment

  2. Security
    - Maintain existing RLS policies
*/

-- Insert default accounts if they don't exist
INSERT INTO accounts (name, type, currency, user_id)
SELECT 'Caisse', 'cash', 'XOF', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO accounts (name, type, currency, user_id)
SELECT 'Banque', 'bank', 'XOF', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO accounts (name, type, currency, user_id)
SELECT 'Mobile Money', 'mobile_money', 'XOF', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert default income categories if they don't exist
INSERT INTO categories (name, type, user_id)
SELECT 'Ventes', 'income', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, type, user_id)
SELECT 'Services', 'income', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert default expense categories if they don't exist
INSERT INTO categories (name, type, user_id)
SELECT 'Achats', 'expense', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, type, user_id)
SELECT 'Salaires', 'expense', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, type, user_id)
SELECT 'Transport', 'expense', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, type, user_id)
SELECT 'Marketing', 'expense', auth.uid()
FROM auth.users
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;