-- Ajout de colonnes pour le suivi des modifications
ALTER TABLE absences 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Mise à jour de la vue detailed_absences
DROP VIEW IF EXISTS detailed_absences;
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

-- Création d'un trigger pour mettre à jour updated_at et updated_by
CREATE OR REPLACE FUNCTION update_absence_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER absence_audit_trigger
    BEFORE UPDATE ON absences
    FOR EACH ROW
    EXECUTE FUNCTION update_absence_audit_fields(); 