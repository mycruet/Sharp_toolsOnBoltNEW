/*
  # Create user applications table

  1. New Tables
    - `user_applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `application_id` (text, reference to applications in IndexedDB)
      - `logo_name` (text, logo identifier from logo library)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_applications` table
    - Users can only view/manage their own applications
*/

CREATE TABLE IF NOT EXISTS user_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id text NOT NULL,
  logo_name text NOT NULL DEFAULT 'app',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_applications_user_id_idx ON user_applications(user_id);
CREATE INDEX IF NOT EXISTS user_applications_application_id_idx ON user_applications(application_id);

ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON user_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON user_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON user_applications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
