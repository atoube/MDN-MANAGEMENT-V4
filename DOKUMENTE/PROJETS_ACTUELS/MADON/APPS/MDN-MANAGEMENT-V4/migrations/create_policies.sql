-- Activation de RLS sur toutes les tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_salaries ENABLE ROW LEVEL SECURITY;

-- Politiques pour les employés
CREATE POLICY "Employés visibles par tous les utilisateurs authentifiés"
ON public.employees FOR SELECT
TO authenticated
USING (true);

-- Politiques pour les absences
CREATE POLICY "Utilisateurs peuvent voir leurs propres absences"
ON public.absences FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT id::text FROM employees WHERE email = auth.jwt()->>'email'
    )
    OR 
    EXISTS (
        SELECT 1 FROM employees 
        WHERE department = (
            SELECT department FROM employees WHERE email = auth.jwt()->>'email'
        )
        AND role = 'manager'
    )
);

-- Politiques pour les salaires
CREATE POLICY "Accès aux salaires limité aux RH et managers"
ON public.employee_salaries FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE email = auth.jwt()->>'email'
        AND (role = 'manager' OR department = 'RH')
    )
); 