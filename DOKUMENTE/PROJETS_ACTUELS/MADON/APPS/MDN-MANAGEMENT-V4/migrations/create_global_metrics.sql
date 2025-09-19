-- Création de la table pour les métriques globales
CREATE TABLE IF NOT EXISTS public.global_metrics (
    id TEXT PRIMARY KEY,
    active_employees INTEGER NOT NULL DEFAULT 0,
    average_performance DECIMAL(5,2) NOT NULL DEFAULT 0,
    attendance_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissions
ALTER TABLE public.global_metrics ENABLE ROW LEVEL SECURITY;

-- Politique de sécurité pour la lecture
CREATE POLICY "Allow authenticated users to read global metrics"
    ON public.global_metrics
    FOR SELECT
    TO authenticated
    USING (true);

-- Politique de sécurité pour la modification
CREATE POLICY "Allow managers to update global metrics"
    ON public.global_metrics
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.employees 
            WHERE auth_id = auth.uid() 
            AND role = 'manager'
        )
    );

-- Accorder les permissions nécessaires
GRANT SELECT ON public.global_metrics TO authenticated;
GRANT INSERT, UPDATE ON public.global_metrics TO authenticated; 