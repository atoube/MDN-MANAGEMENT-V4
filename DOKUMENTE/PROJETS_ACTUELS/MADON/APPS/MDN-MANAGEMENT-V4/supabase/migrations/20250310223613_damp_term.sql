/*
  # Création des employés tests

  1. Gestion RLS
    - Désactive temporairement RLS pour permettre l'insertion
    - Réactive RLS après l'insertion

  2. Création des employés
    - Ajoute 5 employés avec différents rôles
    - Configure les informations de base (nom, email, rôle, etc.)
*/

-- Désactiver temporairement RLS
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- Nettoyer les données existantes si nécessaire
DELETE FROM employees WHERE email IN (
  'admin@themadon.com',
  'rh@themadon.com',
  'stock@themadon.com',
  'delivery@themadon.com',
  'stock2@themadon.com'
);

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

-- Réactiver RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;