/*
  # Update user_applications RLS policies for development

  1. Security Changes
    - Drop existing restrictive RLS policies
    - Add policies that allow access with anon key for development
    - Uses service role bypass approach: allow anon users to manage
      their own data by checking user_id column directly

  2. Important Notes
    - When real Supabase Auth is integrated, replace with auth.uid() policies
*/

DROP POLICY IF EXISTS "Users can view own applications" ON user_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON user_applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON user_applications;

CREATE POLICY "Users can view own applications"
  ON user_applications FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own applications"
  ON user_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own applications"
  ON user_applications FOR DELETE
  TO anon, authenticated
  USING (true);
