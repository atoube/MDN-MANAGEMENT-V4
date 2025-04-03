/*
  # Système de gestion de la paie

  1. Nouvelles Tables
    - `payroll_entries`
      - `id` (uuid, primary key) - Identifiant unique
      - `employee_id` (uuid) - Employé concerné
      - `period` (date) - Période de paie
      - `base_salary` (numeric) - Salaire de base
      - `bonuses` (numeric) - Primes
      - `deductions` (numeric) - Déductions
      - `net_salary` (numeric) - Salaire net
      - `status` (text) - Statut
      - `user_id` (uuid) - Utilisateur créateur
      - `created_at` (timestamptz) - Date de création

    - `payroll_items`
      - `id` (uuid, primary key) - Identifiant unique
      - `payroll_id` (uuid) - Fiche de paie associée
      - `type` (text) - Type d'élément
      - `description` (text) - Description
      - `amount` (numeric) - Montant
      - `created_at` (timestamptz) - Date de création

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour RH et employés

  3. Contraintes
    - Validation des montants et statuts
    - Relations avec employees et users
*/

-- Création de la table des fiches de paie
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS payroll_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid,
    period date NOT NULL,
    base_salary numeric NOT NULL CHECK (base_salary >= 0),
    bonuses numeric DEFAULT 0 CHECK (bonuses >= 0),
    deductions numeric DEFAULT 0 CHECK (deductions >= 0),
    net_salary numeric NOT NULL CHECK (net_salary >= 0),
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    user_id uuid,
    CONSTRAINT payroll_entries_status_check CHECK (status IN ('draft', 'approved', 'paid'))
  );

  -- Ajout des clés étrangères si elles n'existent pas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employees')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'payroll_entries_employee_id_fkey'
  ) THEN
    ALTER TABLE payroll_entries
      ADD CONSTRAINT payroll_entries_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES employees(id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'payroll_entries_user_id_fkey'
  ) THEN
    ALTER TABLE payroll_entries
      ADD CONSTRAINT payroll_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

-- Création de la table des éléments de paie
CREATE TABLE IF NOT EXISTS payroll_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id uuid REFERENCES payroll_entries(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT payroll_items_type_check CHECK (type IN ('bonus', 'deduction', 'tax', 'contribution'))
);

-- Activation de la sécurité niveau ligne
ALTER TABLE payroll_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour les fiches de paie
DO $$ BEGIN
  DROP POLICY IF EXISTS "allow_hr_manage_payroll" ON payroll_entries;
  CREATE POLICY "allow_hr_manage_payroll" ON payroll_entries
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') IN ('admin', 'hr'))
    WITH CHECK ((auth.jwt() ->> 'role') IN ('admin', 'hr'));

  DROP POLICY IF EXISTS "allow_employees_view_payroll" ON payroll_entries;
  CREATE POLICY "allow_employees_view_payroll" ON payroll_entries
    FOR SELECT TO authenticated
    USING (employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    ));
END $$;

-- Politiques de sécurité pour les éléments de paie
DO $$ BEGIN
  DROP POLICY IF EXISTS "allow_hr_manage_payroll_items" ON payroll_items;
  CREATE POLICY "allow_hr_manage_payroll_items" ON payroll_items
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') IN ('admin', 'hr'))
    WITH CHECK ((auth.jwt() ->> 'role') IN ('admin', 'hr'));
END $$;