import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  username: string;
  password_hash: string;
  nickname: string;
  phone: string;
  email: string;
  roles: string[];
  organization_id: string | null;
  is_org_leader: boolean;
  created_at: string;
  updated_at: string;
}

export async function getUsersByOrganizationId(organizationId: string | null): Promise<User[]> {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'password_hash'>): Promise<User> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('app_users')
    .insert([{
      ...user,
      password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      created_at: now,
      updated_at: now,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'created_at' | 'password_hash'>>): Promise<User> {
  const { data, error } = await supabase
    .from('app_users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase
    .from('app_users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function resetUserPassword(id: string): Promise<void> {
  const { error } = await supabase
    .from('app_users')
    .update({
      password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function setOrgLeader(id: string, isLeader: boolean): Promise<User> {
  const { data, error } = await supabase
    .from('app_users')
    .update({
      is_org_leader: isLeader,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
