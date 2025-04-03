/*
  # Correction de la validation des employés et insertion sécurisée
  
  1. Modifications
    - Création de la fonction de validation des employés
    - Définition des rôles valides
    - Ajout des vérifications de permissions
    - Insertion sécurisée des données de test
    
  2. Sécurité
    - Vérification des rôles autorisés
    - Validation des données d'entrée
    - Vérification des doublons avant insertion
*/

-- Suppression de la fonction si elle existe
DROP FUNCTION IF EXISTS validate_employee CASCADE;
DROP FUNCTION IF EXISTS has_employee_management_permission CASCADE;

-- Création de la fonction de vérification des permissions
CREATE OR REPLACE FUNCTION has_employee_management_permission()
RETURNS boolean AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'role'::text = 'admin'::text OR
    auth.jwt() ->> 'role'::text = 'hr'::text OR
    auth.jwt() ->> 'email'::text = 'narcomc@gmail.com'::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Création de la fonction de validation des employés
CREATE OR REPLACE FUNCTION validate_employee()
RETURNS trigger AS $$
BEGIN
  -- Validation du format email
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Format d''email invalide';
  END IF;

  -- Validation du numéro de téléphone si fourni
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+?[0-9\s-]{8,}$' THEN
    RAISE EXCEPTION 'Format de téléphone invalide';
  END IF;

  -- Validation du salaire
  IF NEW.salary < 0 THEN
    RAISE EXCEPTION 'Le salaire doit être positif';
  END IF;

  -- Liste des rôles valides
  IF NEW.role NOT IN ('admin', 'hr', 'delivery', 'stock_manager', 'marketing') THEN
    RAISE EXCEPTION 'Rôle invalide. Les rôles valides sont: admin, hr, delivery, stock_manager, marketing';
  END IF;

  -- Définition du statut par défaut si non spécifié
  IF NEW.status IS NULL THEN
    NEW.status := 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Suppression du trigger s'il existe
DROP TRIGGER IF EXISTS employee_validation_trigger ON employees;

-- Création du trigger de validation
CREATE TRIGGER employee_validation_trigger
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_employee();

-- Insertion sécurisée des employés de test
DO $$
BEGIN
  -- Thomas Anderson
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'admin@themadon.com') THEN
    INSERT INTO employees (first_name, last_name, email, phone, role, salary, hire_date, status)
    VALUES ('Thomas', 'Anderson', 'admin@themadon.com', '+237699999999', 'admin', 1500000, '2024-01-01', 'active');
  END IF;

  -- Marie Dubois
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'rh@themadon.com') THEN
    INSERT INTO employees (first_name, last_name, email, phone, role, salary, hire_date, status)
    VALUES ('Marie', 'Dubois', 'rh@themadon.com', '+237688888888', 'hr', 800000, '2024-01-15', 'active');
  END IF;

  -- Paul Martin
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'stock@themadon.com') THEN
    INSERT INTO employees (first_name, last_name, email, phone, role, salary, hire_date, status)
    VALUES ('Paul', 'Martin', 'stock@themadon.com', '+237677777777', 'stock_manager', 600000, '2024-02-01', 'active');
  END IF;

  -- Sophie Laurent
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'delivery@themadon.com') THEN
    INSERT INTO employees (first_name, last_name, email, phone, role, salary, hire_date, status)
    VALUES ('Sophie', 'Laurent', 'delivery@themadon.com', '+237666666666', 'delivery', 450000, '2024-02-15', 'active');
  END IF;

  -- Lucas Petit
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'marketing@themadon.com') THEN
    INSERT INTO employees (first_name, last_name, email, phone, role, salary, hire_date, status)
    VALUES ('Lucas', 'Petit', 'marketing@themadon.com', '+237655555555', 'marketing', 700000, '2024-03-01', 'active');
  END IF;
END $$;