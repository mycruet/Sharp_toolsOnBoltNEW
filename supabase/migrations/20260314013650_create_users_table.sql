/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Auto-generated user ID
      - `username` (text, unique) - User login name
      - `password_hash` (text) - Hashed password for authentication
      - `nickname` (text) - Display name/full name
      - `phone` (text) - Phone number
      - `email` (text) - Email address
      - `roles` (text array) - Multiple roles assigned to user
      - `organization_id` (text) - Reference to organization
      - `is_org_leader` (boolean) - Whether user is organization leader
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read all users
    - Add policy for authenticated users to insert users
    - Add policy for authenticated users to update users
    - Add policy for authenticated users to delete users

  3. Indexes
    - Index on organization_id for faster lookups
    - Index on username for authentication
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL DEFAULT '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  nickname text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  roles text[] DEFAULT ARRAY[]::text[],
  organization_id text,
  is_org_leader boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_organization_id_idx ON users(organization_id);
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (true);
