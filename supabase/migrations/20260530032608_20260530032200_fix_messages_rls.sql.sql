/*
  # Fix messages RLS for development

  1. Changes
    - Drop existing anon policy
    - Create proper anon policy with full access
*/

DROP POLICY IF EXISTS "Anonymous can access messages for dev" ON messages;

CREATE POLICY "Anonymous can access messages for dev"
  ON messages FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Also allow service role full access
CREATE POLICY "Service role can access all messages"
  ON messages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
