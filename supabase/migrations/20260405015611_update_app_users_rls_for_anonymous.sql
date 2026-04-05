/*
  # Update app_users RLS to allow anonymous access

  1. Changes
    - Drop existing RLS policies
    - Create new policies that allow both authenticated and anonymous users
    - This allows the application to work without Supabase Auth integration

  2. Security Notes
    - Policies allow all users (authenticated or anonymous) to perform CRUD operations
    - In a production system, proper authentication should be implemented
    - Current setup prioritizes functionality over strict security
*/

DROP POLICY IF EXISTS "Allow authenticated users to read all users" ON app_users;
DROP POLICY IF EXISTS "Allow authenticated users to create users" ON app_users;
DROP POLICY IF EXISTS "Allow authenticated users to update users" ON app_users;
DROP POLICY IF EXISTS "Allow authenticated users to delete users" ON app_users;

-- Keep RLS enabled but allow all access
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all users"
  ON app_users FOR SELECT
  USING (true);

CREATE POLICY "Allow create users"
  ON app_users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update users"
  ON app_users FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete users"
  ON app_users FOR DELETE
  USING (true);
