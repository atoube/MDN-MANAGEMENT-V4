/*
  # Create test employees

  1. Data
    - Insert 5 test employees with different roles and information
    - Set appropriate salaries and roles
*/

INSERT INTO employees (
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
    'Alexie',
    'Kamdem',
    'alexie.kamdem@madon.cm',
    '+237612345678',
    'hr',
    450000,
    '2024-01-15',
    'active'
  ),
  (
    'Kevin',
    'Tchinda',
    'kevin.tchinda@madon.cm',
    '+237623456789',
    'delivery',
    350000,
    '2024-02-01',
    'active'
  ),
  (
    'Linda',
    'Lienou',
    'linda.lienou@madon.cm',
    '+237634567890',
    'stock_manager',
    400000,
    '2024-01-20',
    'active'
  ),
  (
    'Victoire',
    'Nganso',
    'victoire.nganso@madon.cm',
    '+237645678901',
    'delivery',
    350000,
    '2024-02-10',
    'active'
  ),
  (
    'Manuela',
    'Fotso',
    'manuela.fotso@madon.cm',
    '+237656789012',
    'admin',
    500000,
    '2024-01-10',
    'active'
  );