/*
  # Configuration complète des permissions administrateur
  
  1. Modifications
    - Activation de RLS sur les tables
    - Configuration des politiques de sécurité pour l'administrateur
    - Ajout des permissions spécifiques pour narcomc@gmail.com
    
  2. Sécurité
    - Vérification des JWT pour l'authentification
    - Permissions basées sur les rôles et emails spécifiques
*/

-- Activation de RLS sur les tables si ce n'est pas déjà fait
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques
DROP POLICY IF EXISTS "allow_manage_modules" ON modules;
DROP POLICY IF EXISTS "allow_read_modules" ON modules;
DROP POLICY IF EXISTS "employees_management" ON employees;
DROP POLICY IF EXISTS "employees_read" ON employees;

-- Politique pour la gestion des modules
CREATE POLICY "allow_manage_modules"
ON modules
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'email'::text) = 'admin@example.com'::text OR
  (auth.jwt() ->> 'email'::text) = 'narcomc@gmail.com'::text OR
  (auth.jwt() ->> 'role'::text) = 'admin'::text
)
WITH CHECK (
  (auth.jwt() ->> 'email'::text) = 'admin@example.com'::text OR
  (auth.jwt() ->> 'email'::text) = 'narcomc@gmail.com'::text OR
  (auth.jwt() ->> 'role'::text) = 'admin'::text
);

-- Politique de lecture des modules
CREATE POLICY "allow_read_modules"
ON modules
FOR SELECT
TO authenticated
USING (true);

-- Politique de gestion des employés
CREATE POLICY "employees_management"
ON employees
FOR ALL
TO authenticated
USING (
  has_employee_management_permission() OR
  (auth.jwt() ->> 'email'::text) = 'narcomc@gmail.com'::text OR
  (auth.uid() = user_id)
)
WITH CHECK (
  has_employee_management_permission() OR
  (auth.jwt() ->> 'email'::text) = 'narcomc@gmail.com'::text
);

-- Politique de lecture des employés
CREATE POLICY "employees_read"
ON employees
FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id) OR
  has_employee_management_permission() OR
  (auth.jwt() ->> 'email'::text) = 'narcomc@gmail.com'::text
);