import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface OperationLog {
  id: string;
  ip_address: string;
  application_name: string;
  operator: string;
  operation_time: string;
  operation_record?: string;
  created_at?: string;
}

export interface OperationLogsFilter {
  ip_address?: string;
  application_name?: string;
  operator?: string;
  start_date?: string;
  end_date?: string;
}

export async function getOperationLogs(filter?: OperationLogsFilter): Promise<OperationLog[]> {
  let query = supabase.from('operation_logs').select('*');

  if (filter?.ip_address) {
    query = query.eq('ip_address', filter.ip_address);
  }
  if (filter?.application_name) {
    query = query.eq('application_name', filter.application_name);
  }
  if (filter?.operator) {
    query = query.eq('operator', filter.operator);
  }
  if (filter?.start_date && filter?.end_date) {
    query = query
      .gte('operation_time', filter.start_date)
      .lte('operation_time', filter.end_date);
  }

  query = query.order('operation_time', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('获取操作日志失败:', error);
    throw new Error('获取操作日志失败');
  }

  return data || [];
}

export async function getOperationLogById(id: string): Promise<OperationLog | null> {
  const { data, error } = await supabase
    .from('operation_logs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取操作日志详情失败:', error);
    throw new Error('获取操作日志详情失败');
  }

  return data;
}

export async function createOperationLog(log: Omit<OperationLog, 'id' | 'created_at'>): Promise<OperationLog> {
  const { data, error } = await supabase
    .from('operation_logs')
    .insert([log])
    .select()
    .single();

  if (error) {
    console.error('创建操作日志失败:', error);
    throw new Error('创建操作日志失败');
  }

  return data;
}

export async function updateOperationLog(id: string, updates: Partial<OperationLog>): Promise<OperationLog> {
  const { data, error } = await supabase
    .from('operation_logs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('更新操作日志失败:', error);
    throw new Error('更新操作日志失败');
  }

  return data;
}

export async function deleteOperationLog(id: string): Promise<void> {
  const { error } = await supabase
    .from('operation_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除操作日志失败:', error);
    throw new Error('删除操作日志失败');
  }
}
