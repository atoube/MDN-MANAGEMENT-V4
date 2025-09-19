-- Table des salaires
CREATE TABLE IF NOT EXISTS public.employee_salaries (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES public.employees(id),
    base_amount DECIMAL(12,2) NOT NULL,
    bonuses DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table historique des salaires
CREATE TABLE IF NOT EXISTS public.employee_salary_history (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES public.employees(id),
    base_amount DECIMAL(12,2) NOT NULL,
    bonuses DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,
    effective_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour l'historique des salaires
CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.employee_salary_history (
        employee_id,
        base_amount,
        bonuses,
        deductions,
        net_amount,
        effective_date,
        reason
    ) VALUES (
        NEW.employee_id,
        NEW.base_amount,
        NEW.bonuses,
        NEW.deductions,
        NEW.net_amount,
        NEW.effective_date,
        'Mise à jour automatique'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER salary_history_trigger
AFTER INSERT OR UPDATE ON public.employee_salaries
FOR EACH ROW
EXECUTE FUNCTION log_salary_change(); 