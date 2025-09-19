-- Vue pour les absences détaillées
CREATE OR REPLACE VIEW public.detailed_absences AS
SELECT 
    a.id,
    a.employee_id,
    a.start_date,
    a.end_date,
    a.type,
    a.status,
    a.days_count,
    a.reason,
    a.document_url,
    a.created_at,
    a.updated_at,
    e.first_name,
    e.last_name,
    e.department,
    e.position
FROM 
    public.absences a
    LEFT JOIN public.employees e ON a.employee_id = e.id;

-- Vue pour les salaires détaillés
CREATE OR REPLACE VIEW public.detailed_salaries AS
SELECT 
    s.*,
    e.first_name,
    e.last_name,
    e.department,
    e.position
FROM 
    public.employee_salaries s
    LEFT JOIN public.employees e ON s.employee_id = e.id; 