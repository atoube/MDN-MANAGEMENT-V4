-- Créer la table _exec_sql pour exécuter du SQL dynamiquement
CREATE TABLE IF NOT EXISTS _exec_sql (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Créer une fonction pour exécuter le SQL
CREATE OR REPLACE FUNCTION execute_sql()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE NEW.query;
  RETURN NEW;
END;
$$;

-- Créer un trigger pour exécuter le SQL
DROP TRIGGER IF EXISTS execute_sql_trigger ON _exec_sql;
CREATE TRIGGER execute_sql_trigger
  BEFORE INSERT ON _exec_sql
  FOR EACH ROW
  EXECUTE FUNCTION execute_sql();

-- Donner les permissions nécessaires
GRANT ALL ON _exec_sql TO authenticated;
GRANT ALL ON _exec_sql TO service_role; 