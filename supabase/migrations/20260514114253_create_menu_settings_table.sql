/*
  # Create menu_settings table

  1. New Tables
    - `menu_settings`
      - `id` (uuid, primary key)
      - `menu_key` (text, unique) - identifier for the menu item, e.g. "dashboard.messages"
      - `is_visible` (boolean, default true) - whether the menu item is visible
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `menu_settings` table
    - Allow anon and authenticated users to read and manage menu settings
      (development mode - no real auth yet)

  3. Important Notes
    - menu_key format: "{parent}.{child}" e.g. "dashboard.messages", "system.dictionary"
    - When real auth is integrated, restrict write access to admin users
*/

CREATE TABLE IF NOT EXISTS menu_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_key text UNIQUE NOT NULL,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu settings"
  ON menu_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert menu settings"
  ON menu_settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update menu settings"
  ON menu_settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
