/*
  # Initial Schema Setup for MADON Management App

  1. Tables
    - projects
      - id (uuid, primary key)
      - created_at (timestamp)
      - title (text)
      - description (text)
      - status (text)
      - client_id (uuid, foreign key)
      - user_id (uuid, foreign key)
    
    - clients
      - id (uuid, primary key)
      - created_at (timestamp)
      - name (text)
      - email (text)
      - phone (text)
      - user_id (uuid, foreign key)
    
    - tasks
      - id (uuid, primary key)
      - created_at (timestamp)
      - title (text)
      - description (text)
      - status (text)
      - project_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - due_date (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  status text NOT NULL,
  client_id uuid REFERENCES auth.users(id),
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('en_cours', 'termine', 'en_attente', 'annule'))
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  user_id uuid REFERENCES auth.users(id)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  status text NOT NULL,
  project_id uuid REFERENCES projects(id),
  user_id uuid REFERENCES auth.users(id),
  due_date timestamptz NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('a_faire', 'en_cours', 'termine'))
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);