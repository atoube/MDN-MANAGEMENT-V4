/*
  # Gestion comptable et déclarations DGI

  1. Nouvelles Tables
    - `accounting_entries`
      - `id` (uuid, primary key) - Identifiant unique
      - `date` (date) - Date de l'écriture
      - `type` (text) - Type (debit/credit)
      - `amount` (numeric) - Montant
      - `description` (text) - Description
      - `account_number` (text) - Numéro de compte
      - `reference` (text) - Référence
      - `user_id` (uuid) - Utilisateur
      - `created_at` (timestamptz) - Date de création

    - `dgi_declarations`
      - `id` (uuid, primary key) - Identifiant unique
      - `period` (date) - Période
      - `type` (text) - Type (tva, is, irpp, cnps)
      - `amount` (numeric) - Montant
      - `status` (text) - Statut
      - `reference` (text) - Référence
      - `submitted_at` (timestamptz) - Date de soumission
      - `user_id` (uuid) - Utilisateur
      - `created_at` (timestamptz) - Date de création

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour les comptables et administrateurs

  3. Contraintes
    - Validation des types et statuts
    - Relations avec la table users
*/

-- Création de la table des écritures comptables
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS accounting_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    type text NOT NULL,
    amount numeric NOT NULL CHECK (amount >= 0),
    description text NOT NULL,
    account_number text NOT NULL,
    reference text,
    created_at timestamptz DEFAULT now(),
    user_id uuid,
    CONSTRAINT valid_type CHECK (type IN ('debit', 'credit'))
  );

  -- Ajout de la clé étrangère si elle n'existe pas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'accounting_entries_user_id_fkey'
  ) THEN
    ALTER TABLE accounting_entries
      ADD CONSTRAINT accounting_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

-- Création de la table des déclarations DGI
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS dgi_declarations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    period date NOT NULL,
    type text NOT NULL,
    amount numeric NOT NULL CHECK (amount >= 0),
    status text NOT NULL,
    reference text,
    submitted_at timestamptz,
    created_at timestamptz DEFAULT now(),
    user_id uuid,
    CONSTRAINT valid_type CHECK (type IN ('tva', 'is', 'irpp', 'cnps')),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'submitted', 'validated', 'rejected'))
  );

  -- Ajout de la clé étrangère si elle n'existe pas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'dgi_declarations_user_id_fkey'
  ) THEN
    ALTER TABLE dgi_declarations
      ADD CONSTRAINT dgi_declarations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

-- Activation de la sécurité niveau ligne
ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dgi_declarations ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour les écritures comptables
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage accounting entries" ON accounting_entries;
  CREATE POLICY "Users can manage accounting entries" ON accounting_entries
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') IN ('admin', 'accountant'))
    WITH CHECK ((auth.jwt() ->> 'role') IN ('admin', 'accountant'));

  DROP POLICY IF EXISTS "Users can view accounting entries" ON accounting_entries;
  CREATE POLICY "Users can view accounting entries" ON accounting_entries
    FOR SELECT TO authenticated
    USING ((auth.jwt() ->> 'role') IN ('admin', 'accountant'));
END $$;

-- Politiques de sécurité pour les déclarations DGI
DO $$ BEGIN
  DROP POLICY IF EXISTS "Accountants can manage DGI declarations" ON dgi_declarations;
  CREATE POLICY "Accountants can manage DGI declarations" ON dgi_declarations
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') IN ('admin', 'accountant'))
    WITH CHECK ((auth.jwt() ->> 'role') IN ('admin', 'accountant'));
END $$;