-- Insertion de quelques employés de test
INSERT INTO public.employees 
(first_name, last_name, email, phone, department, position, role, status, hire_date)
VALUES
('Jean', 'Dupont', 'jean.dupont@example.com', '+33123456789', 'IT', 'Développeur', 'employee', 'active', '2023-01-01'),
('Marie', 'Martin', 'marie.martin@example.com', '+33123456790', 'RH', 'RH Manager', 'manager', 'active', '2023-01-01');

-- Insertion de quelques absences de test
INSERT INTO public.absences 
(employee_id, start_date, end_date, type, status, days_count, reason)
VALUES
(1, '2024-03-01', '2024-03-05', 'Congés payés', 'pending', 5, 'Vacances'),
(2, '2024-03-10', '2024-03-12', 'Maladie', 'approved', 3, 'Grippe');

-- Insertion de quelques salaires de test
INSERT INTO public.employee_salaries 
(employee_id, base_amount, bonuses, effective_date)
VALUES
(1, 45000.00, 2000.00, '2024-01-01'),
(2, 55000.00, 3000.00, '2024-01-01'); 