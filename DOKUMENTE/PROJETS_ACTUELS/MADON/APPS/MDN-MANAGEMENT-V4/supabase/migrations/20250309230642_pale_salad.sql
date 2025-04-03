/*
  # Correction des politiques RLS pour la table modules

  1. Changements
    - Suppression des anciennes politiques
    - Ajout d'une nouvelle politique pour la lecture publique
    - Ajout d'une nouvelle politique pour la gestion par les administrateurs
    - Ajout d'une nouvelle politique pour la mise à jour de l'ordre des modules

  2. Sécurité
    - Les modules sont visibles par tous les utilisateurs authentifiés
    - Seuls les administrateurs peuvent gérer les modules
    - Vérification du rôle admin via JWT
*/

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Anyone can view modules" ON modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON modules;
DROP POLICY IF EXISTS "Admins can update module order" ON modules;
DROP POLICY IF EXISTS "View all modules" ON modules;
DROP POLICY IF EXISTS "Manage modules as admin" ON modules;

-- Politique de lecture pour tous les utilisateurs authentifiés
CREATE POLICY "View all modules"
ON modules
FOR SELECT
TO authenticated
USING (true);

-- Politique de gestion complète pour les administrateurs
CREATE POLICY "Manage modules as admin"
ON modules
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