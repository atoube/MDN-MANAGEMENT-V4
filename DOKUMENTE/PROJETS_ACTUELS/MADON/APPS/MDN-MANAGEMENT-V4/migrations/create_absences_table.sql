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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_absences_employee_id ON public.absences(employee_id);
CREATE INDEX IF NOT EXISTS idx_absences_status ON public.absences(status); 