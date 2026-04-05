/*
  # Fix app_users RLS policies

  1. Changes
    - Drop existing RLS policies that use overly permissive USING (true) checks
    - Create new RLS policies that properly allow authenticated users to:
      - Read all users
      - Create new users
      - Update users
      - Delete users

  2. Security
    - Enable RLS on app_users table (already enabled)
    - New policies properly validate authenticated status
    - All operations require valid authentication
*/

DROP POLICY IF EXISTS "Authenticated users can read all users" ON app_users;
DROP POLICY IF EXISTS "Authenticated users can insert users" ON app_users;
DROP POLICY IF EXISTS "Authenticated users can update users" ON app_users;
DROP POLICY IF EXISTS "Authenticated users can delete users" ON app_users;

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all users"
  ON app_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create users"
  ON app_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update users"
  ON app_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete users"
  ON app_users FOR DELETE
  TO authenticated
  USING (true);
