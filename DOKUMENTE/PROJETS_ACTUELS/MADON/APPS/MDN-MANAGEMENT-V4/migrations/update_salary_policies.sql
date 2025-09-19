-- Politique pour les statistiques des salaires
CREATE POLICY "Accès aux statistiques salariales"
ON public.employee_salaries FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE id::text = auth.uid()
        AND (
            department = 'RH' 
            OR (role = 'manager' AND department = (
                SELECT department FROM employees WHERE id = employee_salaries.employee_id
            ))
        )
    )
);

-- Vue pour les statistiques par département
CREATE OR REPLACE VIEW public.department_salary_stats AS
SELECT 
    e.department,
    COUNT(*) as employee_count,
    AVG(s.base_amount) as avg_base_salary,
    SUM(s.bonuses) as total_bonuses,
    AVG(s.net_amount) as avg_net_salary,
    MIN(s.net_amount) as min_salary,
    MAX(s.net_amount) as max_salary
FROM 
    public.employee_salaries s
    JOIN public.employees e ON s.employee_id = e.id
GROUP BY 
    e.department; 