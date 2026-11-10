-- Run once after the Drizzle migration that creates recovery_phrase.
-- Run it as your owner role (the one that runs migrations).

-- 1. A restricted role for the app. It must NOT have BYPASSRLS and must not own the tables.
--    (You can also create this role in the Neon console instead.)
CREATE ROLE app_user LOGIN PASSWORD '@dionysus-super-user';

GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

-- 2. Row-level security on the recovery phrase table.
ALTER TABLE recovery_phrase ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_phrase FORCE ROW LEVEL SECURITY;

-- The app sets app.user_id for the current transaction (see db/rls.ts).
-- With no value set, current_setting(..., true) returns NULL and no rows match.
CREATE POLICY recovery_phrase_owner ON recovery_phrase
  FOR ALL
  TO app_user
  USING (user_id = current_setting('app.user_id', true))
  WITH CHECK (user_id = current_setting('app.user_id', true));

-- 3. Point the app's DATABASE_URL at app_user.
--    Keep the owner connection string only for migrations (drizzle-kit).