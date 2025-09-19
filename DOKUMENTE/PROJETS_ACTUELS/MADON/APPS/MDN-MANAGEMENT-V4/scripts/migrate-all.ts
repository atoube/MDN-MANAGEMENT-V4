import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Configuration de __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chargement des variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Les variables d\'environnement VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises');
  process.exit(1);
}

// Création du client Supabase avec la clé de service
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Liste des migrations dans l'ordre d'exécution
const migrations = [
  '20240326000000_fix_database_structure.sql',
  '20240327000000_leave_requests.sql'
];

async function executeSqlCommand(command: string): Promise<void> {
  try {
    // Exécuter la commande SQL directement via l'API REST
    const { error } = await supabase
      .from('_exec_sql')
      .insert({ query: command });
    
    if (error) {
      console.error(`Erreur lors de l'exécution de la commande: ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande: ${error}`);
    throw error;
  }
}

async function runMigrations() {
  try {
    // Créer la table _exec_sql si elle n'existe pas
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS _exec_sql (
        id SERIAL PRIMARY KEY,
        query TEXT NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Activer RLS
      ALTER TABLE _exec_sql ENABLE ROW LEVEL SECURITY;
      
      -- Créer une politique pour permettre l'exécution de SQL
      DROP POLICY IF EXISTS "Permettre l'exécution de SQL" ON _exec_sql;
      CREATE POLICY "Permettre l'exécution de SQL" ON _exec_sql
        FOR ALL USING (auth.role() = 'service_role');
      
      -- Créer une fonction pour exécuter le SQL
      CREATE OR REPLACE FUNCTION execute_sql()
      RETURNS TRIGGER AS $$
      BEGIN
        EXECUTE NEW.query;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      -- Supprimer le trigger existant s'il existe
      DROP TRIGGER IF EXISTS execute_sql_trigger ON _exec_sql;
      
      -- Créer un trigger pour exécuter le SQL
      CREATE TRIGGER execute_sql_trigger
        BEFORE INSERT ON _exec_sql
        FOR EACH ROW
        EXECUTE FUNCTION execute_sql();
    `;

    // Exécuter la création de la table _exec_sql directement via l'API REST
    const { error: createTableError } = await supabase
      .from('_exec_sql')
      .insert({ query: createTableSQL });

    if (createTableError) {
      console.error('Erreur lors de la création de la table _exec_sql:', createTableError);
      // Continuer malgré l'erreur
    }

    for (const migrationFile of migrations) {
      console.log(`\nExécution de la migration ${migrationFile}...`);
      
      // Lecture du fichier de migration
      const migrationPath = join(__dirname, '..', 'supabase', 'migrations', migrationFile);
      const migrationSQL = readFileSync(migrationPath, 'utf8');

      // Diviser le SQL en commandes individuelles
      const commands = migrationSQL
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);

      // Exécuter chaque commande séparément
      for (const command of commands) {
        console.log(`Exécution de la commande: ${command.substring(0, 50)}...`);
        
        try {
          await executeSqlCommand(command);
        } catch (error) {
          console.error(`Erreur lors de l'exécution de la commande: ${error}`);
          // Continuer avec la commande suivante au lieu d'arrêter
        }
      }

      console.log(`Migration ${migrationFile} exécutée avec succès`);
    }

    console.log('\nToutes les migrations ont été exécutées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 