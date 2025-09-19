CREATE OR REPLACE FUNCTION initialize_absence_structures()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Création des tables si elles n'existent pas
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

    -- Création de la vue
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
END;
$$; 