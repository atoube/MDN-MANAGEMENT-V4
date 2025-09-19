-- Fonction pour vérifier l'intégrité des données
CREATE OR REPLACE FUNCTION check_database_integrity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    missing_tables text[];
    missing_columns text[];
    invalid_permissions text[];
BEGIN
    -- Vérifier l'existence des tables
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'employees') THEN
        missing_tables := array_append(missing_tables, 'employees');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'absences') THEN
        missing_tables := array_append(missing_tables, 'absences');
    END IF;

    -- Vérifier l'existence de la vue
    IF NOT EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'detailed_absences') THEN
        PERFORM recreate_detailed_absences_view();
    END IF;

    -- Vérifier les permissions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.role_table_grants 
        WHERE grantee = 'authenticated' 
        AND table_name = 'detailed_absences'
        AND privilege_type = 'SELECT'
    ) THEN
        GRANT SELECT ON public.detailed_absences TO authenticated;
    END IF;

    -- Vérifier les politiques RLS
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'absences'
    ) THEN
        -- Recréer les politiques
        CREATE POLICY "Les employés peuvent voir leurs propres absences" ON public.absences
            FOR SELECT USING (
                auth.uid() IN (
                    SELECT auth_id 
                    FROM employees 
                    WHERE id = employee_id
                )
            );
    END IF;
END;
$$;

-- Fonction pour réparer les séquences et index
CREATE OR REPLACE FUNCTION repair_database_objects()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Recréer les index si nécessaire
    DROP INDEX IF EXISTS idx_absences_employee_id;
    CREATE INDEX idx_absences_employee_id ON public.absences(employee_id);
    
    DROP INDEX IF EXISTS idx_absences_status;
    CREATE INDEX idx_absences_status ON public.absences(status);
    
    DROP INDEX IF EXISTS idx_absences_dates;
    CREATE INDEX idx_absences_dates ON public.absences(start_date, end_date);

    -- Mettre à jour les statistiques
    ANALYZE public.absences;
    ANALYZE public.employees;
END;
$$; 