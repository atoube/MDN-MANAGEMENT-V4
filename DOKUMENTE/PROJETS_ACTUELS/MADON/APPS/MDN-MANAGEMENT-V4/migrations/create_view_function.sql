CREATE OR REPLACE FUNCTION recreate_detailed_absences_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Supprimer la vue si elle existe
    DROP VIEW IF EXISTS public.detailed_absences;
    
    -- Recréer la vue
    CREATE VIEW public.detailed_absences AS
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

    -- Attribuer les permissions
    GRANT SELECT ON public.detailed_absences TO authenticated;
END;
$$; 