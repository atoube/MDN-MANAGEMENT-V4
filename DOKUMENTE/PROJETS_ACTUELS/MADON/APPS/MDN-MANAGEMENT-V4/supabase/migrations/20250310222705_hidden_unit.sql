/*
  # Ajout des permissions administrateur

  1. Modifications
    - Ajout d'une politique permettant à narcomc@gmail.com d'avoir les droits d'administration
    - Mise à jour des politiques existantes pour inclure l'email administrateur
    - Correction de la fonction uid() en auth.uid()
*/

-- Suppression des politiques existantes avant de les recréer
DROP POLICY IF EXISTS "allow_manage_modules" ON modules;
DROP POLICY IF EXISTS "allow_read_modules" ON modules;
DROP POLICY IF EXISTS "employees_management" ON employees;

-- Création des nouvelles politiques
CREATE POLICY "allow_manage_modules" 
ON modules
FOR ALL 
TO authenticated
USING (
  (auth.jwt()->>'email') = 'admin@example.com' OR
  (auth.jwt()->>'email') = 'narcomc@gmail.com' OR
  (auth.jwt()->>'role') = 'admin'
)
WITH CHECK (
  (auth.jwt()->>'email') = 'admin@example.com' OR
  (auth.jwt()->>'email') = 'narcomc@gmail.com' OR
  (auth.jwt()->>'role') = 'admin'
);

CREATE POLICY "allow_read_modules" 
ON modules
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "employees_management" 
ON employees
FOR ALL 
TO authenticated
USING (
  has_employee_management_permission() OR
  (auth.jwt()->>'email') = 'narcomc@gmail.com' OR
  (auth.uid() = user_id)
)
WITH CHECK (
  has_employee_management_permission() OR
  (auth.jwt()->>'email') = 'narcomc@gmail.com'
);