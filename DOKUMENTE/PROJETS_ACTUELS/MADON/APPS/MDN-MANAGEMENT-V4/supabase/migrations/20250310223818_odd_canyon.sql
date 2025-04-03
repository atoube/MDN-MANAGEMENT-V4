/*
  # Réinitialisation et création des employés

  1. Nettoyage
    - Supprime les données existantes
    - Réinitialise les tables

  2. Création des employés
    - Ajoute 5 employés avec différents rôles
    - Configure les permissions appropriées
*/

-- Nettoyage des données existantes
TRUNCATE TABLE employees CASCADE;

-- Désactiver la validation des employés temporairement
DROP TRIGGER IF EXISTS employee_validation_trigger ON employees;

-- Insérer les employés
INSERT INTO employees (
  id,
  first_name,
  last_name,
  email,
  phone,
  role,
  salary,
  hire_date,
  status
) VALUES 
  (
    gen_random_uuid(),
    'Thomas',
    'Anderson',
    'admin@themadon.com',
    '+237699999999',
    'admin',
    1500000,
    '2024-01-01',
    'active'
  ),
  (
    gen_random_uuid(),
    'Marie',
    'Dubois',
    'rh@themadon.com',
    '+237688888888',
    'hr',
    800000,
    '2024-01-15',
    'active'
  ),
  (
    gen_random_uuid(),
    'Paul',
    'Martin',
    'stock@themadon.com',
    '+237677777777',
    'stock_manager',
    600000,
    '2024-02-01',
    'active'
  ),
  (
    gen_random_uuid(),
    'Sophie',
    'Laurent',
    'delivery@themadon.com',
    '+237666666666',
    'delivery',
    450000,
    '2024-02-15',
    'active'
  ),
  (
    gen_random_uuid(),
    'Lucas',
    'Petit',
    'stock2@themadon.com',
    '+237655555555',
    'stock_manager',
    700000,
    '2024-03-01',
    'active'
  );

-- Recréer le trigger de validation
CREATE TRIGGER employee_validation_trigger
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_employee();

-- Mettre à jour les politiques RLS
DROP POLICY IF EXISTS "employees_view_own" ON employees;
CREATE POLICY "employees_view_own"
  ON employees
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND (e.role = 'admin' OR e.role = 'hr')
    )
  );