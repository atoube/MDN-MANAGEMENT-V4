-- Enable RLS
alter table public.social_media_stats enable row level security;
alter table public.social_media_posts enable row level security;
alter table public.email_campaigns enable row level security;
alter table public.social_media_connections enable row level security;
alter table public.oauth_states enable row level security;

-- Create social_media_stats table
create table if not exists public.social_media_stats (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  platform text not null,
  followers integer default 0,
  growth integer default 0,
  likes integer default 0,
  engagement integer default 0,
  user_id uuid references auth.users not null
);

-- Create social_media_posts table
create table if not exists public.social_media_posts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  platform text not null,
  title text not null,
  content text not null,
  engagement integer default 0,
  likes integer default 0,
  shares integer default 0,
  publish_date timestamp with time zone,
  status text check (status in ('draft', 'published', 'scheduled')) default 'draft',
  user_id uuid references auth.users not null
);

-- Create email_campaigns table
create table if not exists public.email_campaigns (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  subject text not null,
  content text not null,
  recipients integer default 0,
  open_rate numeric(5,2) default 0,
  click_rate numeric(5,2) default 0,
  status text check (status in ('draft', 'scheduled', 'sent', 'cancelled')) default 'draft',
  scheduled_date timestamp with time zone,
  sent_date timestamp with time zone,
  user_id uuid references auth.users not null
);

-- Create social_media_connections table
create table if not exists public.social_media_connections (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  platform text not null,
  access_token text not null,
  refresh_token text,
  token_expires_at timestamp with time zone,
  account_id text not null,
  account_name text not null,
  account_type text not null,
  status text check (status in ('active', 'expired', 'revoked')) default 'active',
  user_id uuid references auth.users not null
);

-- Create oauth_states table
create table if not exists public.oauth_states (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  state text unique not null,
  platform text not null,
  user_id uuid references auth.users not null
);

-- Create RLS policies
create policy "Users can view their own social media stats"
  on public.social_media_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert their own social media stats"
  on public.social_media_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own social media stats"
  on public.social_media_stats for update
  using (auth.uid() = user_id);

create policy "Users can view their own social media posts"
  on public.social_media_posts for select
  using (auth.uid() = user_id);

create policy "Users can manage their own social media posts"
  on public.social_media_posts for all
  using (auth.uid() = user_id);

create policy "Users can view their own email campaigns"
  on public.email_campaigns for select
  using (auth.uid() = user_id);

create policy "Users can manage their own email campaigns"
  on public.email_campaigns for all
  using (auth.uid() = user_id);

create policy "Users can view their own social media connections"
  on public.social_media_connections for select
  using (auth.uid() = user_id);

create policy "Users can manage their own social media connections"
  on public.social_media_connections for all
  using (auth.uid() = user_id);

create policy "Users can view their own oauth states"
  on public.oauth_states for select
  using (auth.uid() = user_id);

create policy "Users can manage their own oauth states"
  on public.oauth_states for all
  using (auth.uid() = user_id); 