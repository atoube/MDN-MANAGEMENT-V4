/*
  # Add new modules

  1. New Modules
    - Accounting module
    - Payroll module
    - DGI Declarations module
    - Projects module

  2. Changes
    - Insert new modules into the modules table
*/

-- Insert new modules
INSERT INTO modules (name, path, icon, enabled, "order")
VALUES 
  ('Comptabilité', '/finance/accounting', 'FileText', true, (SELECT COALESCE(MAX("order"), 0) + 1 FROM modules)),
  ('Salaires', '/finance/payroll', 'DollarSign', true, (SELECT COALESCE(MAX("order"), 0) + 2 FROM modules)),
  ('Déclarations DGI', '/finance/dgi', 'FileCheck', true, (SELECT COALESCE(MAX("order"), 0) + 3 FROM modules)),
  ('Projets', '/projects', 'FolderKanban', true, (SELECT COALESCE(MAX("order"), 0) + 4 FROM modules));