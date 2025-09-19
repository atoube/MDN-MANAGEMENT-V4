-- Vue améliorée pour les statistiques par département
CREATE OR REPLACE VIEW public.department_salary_stats AS
SELECT 
    e.department,
    COUNT(*) as employee_count,
    AVG(s.base_amount) as avg_base_salary,
    SUM(s.bonuses) as total_bonuses,
    AVG(s.net_amount) as avg_net_salary,
    MIN(s.net_amount) as min_salary,
    MAX(s.net_amount) as max_salary,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY s.net_amount) as median_salary,
    STDDEV(s.net_amount) as salary_deviation,
    SUM(s.deductions) as total_deductions,
    COUNT(CASE WHEN s.bonuses > 0 THEN 1 END) as employees_with_bonus
FROM 
    public.employee_salaries s
    JOIN public.employees e ON s.employee_id = e.id
GROUP BY 
    e.department;

-- Vue pour l'évolution des salaires
CREATE OR REPLACE VIEW public.salary_evolution_stats AS
SELECT 
    e.department,
    DATE_TRUNC('month', s.effective_date) as period,
    AVG(s.net_amount) as avg_salary,
    COUNT(*) as employee_count,
    SUM(s.bonuses) as total_bonuses
FROM 
    public.employee_salaries s
    JOIN public.employees e ON s.employee_id = e.id
GROUP BY 
    e.department,
    DATE_TRUNC('month', s.effective_date)
ORDER BY 
    e.department,
    period; 