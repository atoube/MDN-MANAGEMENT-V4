-- Créer la fonction exec_sql pour exécuter du SQL dynamiquement
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql TO service_role; 