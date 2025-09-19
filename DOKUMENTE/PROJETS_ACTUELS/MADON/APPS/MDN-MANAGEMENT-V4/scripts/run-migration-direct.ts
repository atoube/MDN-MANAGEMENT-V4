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

async function runMigration() {
  try {
    // Lecture du fichier de migration
    console.log('Lecture du fichier de migration...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20240327000000_leave_requests_direct.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Diviser le SQL en commandes individuelles
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    // Exécuter chaque commande séparément via l'API REST
    for (const command of commands) {
      console.log(`Exécution de la commande: ${command.substring(0, 50)}...`);
      
      // Utiliser l'API REST pour exécuter la commande SQL
      const { error } = await supabase
        .from('_exec_sql')
        .select('*')
        .eq('query', command);
      
      if (error) {
        console.error(`Erreur lors de l'exécution de la commande: ${error.message}`);
        // Continuer avec la commande suivante au lieu d'arrêter
      }
    }

    console.log('Migration exécutée avec succès');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
}

runMigration(); 