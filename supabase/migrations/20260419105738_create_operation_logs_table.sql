/*
  # Create operation_logs table

  1. New Tables
    - `operation_logs`
      - `id` (uuid, primary key)
      - `ip_address` (text) - IP address of the operation
      - `application_name` (text) - Name of the application
      - `operator` (text) - Person who performed the operation
      - `operation_time` (timestamptz) - Time when operation occurred
      - `operation_record` (text) - Detailed operation record/description
      - `created_at` (timestamptz) - Record creation time

  2. Security
    - Enable RLS on `operation_logs` table
    - Add policies to allow read, create, update, and delete operations for all users
*/

CREATE TABLE IF NOT EXISTS operation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  application_name text NOT NULL,
  operator text NOT NULL,
  operation_time timestamptz NOT NULL,
  operation_record text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read operation logs"
  ON operation_logs FOR SELECT
  USING (true);

CREATE POLICY "Allow create operation logs"
  ON operation_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update operation logs"
  ON operation_logs FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete operation logs"
  ON operation_logs FOR DELETE
  USING (true);
