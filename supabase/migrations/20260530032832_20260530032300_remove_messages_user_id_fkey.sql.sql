/*
  # Remove messages user_id foreign key constraint

  1. Changes
    - Drop foreign key constraint on messages.user_id
    - This allows development with mock users that don't exist in auth.users
*/

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_user_id_fkey;