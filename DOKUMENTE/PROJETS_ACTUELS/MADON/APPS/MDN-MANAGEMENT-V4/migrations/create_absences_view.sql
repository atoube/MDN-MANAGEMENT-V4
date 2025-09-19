-- Création de la vue detailed_absences
CREATE OR REPLACE VIEW public.detailed_absences AS
SELECT 
    a.id,
    a.employee_id,
    a.start_date,
    a.end_date,
    a.type,
    a.status,
    a.reason,
    a.days_count,
    a.created_at,
    a.updated_at,
    a.document_url,
    e.first_name,
    e.last_name,
    e.department,
    e.position,
    u.email as updated_by_email
FROM 
    absences a
    LEFT JOIN employees e ON a.employee_id = e.id
    LEFT JOIN auth.users u ON a.updated_by = u.id;

-- Ajout des politiques de sécurité pour la vue
ALTER VIEW public.detailed_absences OWNER TO authenticated;

CREATE POLICY "Les employés peuvent voir leurs propres absences" ON public.detailed_absences
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT auth_id 
            FROM employees 
            WHERE id = employee_id
        )
    );

CREATE POLICY "Les managers peuvent voir les absences de leur département" ON public.detailed_absences
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT e1.auth_id 
            FROM employees e1
            JOIN employees e2 ON e1.department = e2.department
            WHERE e1.role = 'manager'
            AND e2.id = employee_id
        )
    );

CREATE POLICY "HR peut voir toutes les absences" ON public.detailed_absences
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT auth_id 
            FROM employees 
            WHERE role = 'hr'
        )
    ); 