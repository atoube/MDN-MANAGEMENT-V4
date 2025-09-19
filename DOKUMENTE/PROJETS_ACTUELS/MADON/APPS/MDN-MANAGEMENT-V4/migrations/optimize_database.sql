-- Optimisation de la structure de la base de données
CREATE OR REPLACE FUNCTION optimize_database_structure()
RETURNS void AS $$
BEGIN
    -- 1. Ajout de contraintes de validation pour les salaires
    ALTER TABLE public.salaries 
    ADD CONSTRAINT IF NOT EXISTS valid_effective_date 
    CHECK (effective_date <= CURRENT_DATE);

    -- 2. Ajout d'une colonne pour le statut de l'employé
    ALTER TABLE public.employees 
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' 
    CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated'));

    -- 3. Ajout d'une colonne pour la date de fin de contrat
    ALTER TABLE public.employees 
    ADD COLUMN IF NOT EXISTS contract_end_date DATE;

    -- 4. Ajout d'une colonne pour le type de contrat
    ALTER TABLE public.employees 
    ADD COLUMN IF NOT EXISTS contract_type VARCHAR(20) DEFAULT 'full_time' 
    CHECK (contract_type IN ('full_time', 'part_time', 'contractor', 'intern'));

    -- 5. Ajout d'une colonne pour le nombre d'années d'expérience
    ALTER TABLE public.employees 
    ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0 
    CHECK (years_of_experience >= 0);

    -- 6. Ajout d'une colonne pour les compétences
    ALTER TABLE public.employees 
    ADD COLUMN IF NOT EXISTS skills TEXT[];

    -- 7. Ajout d'une colonne pour les objectifs de performance
    ALTER TABLE public.employees 
    ADD COLUMN IF NOT EXISTS performance_goals JSONB;

    -- 8. Création d'une table pour les évaluations de performance
    CREATE TABLE IF NOT EXISTS public.performance_evaluations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
        evaluator_id UUID NOT NULL REFERENCES auth.users(id),
        evaluation_date DATE NOT NULL,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
        technical_skills INTEGER NOT NULL CHECK (technical_skills BETWEEN 1 AND 5),
        communication_skills INTEGER NOT NULL CHECK (communication_skills BETWEEN 1 AND 5),
        teamwork INTEGER NOT NULL CHECK (teamwork BETWEEN 1 AND 5),
        leadership INTEGER CHECK (leadership BETWEEN 1 AND 5),
        comments TEXT,
        goals_for_next_period TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_evaluation_dates CHECK (period_end >= period_start)
    );

    -- 9. Création d'une table pour les formations
    CREATE TABLE IF NOT EXISTS public.trainings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(100) NOT NULL,
        description TEXT,
        provider VARCHAR(100),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        cost DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_training_dates CHECK (end_date >= start_date),
        CONSTRAINT positive_cost CHECK (cost >= 0)
    );

    -- 10. Création d'une table de liaison pour les employés et les formations
    CREATE TABLE IF NOT EXISTS public.employee_trainings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
        training_id UUID NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'failed', 'dropped')),
        completion_date DATE,
        score INTEGER CHECK (score BETWEEN 0 AND 100),
        feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(employee_id, training_id)
    );

    -- 11. Création d'une table pour les projets
    CREATE TABLE IF NOT EXISTS public.projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'on_hold', 'cancelled')),
        budget DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT positive_budget CHECK (budget >= 0)
    );

    -- 12. Création d'une table de liaison pour les employés et les projets
    CREATE TABLE IF NOT EXISTS public.employee_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        allocation_percentage INTEGER NOT NULL CHECK (allocation_percentage BETWEEN 0 AND 100),
        start_date DATE NOT NULL,
        end_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(employee_id, project_id)
    );

    -- 13. Création d'index pour améliorer les performances
    CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
    CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(department);
    CREATE INDEX IF NOT EXISTS idx_performance_evaluations_employee_id ON public.performance_evaluations(employee_id);
    CREATE INDEX IF NOT EXISTS idx_performance_evaluations_evaluation_date ON public.performance_evaluations(evaluation_date);
    CREATE INDEX IF NOT EXISTS idx_trainings_status ON public.trainings(status);
    CREATE INDEX IF NOT EXISTS idx_employee_trainings_employee_id ON public.employee_trainings(employee_id);
    CREATE INDEX IF NOT EXISTS idx_employee_trainings_training_id ON public.employee_trainings(training_id);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
    CREATE INDEX IF NOT EXISTS idx_employee_projects_employee_id ON public.employee_projects(employee_id);
    CREATE INDEX IF NOT EXISTS idx_employee_projects_project_id ON public.employee_projects(project_id);

    -- 14. Activation de RLS (Row Level Security)
    ALTER TABLE public.performance_evaluations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.employee_trainings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.employee_projects ENABLE ROW LEVEL SECURITY;

    -- 15. Création des politiques de sécurité
    -- Suppression des politiques existantes pour éviter les conflits
    DROP POLICY IF EXISTS "Les employés peuvent voir leurs propres évaluations" ON public.performance_evaluations;
    DROP POLICY IF EXISTS "Les managers peuvent voir les évaluations de leur département" ON public.performance_evaluations;
    DROP POLICY IF EXISTS "Tout le monde peut voir les formations" ON public.trainings;
    DROP POLICY IF EXISTS "Les employés peuvent voir leurs propres formations" ON public.employee_trainings;
    DROP POLICY IF EXISTS "Les managers peuvent voir les formations de leur département" ON public.employee_trainings;
    DROP POLICY IF EXISTS "Tout le monde peut voir les projets" ON public.projects;
    DROP POLICY IF EXISTS "Les employés peuvent voir leurs propres projets" ON public.employee_projects;
    DROP POLICY IF EXISTS "Les managers peuvent voir les projets de leur département" ON public.employee_projects;

    -- Création des nouvelles politiques
    CREATE POLICY "Les employés peuvent voir leurs propres évaluations"
        ON public.performance_evaluations FOR SELECT
        USING (auth.uid() = employee_id);

    CREATE POLICY "Les managers peuvent voir les évaluations de leur département"
        ON public.performance_evaluations FOR SELECT
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

    CREATE POLICY "Tout le monde peut voir les formations"
        ON public.trainings FOR SELECT
        USING (true);

    CREATE POLICY "Les employés peuvent voir leurs propres formations"
        ON public.employee_trainings FOR SELECT
        USING (auth.uid() = employee_id);

    CREATE POLICY "Les managers peuvent voir les formations de leur département"
        ON public.employee_trainings FOR SELECT
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

    CREATE POLICY "Tout le monde peut voir les projets"
        ON public.projects FOR SELECT
        USING (true);

    CREATE POLICY "Les employés peuvent voir leurs propres projets"
        ON public.employee_projects FOR SELECT
        USING (auth.uid() = employee_id);

    CREATE POLICY "Les managers peuvent voir les projets de leur département"
        ON public.employee_projects FOR SELECT
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

-- Création des triggers pour les nouvelles tables
CREATE TRIGGER update_performance_evaluations_updated_at
    BEFORE UPDATE ON public.performance_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at
    BEFORE UPDATE ON public.trainings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_trainings_updated_at
    BEFORE UPDATE ON public.employee_trainings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_projects_updated_at
    BEFORE UPDATE ON public.employee_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Exécution de la fonction principale
SELECT optimize_database_structure(); 