/*
  # Create role and permissions management tables

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Role name
      - `description` (text) - Role description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `operations` (permission operations tree)
      - `id` (uuid, primary key)
      - `name` (text, unique) - Operation name
      - `description` (text) - Operation description
      - `parent_id` (uuid, nullable) - Parent operation for tree structure
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz)

    - `permission_applications`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Application name
      - `description` (text)
      - `created_at` (timestamptz)

    - `role_operation_permissions`
      - `id` (uuid, primary key)
      - `role_id` (uuid, foreign key)
      - `operation_id` (uuid, foreign key)
      - `created_at` (timestamptz)

    - `role_application_permissions`
      - `id` (uuid, primary key)
      - `role_id` (uuid, foreign key)
      - `app_id` (uuid, foreign key to permission_applications)
      - `created_at` (timestamptz)

    - `role_data_permissions`
      - `id` (uuid, primary key)
      - `role_id` (uuid, foreign key)
      - `data_scope` (text) - 'self', 'all', 'organization'
      - `created_at` (timestamptz)

    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to app_users.id)
      - `role_id` (uuid, foreign key)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies allowing CRUD operations
*/

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES operations(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permission_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_operation_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  operation_id uuid NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, operation_id)
);

CREATE TABLE IF NOT EXISTS role_application_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES permission_applications(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, app_id)
);

CREATE TABLE IF NOT EXISTS role_data_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  data_scope text NOT NULL CHECK (data_scope IN ('self', 'all', 'organization')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_operation_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_application_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_data_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles
CREATE POLICY "Allow read roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Allow create roles" ON roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update roles" ON roles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete roles" ON roles FOR DELETE USING (true);

-- RLS Policies for operations
CREATE POLICY "Allow read operations" ON operations FOR SELECT USING (true);
CREATE POLICY "Allow create operations" ON operations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update operations" ON operations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete operations" ON operations FOR DELETE USING (true);

-- RLS Policies for permission_applications
CREATE POLICY "Allow read permission_applications" ON permission_applications FOR SELECT USING (true);
CREATE POLICY "Allow create permission_applications" ON permission_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update permission_applications" ON permission_applications FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete permission_applications" ON permission_applications FOR DELETE USING (true);

-- RLS Policies for role_operation_permissions
CREATE POLICY "Allow read role_operation_permissions" ON role_operation_permissions FOR SELECT USING (true);
CREATE POLICY "Allow create role_operation_permissions" ON role_operation_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete role_operation_permissions" ON role_operation_permissions FOR DELETE USING (true);

-- RLS Policies for role_application_permissions
CREATE POLICY "Allow read role_application_permissions" ON role_application_permissions FOR SELECT USING (true);
CREATE POLICY "Allow create role_application_permissions" ON role_application_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete role_application_permissions" ON role_application_permissions FOR DELETE USING (true);

-- RLS Policies for role_data_permissions
CREATE POLICY "Allow read role_data_permissions" ON role_data_permissions FOR SELECT USING (true);
CREATE POLICY "Allow create role_data_permissions" ON role_data_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update role_data_permissions" ON role_data_permissions FOR UPDATE USING (true) WITH CHECK (true);

-- RLS Policies for user_roles
CREATE POLICY "Allow read user_roles" ON user_roles FOR SELECT USING (true);
CREATE POLICY "Allow create user_roles" ON user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete user_roles" ON user_roles FOR DELETE USING (true);
