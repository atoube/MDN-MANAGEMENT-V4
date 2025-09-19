-- Politiques plus détaillées pour les absences
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leurs propres absences" ON public.absences;

CREATE POLICY "Voir ses propres absences"
ON public.absences FOR SELECT
TO authenticated
USING (
    employee_id::text = auth.uid()
);

CREATE POLICY "Managers peuvent voir les absences de leur département"
ON public.absences FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees e
        WHERE e.id::text = auth.uid()
        AND e.role = 'manager'
        AND e.department = (
            SELECT department FROM employees 
            WHERE id = absences.employee_id
        )
    )
);

-- Politiques plus précises pour les salaires
DROP POLICY IF EXISTS "Accès aux salaires limité aux RH et managers" ON public.employee_salaries;

CREATE POLICY "RH peut voir tous les salaires"
ON public.employee_salaries FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE id::text = auth.uid()
        AND department = 'RH'
    )
);

CREATE POLICY "Managers peuvent voir les salaires de leur département"
ON public.employee_salaries FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees e1
        JOIN employees e2 ON e1.department = e2.department
        WHERE e1.id::text = auth.uid()
        AND e1.role = 'manager'
        AND e2.id = employee_salaries.employee_id
    )
);

-- Politiques pour la modification des salaires
CREATE POLICY "RH peut modifier tous les salaires"
ON public.employee_salaries FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE id::text = auth.uid()
        AND department = 'RH'
    )
);

-- Politiques pour la création des absences
CREATE POLICY "Employés peuvent créer leurs propres absences"
ON public.absences FOR INSERT
TO authenticated
WITH CHECK (
    employee_id::text = auth.uid()
);

-- Politiques pour la modification des absences
CREATE POLICY "RH peut modifier toutes les absences"
ON public.absences FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE id::text = auth.uid()
        AND department = 'RH'
    )
);

CREATE POLICY "Managers peuvent modifier les absences de leur département"
ON public.absences FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees e
        WHERE e.id::text = auth.uid()
        AND e.role = 'manager'
        AND e.department = (
            SELECT department FROM employees 
            WHERE id = absences.employee_id
        )
    )
);

-- Politiques pour la suppression des absences
CREATE POLICY "RH peut supprimer les absences"
ON public.absences FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE id::text = auth.uid()
        AND department = 'RH'
    )
);

-- Trigger pour l'historique des modifications
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    action_type TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    changed_by TEXT NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    old_data JSONB,
    new_data JSONB
);

CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        action_type,
        record_id,
        changed_by,
        old_data,
        new_data
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id 
            ELSE NEW.id 
        END,
        auth.uid(),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::jsonb ELSE NULL END
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_employee_salaries
AFTER INSERT OR UPDATE OR DELETE ON public.employee_salaries
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Politique pour la création des salaires
CREATE POLICY "RH peut créer des salaires"
ON public.employee_salaries FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE id::text = auth.uid()
        AND department = 'RH'
    )
);

-- Politique pour l'historique des salaires
CREATE POLICY "Accès à l'historique des salaires"
ON public.audit_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE id::text = auth.uid()
        AND (department = 'RH' OR role = 'manager')
    )
);

-- Trigger pour la validation des salaires
CREATE OR REPLACE FUNCTION validate_salary()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérification du montant minimum
    IF NEW.base_amount < 0 THEN
        RAISE EXCEPTION 'Le salaire de base ne peut pas être négatif';
    END IF;

    -- Vérification des bonus
    IF NEW.bonuses < 0 THEN
        RAISE EXCEPTION 'Les bonus ne peuvent pas être négatifs';
    END IF;

    -- Vérification des déductions
    IF NEW.deductions < 0 THEN
        RAISE EXCEPTION 'Les déductions ne peuvent pas être négatives';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_salary_values
BEFORE INSERT OR UPDATE ON public.employee_salaries
FOR EACH ROW EXECUTE FUNCTION validate_salary(); 