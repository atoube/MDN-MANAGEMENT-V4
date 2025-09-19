-- Création de la fonction pour vérifier et corriger la structure de la base de données
CREATE OR REPLACE FUNCTION fix_database_structure()
RETURNS void AS $$
BEGIN
    -- 1. Création de la table des salaires si elle n'existe pas
    CREATE TABLE IF NOT EXISTS public.salaries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
        base_amount DECIMAL(10,2) NOT NULL,
        bonuses DECIMAL(10,2) DEFAULT 0,
        deductions DECIMAL(10,2) DEFAULT 0,
        effective_date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID REFERENCES auth.users(id),
        CONSTRAINT positive_amount CHECK (base_amount >= 0),
        CONSTRAINT positive_bonuses CHECK (bonuses >= 0),
        CONSTRAINT positive_deductions CHECK (deductions >= 0)
    );

    -- 2. Création de la table des absences si elle n'existe pas
    CREATE TABLE IF NOT EXISTS public.absences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        reason TEXT,
        days_count INTEGER NOT NULL,
        document_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_dates CHECK (end_date >= start_date),
        CONSTRAINT positive_days CHECK (days_count > 0),
        CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
    );

    -- 3. Création de la vue detailed_absences
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
        e.position
    FROM public.absences a
    LEFT JOIN public.employees e ON a.employee_id = e.id;

    -- 4. Création des index pour améliorer les performances
    CREATE INDEX IF NOT EXISTS idx_salaries_employee_id ON public.salaries(employee_id);
    CREATE INDEX IF NOT EXISTS idx_salaries_effective_date ON public.salaries(effective_date);
    CREATE INDEX IF NOT EXISTS idx_absences_employee_id ON public.absences(employee_id);
    CREATE INDEX IF NOT EXISTS idx_absences_status ON public.absences(status);
    CREATE INDEX IF NOT EXISTS idx_absences_dates ON public.absences(start_date, end_date);

    -- 5. Activation de RLS (Row Level Security)
    ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

    -- 6. Création des politiques de sécurité
    -- Suppression des politiques existantes pour éviter les conflits
    DROP POLICY IF EXISTS "Les employés peuvent voir leurs propres salaires" ON public.salaries;
    DROP POLICY IF EXISTS "Les managers peuvent voir les salaires de leur département" ON public.salaries;
    DROP POLICY IF EXISTS "Les employés peuvent voir leurs propres absences" ON public.absences;
    DROP POLICY IF EXISTS "Les managers peuvent voir les absences de leur département" ON public.absences;

    -- Création des nouvelles politiques
    CREATE POLICY "Les employés peuvent voir leurs propres salaires"
        ON public.salaries FOR SELECT
        USING (auth.uid() = employee_id);

    CREATE POLICY "Les managers peuvent voir les salaires de leur département"
        ON public.salaries FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.employees e
                WHERE e.id = employee_id
                AND e.department = (
                    SELECT department FROM public.employees
                    WHERE auth_id = auth.uid()
                )
            )
        );

    CREATE POLICY "Les employés peuvent voir leurs propres absences"
        ON public.absences FOR SELECT
        USING (auth.uid() = employee_id);

    CREATE POLICY "Les managers peuvent voir les absences de leur département"
        ON public.absences FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.employees e
                WHERE e.id = employee_id
                AND e.department = (
                    SELECT department FROM public.employees
                    WHERE auth_id = auth.uid()
                )
            )
        );

END;
$$ LANGUAGE plpgsql;

-- Création de la fonction pour mettre à jour la colonne updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Création de la fonction pour calculer les jours d'absence
CREATE OR REPLACE FUNCTION calculate_absence_days()
RETURNS TRIGGER AS $$
BEGIN
    NEW.days_count := (
        SELECT COUNT(*)
        FROM generate_series(
            NEW.start_date::date,
            NEW.end_date::date,
            '1 day'::interval
        ) AS dates
        WHERE EXTRACT(DOW FROM dates) NOT IN (0, 6)
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Exécution de la fonction principale
SELECT fix_database_structure();

-- Création des triggers après la création des tables
CREATE TRIGGER update_salaries_updated_at
    BEFORE UPDATE ON public.salaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_absences_updated_at
    BEFORE UPDATE ON public.absences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER calculate_absence_days_trigger
    BEFORE INSERT OR UPDATE ON public.absences
    FOR EACH ROW
    EXECUTE FUNCTION calculate_absence_days(); 