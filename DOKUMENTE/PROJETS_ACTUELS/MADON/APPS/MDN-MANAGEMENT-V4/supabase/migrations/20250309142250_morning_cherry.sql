/*
  # Création des tables principales pour MADON Marketplace

  1. Nouvelles Tables
    - `employees`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `role` (text)
      - `salary` (numeric)
      - `hire_date` (date)
      - `user_id` (uuid, foreign key)

    - `absences`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `employee_id` (uuid, foreign key)
      - `start_date` (date)
      - `end_date` (date)
      - `reason` (text)
      - `status` (text)

    - `sellers`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `user_id` (uuid, foreign key)

    - `products`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `quantity` (integer)
      - `seller_id` (uuid, foreign key)
      - `status` (text)

    - `stock_movements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `type` (text)
      - `reason` (text)
      - `reference_number` (text)

    - `deliveries`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `status` (text)
      - `delivery_date` (date)
      - `delivery_person_id` (uuid, foreign key)
      - `address` (text)
      - `tracking_number` (text)

    - `delivery_costs`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `delivery_id` (uuid, foreign key)
      - `amount` (numeric)
      - `description` (text)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour contrôler l'accès selon les rôles

  3. Contraintes
    - Clés étrangères pour maintenir l'intégrité référentielle
    - Contraintes de validation pour les statuts et autres champs énumérés
*/

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    role text NOT NULL,
    salary numeric NOT NULL,
    hire_date date NOT NULL,
    user_id uuid REFERENCES auth.users(id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "HR can manage employees"
    ON employees
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'hr');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own employee record"
    ON employees
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS absences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    employee_id uuid REFERENCES employees(id),
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "HR can manage absences"
    ON absences
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'hr');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Employees can view their own absences"
    ON absences
    FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM employees
      WHERE employees.id = absences.employee_id
      AND employees.user_id = auth.uid()
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS sellers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    address text,
    user_id uuid REFERENCES auth.users(id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Stock managers can manage sellers"
    ON sellers
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'stock_manager');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL CHECK (price >= 0),
    quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    seller_id uuid REFERENCES sellers(id),
    status text NOT NULL CHECK (status IN ('in_stock', 'out_of_stock', 'discontinued'))
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Stock managers can manage products"
    ON products
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'stock_manager');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Sellers can view their own products"
    ON products
    FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = products.seller_id
      AND sellers.user_id = auth.uid()
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS stock_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    product_id uuid REFERENCES products(id),
    quantity integer NOT NULL,
    type text NOT NULL CHECK (type IN ('in', 'out')),
    reason text NOT NULL,
    reference_number text
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Stock managers can manage stock movements"
    ON stock_movements
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'stock_manager');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS deliveries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'delivered', 'cancelled')),
    delivery_date date NOT NULL,
    delivery_person_id uuid REFERENCES employees(id),
    address text NOT NULL,
    tracking_number text UNIQUE NOT NULL
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Delivery personnel can manage deliveries"
    ON deliveries
    FOR ALL
    TO authenticated
    USING (
      auth.jwt() ->> 'role' = 'delivery' OR
      EXISTS (
        SELECT 1 FROM employees
        WHERE employees.id = deliveries.delivery_person_id
        AND employees.user_id = auth.uid()
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS delivery_costs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    delivery_id uuid REFERENCES deliveries(id),
    amount numeric NOT NULL CHECK (amount >= 0),
    description text NOT NULL
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE delivery_costs ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Delivery personnel can manage delivery costs"
    ON delivery_costs
    FOR ALL
    TO authenticated
    USING (
      auth.jwt() ->> 'role' = 'delivery' OR
      EXISTS (
        SELECT 1 FROM deliveries
        JOIN employees ON employees.id = deliveries.delivery_person_id
        WHERE deliveries.id = delivery_costs.delivery_id
        AND employees.user_id = auth.uid()
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;