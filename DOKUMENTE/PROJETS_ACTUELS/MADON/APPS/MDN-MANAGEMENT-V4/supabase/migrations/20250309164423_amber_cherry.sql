/*
  # Création des tables marketing

  1. Nouvelles Tables
    - `social_media_stats`
      - Statistiques des réseaux sociaux
      - Suivi des abonnés, engagement, etc.
    - `social_media_posts`
      - Publications sur les réseaux sociaux
      - Contenu, performances, etc.
    - `email_campaigns`
      - Campagnes email marketing
      - Statistiques d'envoi, taux d'ouverture, etc.
    - `social_media_connections`
      - Connexions aux réseaux sociaux
      - Accès aux comptes, tokens, etc.
    - `oauth_states`
      - États OAuth pour les connexions aux réseaux sociaux

  2. Security
    - Enable RLS sur toutes les tables
    - Politiques pour les utilisateurs authentifiés
*/

-- Table des états OAuth
CREATE TABLE IF NOT EXISTS oauth_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  state text NOT NULL UNIQUE,
  platform text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_platform CHECK (platform = ANY (ARRAY['facebook', 'instagram', 'linkedin', 'twitter']))
);

ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own OAuth states"
  ON oauth_states
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Table des statistiques des réseaux sociaux
CREATE TABLE IF NOT EXISTS social_media_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  platform text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  token_expires_at timestamptz,
  account_id text NOT NULL,
  account_name text NOT NULL,
  account_type text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_platform CHECK (platform = ANY (ARRAY['facebook', 'instagram', 'linkedin', 'twitter'])),
  CONSTRAINT valid_status CHECK (status = ANY (ARRAY['active', 'expired', 'revoked']))
);

ALTER TABLE social_media_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social media connections"
  ON social_media_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Marketing team can manage social media connections"
  ON social_media_connections
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'marketing'::text);

-- Table des statistiques des réseaux sociaux
CREATE TABLE IF NOT EXISTS social_media_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  platform text NOT NULL,
  followers integer NOT NULL DEFAULT 0,
  growth numeric(5,2) NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0,
  engagement numeric(5,2) NOT NULL DEFAULT 0,
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_platform CHECK (platform = ANY (ARRAY['facebook', 'instagram', 'linkedin', 'twitter']))
);

ALTER TABLE social_media_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view social media stats"
  ON social_media_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Marketing team can manage social media stats"
  ON social_media_stats
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'marketing'::text);

-- Table des publications sur les réseaux sociaux
CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  platform text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  engagement numeric(5,2) DEFAULT 0,
  likes integer DEFAULT 0,
  shares integer DEFAULT 0,
  publish_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_platform CHECK (platform = ANY (ARRAY['facebook', 'instagram', 'linkedin', 'twitter'])),
  CONSTRAINT valid_status CHECK (status = ANY (ARRAY['draft', 'published', 'scheduled']))
);

ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view social media posts"
  ON social_media_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Marketing team can manage social media posts"
  ON social_media_posts
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'marketing'::text);

-- Table des campagnes email
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  recipients integer NOT NULL DEFAULT 0,
  open_rate numeric(5,2) DEFAULT 0,
  click_rate numeric(5,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  scheduled_date timestamptz,
  sent_date timestamptz,
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status = ANY (ARRAY['draft', 'scheduled', 'sent', 'cancelled']))
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view email campaigns"
  ON email_campaigns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Marketing team can manage email campaigns"
  ON email_campaigns
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'marketing'::text);

-- Insertion des données initiales
INSERT INTO social_media_stats (platform, followers, growth, likes, engagement) VALUES
  ('facebook', 25600, 5.2, 1200, 4.8),
  ('instagram', 18900, 3.8, 2300, 6.2),
  ('linkedin', 12400, 2.5, 450, 3.1),
  ('twitter', 15700, -1.2, 890, 2.9);

INSERT INTO social_media_posts (platform, title, content, engagement, likes, shares, publish_date, status) VALUES
  ('facebook', 'Nouvelle collection printemps 2024', 'Découvrez notre nouvelle collection...', 4.8, 520, 123, '2024-03-15', 'published'),
  ('instagram', 'Behind the scenes - Notre équipe', 'Rencontrez l''équipe derrière MADON...', 6.5, 890, 45, '2024-03-14', 'published'),
  ('linkedin', 'MADON Marketplace - 5 ans déjà !', 'Célébrons ensemble nos 5 ans...', 3.2, 230, 78, '2024-03-13', 'published');

INSERT INTO email_campaigns (name, subject, content, recipients, open_rate, click_rate, status, sent_date) VALUES
  ('Newsletter Mars 2024', 'Découvrez nos nouveautés', 'Contenu de la newsletter...', 2500, 45.0, 12.0, 'sent', '2024-03-10'),
  ('Promotion Printemps', 'Offres exclusives', 'Contenu de la promotion...', 3000, 0, 0, 'draft', NULL),
  ('Enquête satisfaction', 'Votre avis compte', 'Contenu de l''enquête...', 1800, 0, 0, 'scheduled', NULL);