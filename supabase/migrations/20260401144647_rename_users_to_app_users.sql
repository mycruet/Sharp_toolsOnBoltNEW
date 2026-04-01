/*
  # Rename users table to app_users

  1. Changes
    - Rename `users` table to `app_users` to avoid conflict with Supabase's built-in auth.users table
    - Migrate all data
    - Update indexes and policies

  2. Indexes
    - Renamed indexes for new table name

  3. Security
    - RLS policies applied to new table
*/

ALTER TABLE IF EXISTS users RENAME TO app_users;

ALTER INDEX IF EXISTS users_organization_id_idx RENAME TO app_users_organization_id_idx;
ALTER INDEX IF EXISTS users_username_idx RENAME TO app_users_username_idx;

DROP POLICY IF EXISTS "Authenticated users can read all users" ON app_users;
DROP POLICY IF EXISTS "Authenticated users can insert users" ON app_users;
DROP POLICY IF EXISTS "Authenticated users can update users" ON app_users;
DROP POLICY IF EXISTS "Authenticated users can delete users" ON app_users;

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all users"
  ON app_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON app_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
  ON app_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users"
  ON app_users FOR DELETE
  TO authenticated
  USING (true);
