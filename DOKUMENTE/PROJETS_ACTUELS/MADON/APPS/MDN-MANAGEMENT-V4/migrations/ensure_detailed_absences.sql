-- Fonction pour s'assurer que la vue detailed_absences existe et est correcte
CREATE OR REPLACE FUNCTION ensure_detailed_absences()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier si la vue existe
    IF NOT EXISTS (
        SELECT FROM pg_views 
        WHERE schemaname = 'public' 
        AND viewname = 'detailed_absences'
    ) THEN
        -- Créer la vue si elle n'existe pas
        EXECUTE '
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
            e.email,
            e.department,
            e.position,
            au.email as user_email
        FROM 
            public.absences a
            LEFT JOIN public.employees e ON a.employee_id = e.id
            LEFT JOIN auth.users au ON e.auth_id = au.id';

        -- Accorder les permissions
        EXECUTE 'GRANT SELECT ON public.detailed_absences TO authenticated';
    END IF;
END;
$$;

-- Exécuter la fonction
SELECT ensure_detailed_absences(); 