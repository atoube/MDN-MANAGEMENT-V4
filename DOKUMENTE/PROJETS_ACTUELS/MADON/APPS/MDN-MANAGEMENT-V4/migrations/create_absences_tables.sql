-- Création de la table des absences si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.absences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES public.employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reason TEXT,
    days_count INTEGER NOT NULL,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES auth.users(id)
);

-- Création de la table d'audit pour les absences
CREATE TABLE IF NOT EXISTS public.absences_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    absence_id UUID REFERENCES public.absences(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by UUID REFERENCES auth.users(id),
    changes JSONB
);

-- Création ou remplacement de la vue detailed_absences
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
    a.document_url,
    a.created_at,
    a.updated_at,
    e.first_name,
    e.last_name,
    e.department,
    e.position,
    u.email as updated_by_email
FROM 
    public.absences a
    LEFT JOIN public.employees e ON a.employee_id = e.id
    LEFT JOIN auth.users u ON a.updated_by = u.id;

-- Attribution des droits
GRANT SELECT ON public.detailed_absences TO authenticated;
GRANT ALL ON public.absences TO authenticated;
GRANT ALL ON public.absences_audit_log TO authenticated;

-- Création des politiques de sécurité
CREATE POLICY "Les employés peuvent voir leurs propres absences" ON public.absences
    FOR SELECT USING (
        auth.uid() IN (
            SELECT auth_id 
            FROM employees 
            WHERE id = employee_id
        )
    );

CREATE POLICY "Les managers peuvent voir les absences de leur département" ON public.absences
    FOR SELECT USING (
        auth.uid() IN (
            SELECT e1.auth_id 
            FROM employees e1
            JOIN employees e2 ON e1.department = e2.department
            WHERE e1.role = 'manager'
            AND e2.id = employee_id
        )
    );

CREATE POLICY "HR peut voir toutes les absences" ON public.absences
    FOR ALL USING (
        auth.uid() IN (
            SELECT auth_id 
            FROM employees 
            WHERE role = 'hr'
        )
    );

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_absences_updated_at
    BEFORE UPDATE ON public.absences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour l'audit
CREATE OR REPLACE FUNCTION log_absence_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.absences_audit_log (
        absence_id,
        old_status,
        new_status,
        changed_by,
        changes
    ) VALUES (
        NEW.id,
        OLD.status,
        NEW.status,
        auth.uid(),
        jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        )
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_absence_changes_trigger
    AFTER UPDATE ON public.absences
    FOR EACH ROW
    EXECUTE FUNCTION log_absence_changes();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_absences_employee_id ON public.absences(employee_id);
CREATE INDEX IF NOT EXISTS idx_absences_status ON public.absences(status);
CREATE INDEX IF NOT EXISTS idx_absences_dates ON public.absences(start_date, end_date); 