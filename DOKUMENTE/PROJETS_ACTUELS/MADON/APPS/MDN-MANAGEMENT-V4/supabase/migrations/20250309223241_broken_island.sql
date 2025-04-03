/*
  # Configuration des modules

  1. Nouvelle Table
    - `modules`
      - `id` (uuid, primary key)
      - `name` (text) - Nom du module
      - `path` (text) - Chemin d'accès
      - `icon` (text) - Icône Lucide React
      - `enabled` (boolean) - État d'activation
      - `order` (integer) - Ordre d'affichage
      - `created_at` (timestamp)

  2. Données initiales
    - Insertion des modules par défaut
    - Définition de l'ordre initial

  3. Sécurité
    - Enable RLS
    - Policies pour la gestion des modules
*/

-- Création de la table modules si elle n'existe pas
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'modules') THEN
    CREATE TABLE modules (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      path text NOT NULL,
      icon text NOT NULL,
      enabled boolean DEFAULT true,
      "order" integer NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

    -- Policies
    CREATE POLICY "Admins can manage modules" ON modules
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
      WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

    CREATE POLICY "Everyone can view enabled modules" ON modules
      FOR SELECT
      TO authenticated
      USING (enabled = true);

    -- Insertion des données initiales
    INSERT INTO modules (name, path, icon, enabled, "order") VALUES
      ('Tableau de bord', '/', 'LayoutDashboard', true, 0),
      ('Livraisons', '/deliveries', 'Truck', true, 1),
      ('Employés', '/employees', 'Users', true, 2),
      ('Vendeurs', '/sellers', 'Store', true, 3),
      ('Stocks', '/stock', 'Package', true, 4),
      ('Activités', '/tasks', 'ClipboardList', true, 5),
      ('Marketing', '/marketing', 'Share2', true, 6),
      ('Finances', '/finance', 'DollarSign', true, 7);
  END IF;
END $$;