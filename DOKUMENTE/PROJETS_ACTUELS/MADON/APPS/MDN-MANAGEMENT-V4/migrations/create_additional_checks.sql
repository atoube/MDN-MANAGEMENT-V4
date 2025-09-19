-- Fonction pour vérifier et corriger les contraintes de clé étrangère
CREATE OR REPLACE FUNCTION verify_foreign_keys()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier et corriger les contraintes de clé étrangère manquantes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'absences' 
        AND constraint_name = 'absences_employee_id_fkey'
    ) THEN
        ALTER TABLE public.absences
        ADD CONSTRAINT absences_employee_id_fkey 
        FOREIGN KEY (employee_id) 
        REFERENCES public.employees(id) 
        ON DELETE CASCADE;
    END IF;

    -- Vérifier les données orphelines
    DELETE FROM public.absences 
    WHERE employee_id NOT IN (SELECT id FROM public.employees);
END;
$$;

-- Fonction pour vérifier et corriger les types de données
CREATE OR REPLACE FUNCTION verify_column_types()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier et corriger les types de colonnes si nécessaire
    ALTER TABLE public.absences 
    ALTER COLUMN start_date TYPE DATE USING start_date::DATE,
    ALTER COLUMN end_date TYPE DATE USING end_date::DATE,
    ALTER COLUMN days_count TYPE INTEGER USING days_count::INTEGER;

    -- Ajouter des contraintes de validation
    ALTER TABLE public.absences 
    ADD CONSTRAINT valid_dates 
    CHECK (end_date >= start_date);

    ALTER TABLE public.absences 
    ADD CONSTRAINT positive_days 
    CHECK (days_count > 0);
END;
$$; 