-- Vérifier et supprimer la vue si elle existe déjà (pour éviter les conflits)
DROP VIEW IF EXISTS public.detailed_absences;

-- Vérifier et créer la table employees si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vérifier et créer la table absences
CREATE TABLE IF NOT EXISTS public.absences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reason TEXT,
    days_count INTEGER NOT NULL,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID,
    FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- Créer la vue detailed_absences
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

-- Réinitialiser les permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.absences TO authenticated;
GRANT ALL ON public.employees TO authenticated;
GRANT SELECT ON public.detailed_absences TO authenticated;

-- Activer RLS
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Les employés peuvent voir leurs propres absences" ON public.absences;
DROP POLICY IF EXISTS "Les managers peuvent voir les absences de leur département" ON public.absences;
DROP POLICY IF EXISTS "HR peut voir toutes les absences" ON public.absences;

-- Recréer les politiques
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