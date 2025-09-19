CREATE VIEW detailed_absences AS
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
    a.document_url,
    e.first_name,
    e.last_name,
    e.department,
    e.position
FROM 
    absences a
    LEFT JOIN employees e ON a.employee_id = e.id;

-- Ajout des politiques de sécurité pour la vue
CREATE POLICY "Employees can view their own absences" ON detailed_absences
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_id 
            FROM employees 
            WHERE id = employee_id
        )
    );

CREATE POLICY "Managers can view department absences" ON detailed_absences
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_id 
            FROM employees 
            WHERE role = 'manager' 
            AND department = (
                SELECT department 
                FROM employees 
                WHERE id = employee_id
            )
        )
    );

CREATE POLICY "HR can view all absences" ON detailed_absences
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_id 
            FROM employees 
            WHERE role = 'hr'
        )
    ); 