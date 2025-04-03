/*
  # Update Modules Table with Icon Names

  This migration updates the icon names in the modules table to match the Lucide React component names.
*/

UPDATE modules
SET icon = CASE name
  WHEN 'Tableau de bord' THEN 'LayoutDashboard'
  WHEN 'Livraisons' THEN 'Truck'
  WHEN 'Employés' THEN 'Users'
  WHEN 'Vendeurs' THEN 'Store'
  WHEN 'Stocks' THEN 'Package'
  WHEN 'Activités' THEN 'ClipboardList'
  WHEN 'Marketing' THEN 'Share2'
  WHEN 'Finances' THEN 'DollarSign'
  ELSE icon
END;