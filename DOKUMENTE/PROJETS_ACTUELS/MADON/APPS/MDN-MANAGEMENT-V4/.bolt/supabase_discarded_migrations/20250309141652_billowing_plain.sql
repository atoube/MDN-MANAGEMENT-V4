/*
  # Schéma initial de la base de données MADON Marketplace

  1. Tables
    - Employés (employees)
    - Absences (absences)
    - Vendeurs (sellers)
    - Produits (products)
    - Mouvements de stock (stock_movements)
    - Livraisons (deliveries)
    - Frais de livraison (delivery_costs)
    - Tâches (tasks)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès basées sur les rôles utilisateur
*/

-- Création de l'enum pour les rôles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'hr', 'delivery', 'stock_manager', 'seller', 'employee');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Table des employés
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  hire_date date NOT NULL,
  role user_role NOT NULL,
  salary decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des absences
CREATE TABLE IF NOT EXISTS absences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Table des vendeurs
CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES sellers(id),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  online_quantity integer NOT NULL DEFAULT 0,
  expiration_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des mouvements de stock
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out', 'expired', 'seller_withdrawal')),
  reference_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Table des livraisons
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  delivery_person_id uuid REFERENCES employees(id),
  assigned_by uuid REFERENCES employees(id),
  delivery_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des frais de livraison
CREATE TABLE IF NOT EXISTS delivery_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid REFERENCES deliveries(id),
  cost_type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assignee_id uuid REFERENCES employees(id),
  creator_id uuid REFERENCES employees(id),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activation RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les employés
CREATE POLICY "Les RH peuvent tout voir" ON employees
  FOR ALL USING (auth.jwt() ->> 'role' = 'hr');

CREATE POLICY "Les employés peuvent voir leur propre profil" ON employees
  FOR SELECT USING (auth.uid() = user_id);

-- Politiques RLS pour les absences
CREATE POLICY "Les RH peuvent gérer les absences" ON absences
  FOR ALL USING (auth.jwt() ->> 'role' = 'hr');

CREATE POLICY "Les employés peuvent voir leurs absences" ON absences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.id = absences.employee_id
      AND employees.user_id = auth.uid()
    )
  );

-- Politiques RLS pour les vendeurs
CREATE POLICY "Les gestionnaires peuvent tout voir" ON sellers
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'stock_manager'));

CREATE POLICY "Les vendeurs peuvent voir leur profil" ON sellers
  FOR SELECT USING (auth.uid() = user_id);

-- Politiques RLS pour les produits
CREATE POLICY "Accès aux produits" ON products
  FOR ALL USING (true);

-- Politiques RLS pour les mouvements de stock
CREATE POLICY "Gestionnaires de stock peuvent gérer" ON stock_movements
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'stock_manager'));

-- Politiques RLS pour les livraisons
CREATE POLICY "Livreurs peuvent voir leurs livraisons" ON deliveries
  FOR ALL USING (
    delivery_person_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour les tâches
CREATE POLICY "Utilisateurs peuvent voir leurs tâches" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.id = tasks.assignee_id
      AND employees.user_id = auth.uid()
    )
  );

-- Création des index pour les performances
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_delivery_person_id ON deliveries(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);