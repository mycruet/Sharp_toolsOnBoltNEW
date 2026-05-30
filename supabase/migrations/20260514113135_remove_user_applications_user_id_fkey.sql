/*
  # Remove foreign key constraint on user_applications.user_id

  1. Changes
    - Drop the foreign key constraint `user_applications_user_id_fkey`
      that references `auth.users`
    - This allows the mock auth system to work during development
      without requiring real Supabase Auth users

  2. Important Notes
    - When real Supabase Auth is integrated, this constraint can be re-added
    - The user_id column remains as uuid type for type safety
    - RLS policies still control data access
*/

ALTER TABLE user_applications
  DROP CONSTRAINT IF EXISTS user_applications_user_id_fkey;
