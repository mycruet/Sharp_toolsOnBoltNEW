import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserApplication {
  id: string;
  user_id: string;
  application_id: string;
  logo_name: string;
  created_at: string;
}

export async function getUserApplications(userId: string): Promise<UserApplication[]> {
  const { data, error } = await supabase
    .from('user_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addUserApplication(
  userId: string,
  applicationId: string,
  logoName: string
): Promise<UserApplication> {
  const { data, error } = await supabase
    .from('user_applications')
    .insert([
      {
        user_id: userId,
        application_id: applicationId,
        logo_name: logoName,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeUserApplication(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_applications')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
