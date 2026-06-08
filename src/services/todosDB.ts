import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  urgency: string;
  status: 'pending' | 'completed';
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface TodoInput {
  title: string;
  urgency: string;
  status?: 'pending' | 'completed';
  received_at?: string;
}

export async function getTodos(options?: {
  userId?: string;
  status?: 'pending' | 'completed' | 'all';
  urgency?: string;
  titleSearch?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Todo[]> {
  let query = supabase
    .from('todos')
    .select('*')
    .order('received_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.urgency) {
    query = query.eq('urgency', options.urgency);
  }

  if (options?.titleSearch) {
    query = query.ilike('title', `%${options.titleSearch}%`);
  }

  if (options?.startDate) {
    query = query.gte('received_at', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('received_at', options.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createTodo(userId: string, input: TodoInput): Promise<Todo> {
  const insertData = {
    user_id: userId,
    title: input.title,
    urgency: input.urgency,
    status: input.status || 'pending',
    received_at: input.received_at || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('todos')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('Create todo error:', error);
    throw error;
  }

  return data;
}

export async function updateTodo(id: string, input: Partial<TodoInput>): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTodos(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('todos')
    .delete()
    .in('id', ids);

  if (error) throw error;
}

export async function getPendingCount(userId?: string): Promise<number> {
  let query = supabase
    .from('todos')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count || 0;
}

export function subscribeToPendingCount(userId: string | undefined, callback: (count: number) => void) {
  const channel = supabase
    .channel('todos-pending-count')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'todos',
        filter: userId ? `user_id=eq.${userId}` : undefined,
      },
      async () => {
        const count = await getPendingCount(userId);
        callback(count);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
