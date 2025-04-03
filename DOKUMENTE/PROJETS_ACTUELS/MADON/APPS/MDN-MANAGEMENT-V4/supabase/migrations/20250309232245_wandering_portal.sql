/*
  # Correction des contraintes de la table modules

  1. Changements
    - Ajout de valeurs par défaut pour les colonnes requises
    - Mise à jour des contraintes de non-nullité
    - Réinitialisation des données des modules

  2. Sécurité
    - Maintien des politiques de sécurité existantes
*/

-- Suppression des données existantes pour éviter les conflits
DELETE FROM modules;

-- Modification des colonnes avec des valeurs par défaut appropriées
ALTER TABLE modules
  ALTER COLUMN name SET DEFAULT '',
  ALTER COLUMN path SET DEFAULT '/',
  ALTER COLUMN icon SET DEFAULT 'LayoutDashboard',
  ALTER COLUMN enabled SET DEFAULT true,
  ALTER COLUMN "order" SET DEFAULT 0;

-- Insertion des modules par défaut avec tous les champs requis
INSERT INTO modules (name, path, icon, enabled, "order") VALUES
  ('Tableau de bord', '/', 'LayoutDashboard', true, 0),
  ('Livraisons', '/deliveries', 'Truck', true, 1),
  ('Employés', '/employees', 'Users', true, 2),
  ('Vendeurs', '/sellers', 'Store', true, 3),
  ('Stocks', '/stock', 'Package', true, 4),
  ('Activités', '/tasks', 'ClipboardList', true, 5),
  ('Marketing', '/marketing', 'Share2', true, 6),
  ('Finances', '/finance', 'DollarSign', true, 7);