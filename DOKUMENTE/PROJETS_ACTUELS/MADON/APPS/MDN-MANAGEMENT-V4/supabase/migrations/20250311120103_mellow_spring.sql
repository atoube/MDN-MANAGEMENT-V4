/*
  # Création des tables de gestion de projets

  1. Nouvelles Tables
    - `projects`
      - `id` (uuid, primary key) - Identifiant unique du projet
      - `title` (text) - Titre du projet
      - `description` (text) - Description
      - `status` (text) - Statut (en_cours, termine, en_attente, annule)
      - `client_id` (uuid) - Client associé
      - `user_id` (uuid) - Créateur
      - `created_at` (timestamptz) - Date de création

    - `tasks`
      - `id` (uuid, primary key) - Identifiant unique
      - `title` (text) - Titre de la tâche
      - `description` (text) - Description
      - `status` (text) - Statut (a_faire, en_cours, termine)
      - `project_id` (uuid) - Projet associé
      - `user_id` (uuid) - Créateur
      - `due_date` (timestamptz) - Date d'échéance
      - `created_at` (timestamptz) - Date de création

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour la gestion des projets et tâches

  3. Contraintes
    - Validation des statuts via CHECK
    - Relations entre les tables
*/

-- Création de la table des projets
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    description text,
    status text NOT NULL,
    client_id uuid,
    user_id uuid,
    CONSTRAINT valid_status CHECK (status IN ('en_cours', 'termine', 'en_attente', 'annule'))
  );

  -- Ajout des clés étrangères si elles n'existent pas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') 
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'projects_client_id_fkey'
  ) THEN
    ALTER TABLE projects
      ADD CONSTRAINT projects_client_id_fkey FOREIGN KEY (client_id) REFERENCES users(id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'projects_user_id_fkey'
  ) THEN
    ALTER TABLE projects
      ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

-- Création de la table des tâches
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    description text,
    status text NOT NULL,
    project_id uuid,
    user_id uuid,
    due_date timestamptz NOT NULL,
    CONSTRAINT valid_status CHECK (status IN ('a_faire', 'en_cours', 'termine'))
  );

  -- Ajout des clés étrangères si elles n'existent pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_project_id_fkey'
  ) THEN
    ALTER TABLE tasks
      ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_user_id_fkey'
  ) THEN
    ALTER TABLE tasks
      ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

-- Activation de la sécurité niveau ligne
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour les projets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
  CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can read own projects" ON projects;
  CREATE POLICY "Users can read own projects" ON projects
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own projects" ON projects;
  CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;

-- Politiques de sécurité pour les tâches
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
  CREATE POLICY "Users can insert own tasks" ON tasks
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
  CREATE POLICY "Users can read own tasks" ON tasks
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
  CREATE POLICY "Users can update own tasks" ON tasks
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;