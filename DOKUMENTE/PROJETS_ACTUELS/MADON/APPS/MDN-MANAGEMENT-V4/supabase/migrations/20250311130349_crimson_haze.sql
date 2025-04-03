/*
  # Assign positions to employees

  1. Changes
    - Updates existing employees with appropriate positions
    - Ensures each department has necessary staff
    - Sets up management hierarchy

  2. Position Distribution
    - 1 Director
    - 2 HR Officers
    - 3 Accountants
    - 4 Sales Representatives
    - 3 Stock Clerks
    - 5 Delivery Drivers
    - 3 Technicians
    - 4 Support Staff

  3. Notes
    - Preserves existing employee data
    - Updates only position field
    - Maintains active status
*/

-- Director (Top management)
UPDATE employees 
SET position = 'director'
WHERE email = 'narcomc@gmail.com';

-- HR Officers
UPDATE employees 
SET position = 'hr_officer'
WHERE email IN (
  'sarah.johnson@madon.com',
  'michael.brown@madon.com'
);

-- Accountants
UPDATE employees 
SET position = 'accountant'
WHERE email IN (
  'emma.davis@madon.com',
  'james.wilson@madon.com',
  'olivia.taylor@madon.com'
);

-- Sales Representatives
UPDATE employees 
SET position = 'sales_rep'
WHERE email IN (
  'william.anderson@madon.com',
  'sophia.martinez@madon.com',
  'lucas.thomas@madon.com',
  'ava.garcia@madon.com'
);

-- Stock Clerks
UPDATE employees 
SET position = 'stock_clerk'
WHERE email IN (
  'ethan.moore@madon.com',
  'isabella.lee@madon.com',
  'mason.white@madon.com'
);

-- Delivery Drivers
UPDATE employees 
SET position = 'delivery_driver'
WHERE email IN (
  'alexander.king@madon.com',
  'victoria.wright@madon.com',
  'daniel.lopez@madon.com',
  'mia.scott@madon.com',
  'henry.green@madon.com'
);

-- Technicians
UPDATE employees 
SET position = 'technician'
WHERE email IN (
  'benjamin.hill@madon.com',
  'chloe.adams@madon.com',
  'owen.baker@madon.com'
);

-- Support Staff
UPDATE employees 
SET position = 'support_staff'
WHERE email IN (
  'zoe.nelson@madon.com',
  'gabriel.carter@madon.com',
  'lily.mitchell@madon.com',
  'david.perez@madon.com'
);

-- Set default position for any remaining employees
UPDATE employees 
SET position = 'support_staff'
WHERE position IS NULL;