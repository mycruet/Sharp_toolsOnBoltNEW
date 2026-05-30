import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Message {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: 'unread' | 'read';
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface MessageInput {
  title: string;
  content: string;
  status?: 'unread' | 'read';
  received_at?: string;
}

export async function getMessages(options?: {
  userId?: string;
  status?: 'unread' | 'read' | 'all';
  titleSearch?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Message[]> {
  let query = supabase
    .from('messages')
    .select('*')
    .order('received_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
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

export async function getMessageById(id: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMessage(userId: string, input: MessageInput): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        user_id: userId,
        title: input.title,
        content: input.content,
        status: input.status || 'unread',
        received_at: input.received_at || new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMessage(id: string, input: Partial<MessageInput>): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteMessages(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .delete()
    .in('id', ids);

  if (error) throw error;
}

export async function markAsRead(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'read' })
    .in('id', ids);

  if (error) throw error;
}

export async function markAsUnread(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'unread' })
    .in('id', ids);

  if (error) throw error;
}

export async function getUnreadCount(userId?: string): Promise<number> {
  let query = supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'unread');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count || 0;
}

export function subscribeToUnreadCount(userId: string | undefined, callback: (count: number) => void) {
  const channel = supabase
    .channel('messages-unread-count')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: userId ? `user_id=eq.${userId}` : undefined,
      },
      async () => {
        const count = await getUnreadCount(userId);
        callback(count);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
