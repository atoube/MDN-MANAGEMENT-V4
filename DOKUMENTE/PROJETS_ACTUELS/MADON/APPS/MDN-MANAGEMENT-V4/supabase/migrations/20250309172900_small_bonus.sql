/*
  # Create recipients management tables

  1. New Tables
    - `recipient_groups`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
    
    - `recipients`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
    
    - `recipient_group_members`
      - `recipient_id` (uuid, foreign key)
      - `group_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create recipient_groups table
CREATE TABLE IF NOT EXISTS recipient_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE recipient_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recipient groups"
  ON recipient_groups
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recipients"
  ON recipients
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create recipient_group_members junction table
CREATE TABLE IF NOT EXISTS recipient_group_members (
  recipient_id uuid REFERENCES recipients(id) ON DELETE CASCADE,
  group_id uuid REFERENCES recipient_groups(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (recipient_id, group_id)
);

ALTER TABLE recipient_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recipient group members"
  ON recipient_group_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipient_groups
      WHERE id = recipient_group_members.group_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipient_groups
      WHERE id = recipient_group_members.group_id
      AND user_id = auth.uid()
    )
  );