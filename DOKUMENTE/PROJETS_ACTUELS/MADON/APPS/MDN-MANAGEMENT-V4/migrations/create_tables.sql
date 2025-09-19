-- Table des employés (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS public.employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    hire_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des absences
CREATE TABLE IF NOT EXISTS public.absences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id INTEGER REFERENCES public.employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    days_count INTEGER NOT NULL,
    reason TEXT,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Table des salaires
CREATE TABLE IF NOT EXISTS public.employee_salaries (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES public.employees(id),
    base_amount DECIMAL(12,2) NOT NULL,
    bonuses DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) GENERATED ALWAYS AS (base_amount + bonuses - deductions) STORED,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_absences_employee_id ON public.absences(employee_id);
CREATE INDEX IF NOT EXISTS idx_absences_status ON public.absences(status);
CREATE INDEX IF NOT EXISTS idx_absences_dates ON public.absences(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_employee_salaries_employee_id ON public.employee_salaries(employee_id); 