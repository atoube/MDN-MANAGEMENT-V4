/*
  # Correction des politiques de sécurité pour la table modules

  1. Changements
    - Suppression des anciennes politiques
    - Création de nouvelles politiques avec des noms uniques
    - Ajout d'une politique pour la lecture par tous les utilisateurs authentifiés
    - Ajout d'une politique pour la gestion complète par les administrateurs

  2. Sécurité
    - Les utilisateurs authentifiés peuvent voir tous les modules
    - Seuls les administrateurs peuvent gérer les modules (CRUD)
*/

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "view_modules_policy" ON modules;
DROP POLICY IF EXISTS "manage_modules_policy" ON modules;

-- Politique pour la lecture des modules (tous les utilisateurs authentifiés)
CREATE POLICY "allow_read_modules" ON modules
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique pour la gestion des modules (admin uniquement)
CREATE POLICY "allow_manage_modules" ON modules
  FOR ALL
  TO authenticated
  USING (
    auth.jwt()->>'email' = 'admin@example.com' OR
    auth.jwt()->>'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt()->>'email' = 'admin@example.com' OR
    auth.jwt()->>'role' = 'admin'
  );

-- Insertion des modules par défaut s'ils n'existent pas déjà
INSERT INTO modules (name, path, icon, enabled, "order")
VALUES
  ('Tableau de bord', '/', 'LayoutDashboard', true, 0),
  ('Livraisons', '/deliveries', 'Truck', true, 1),
  ('Employés', '/employees', 'Users', true, 2),
  ('Vendeurs', '/sellers', 'Store', true, 3),
  ('Stocks', '/stock', 'Package', true, 4),
  ('Activités', '/tasks', 'ClipboardList', true, 5),
  ('Marketing', '/marketing', 'Share2', true, 6),
  ('Finances', '/finance', 'DollarSign', true, 7)
ON CONFLICT (id) DO NOTHING;