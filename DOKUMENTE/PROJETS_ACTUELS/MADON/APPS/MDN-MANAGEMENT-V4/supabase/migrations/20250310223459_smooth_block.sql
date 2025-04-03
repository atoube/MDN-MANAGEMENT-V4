/*
  # Création des employés tests avec authentification

  1. Création des utilisateurs dans auth.users
    - Crée 5 utilisateurs avec mot de passe initial '123456'
    - Configure l'email comme vérifié
    
  2. Création des employés
    - Ajoute 5 employés avec différents rôles
    - Lie chaque employé à son compte utilisateur
    - Vérifie l'existence avant insertion
*/

DO $$
DECLARE
  v_user_id uuid;
  v_password text := '$2a$12$DnKXnGxEOe3nVLm.O7VyYuYHJtXHFZgk8nQp8kO47T8Z.kQvKjrOO'; -- Hash de '123456'
BEGIN
  -- Admin
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'admin@themadon.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'admin@themadon.com', v_password, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
    RETURNING id INTO v_user_id;

    INSERT INTO employees (id, first_name, last_name, email, phone, role, salary, hire_date, status, user_id)
    VALUES (
      gen_random_uuid(),
      'Thomas',
      'Anderson',
      'admin@themadon.com',
      '+237699999999',
      'admin',
      1500000,
      '2024-01-01',
      'active',
      v_user_id
    );
  END IF;

  -- RH
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'rh@themadon.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'rh@themadon.com', v_password, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
    RETURNING id INTO v_user_id;

    INSERT INTO employees (id, first_name, last_name, email, phone, role, salary, hire_date, status, user_id)
    VALUES (
      gen_random_uuid(),
      'Marie',
      'Dubois',
      'rh@themadon.com',
      '+237688888888',
      'hr',
      800000,
      '2024-01-15',
      'active',
      v_user_id
    );
  END IF;

  -- Stock Manager
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'stock@themadon.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'stock@themadon.com', v_password, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
    RETURNING id INTO v_user_id;

    INSERT INTO employees (id, first_name, last_name, email, phone, role, salary, hire_date, status, user_id)
    VALUES (
      gen_random_uuid(),
      'Paul',
      'Martin',
      'stock@themadon.com',
      '+237677777777',
      'stock_manager',
      600000,
      '2024-02-01',
      'active',
      v_user_id
    );
  END IF;

  -- Delivery
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'delivery@themadon.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'delivery@themadon.com', v_password, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
    RETURNING id INTO v_user_id;

    INSERT INTO employees (id, first_name, last_name, email, phone, role, salary, hire_date, status, user_id)
    VALUES (
      gen_random_uuid(),
      'Sophie',
      'Laurent',
      'delivery@themadon.com',
      '+237666666666',
      'delivery',
      450000,
      '2024-02-15',
      'active',
      v_user_id
    );
  END IF;

  -- Second Stock Manager
  IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'stock2@themadon.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'stock2@themadon.com', v_password, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
    RETURNING id INTO v_user_id;

    INSERT INTO employees (id, first_name, last_name, email, phone, role, salary, hire_date, status, user_id)
    VALUES (
      gen_random_uuid(),
      'Lucas',
      'Petit',
      'stock2@themadon.com',
      '+237655555555',
      'stock_manager',
      700000,
      '2024-03-01',
      'active',
      v_user_id
    );
  END IF;
END $$;