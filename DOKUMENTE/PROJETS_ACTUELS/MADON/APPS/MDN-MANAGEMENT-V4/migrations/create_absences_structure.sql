-- Création de la table absences si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.absences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    reason TEXT,
    days_count INTEGER,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID,
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE
);

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
    a.document_url,
    a.created_at,
    a.updated_at,
    e.first_name,
    e.last_name,
    e.email,
    e.department,
    e.position,
    au.email as user_email
FROM 
    public.absences a
    LEFT JOIN public.employees e ON a.employee_id = e.id
    LEFT JOIN auth.users au ON e.auth_id = au.id;

-- Accorder les permissions nécessaires
GRANT SELECT ON public.detailed_absences TO authenticated;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité
CREATE POLICY "Users can view their own absences"
    ON public.absences
    FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM public.employees 
            WHERE auth_id = auth.uid()
        )
        OR 
        EXISTS (
            SELECT 1 FROM public.employees 
            WHERE auth_id = auth.uid() 
            AND role = 'manager'
        )
    ); 