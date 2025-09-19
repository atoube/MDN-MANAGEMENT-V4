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
    e.position,
    e.email,
    e.phone
FROM 
    public.absences a
    LEFT JOIN public.employees e ON a.employee_id = e.id;

-- Vue pour les salaires détaillés avec plus d'informations
CREATE OR REPLACE VIEW public.detailed_salaries AS
SELECT 
    s.id,
    s.employee_id,
    s.base_amount,
    s.bonuses,
    s.deductions,
    s.net_amount,
    s.effective_date,
    s.created_at,
    s.updated_at,
    e.first_name,
    e.last_name,
    e.department,
    e.position,
    e.email,
    e.status as employee_status
FROM 
    public.employee_salaries s
    LEFT JOIN public.employees e ON s.employee_id = e.id;

-- Ajout d'une fonction trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Création des triggers pour updated_at
CREATE TRIGGER update_employee_modtime
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_absence_modtime
    BEFORE UPDATE ON absences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salary_modtime
    BEFORE UPDATE ON employee_salaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 