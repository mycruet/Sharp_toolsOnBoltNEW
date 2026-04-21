import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Operation {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  display_order: number;
  created_at?: string;
}

export interface PermissionApp {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface RoleDataPermission {
  id: string;
  role_id: string;
  data_scope: 'self' | 'all' | 'organization';
  created_at?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at?: string;
}

// Roles
export async function getRoles(search?: string): Promise<Role[]> {
  let query = supabase.from('roles').select('*');

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('获取角色失败:', error);
    throw new Error('获取角色失败');
  }

  return data || [];
}

export async function getRoleById(id: string): Promise<Role | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取角色失败:', error);
    throw new Error('获取角色失败');
  }

  return data;
}

export async function createRole(role: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<Role> {
  const { data, error } = await supabase
    .from('roles')
    .insert([role])
    .select()
    .single();

  if (error) {
    console.error('创建角色失败:', error);
    throw new Error('创建角色失败');
  }

  return data;
}

export async function updateRole(id: string, updates: Partial<Role>): Promise<Role> {
  const { data, error } = await supabase
    .from('roles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('更新角色失败:', error);
    throw new Error('更新角色失败');
  }

  return data;
}

export async function deleteRole(id: string): Promise<void> {
  const { error } = await supabase.from('roles').delete().eq('id', id);

  if (error) {
    console.error('删除角色失败:', error);
    throw new Error('删除角色失败');
  }
}

// Operations
export async function getOperations(): Promise<Operation[]> {
  const { data, error } = await supabase
    .from('operations')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('获取操作列表失败:', error);
    throw new Error('获取操作列表失败');
  }

  return data || [];
}

export async function createOperation(op: Omit<Operation, 'id' | 'created_at'>): Promise<Operation> {
  const { data, error } = await supabase
    .from('operations')
    .insert([op])
    .select()
    .single();

  if (error) {
    console.error('创建操作失败:', error);
    throw new Error('创建操作失败');
  }

  return data;
}

// Permission Applications
export async function getPermissionApps(): Promise<PermissionApp[]> {
  const { data, error } = await supabase
    .from('permission_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取应用列表失败:', error);
    throw new Error('获取应用列表失败');
  }

  return data || [];
}

export async function createPermissionApp(app: Omit<PermissionApp, 'id' | 'created_at'>): Promise<PermissionApp> {
  const { data, error } = await supabase
    .from('permission_applications')
    .insert([app])
    .select()
    .single();

  if (error) {
    console.error('创建应用失败:', error);
    throw new Error('创建应用失败');
  }

  return data;
}

// Role Operation Permissions
export async function getRoleOperationPermissions(roleId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('role_operation_permissions')
    .select('operation_id')
    .eq('role_id', roleId);

  if (error) {
    console.error('获取操作权限失败:', error);
    throw new Error('获取操作权限失败');
  }

  return data?.map(item => item.operation_id) || [];
}

export async function setRoleOperationPermissions(roleId: string, operationIds: string[]): Promise<void> {
  // Delete existing permissions
  const { error: deleteError } = await supabase
    .from('role_operation_permissions')
    .delete()
    .eq('role_id', roleId);

  if (deleteError) {
    console.error('删除操作权限失败:', deleteError);
    throw new Error('删除操作权限失败');
  }

  // Insert new permissions
  if (operationIds.length > 0) {
    const { error: insertError } = await supabase
      .from('role_operation_permissions')
      .insert(operationIds.map(opId => ({ role_id: roleId, operation_id: opId })));

    if (insertError) {
      console.error('设置操作权限失败:', insertError);
      throw new Error('设置操作权限失败');
    }
  }
}

// Role Application Permissions
export async function getRoleApplicationPermissions(roleId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('role_application_permissions')
    .select('app_id')
    .eq('role_id', roleId);

  if (error) {
    console.error('获取应用权限失败:', error);
    throw new Error('获取应用权限失败');
  }

  return data?.map(item => item.app_id) || [];
}

export async function setRoleApplicationPermissions(roleId: string, appIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('role_application_permissions')
    .delete()
    .eq('role_id', roleId);

  if (deleteError) {
    console.error('删除应用权限失败:', deleteError);
    throw new Error('删除应用权限失败');
  }

  if (appIds.length > 0) {
    const { error: insertError } = await supabase
      .from('role_application_permissions')
      .insert(appIds.map(appId => ({ role_id: roleId, app_id: appId })));

    if (insertError) {
      console.error('设置应用权限失败:', insertError);
      throw new Error('设置应用权限失败');
    }
  }
}

// Role Data Permissions
export async function getRoleDataPermission(roleId: string): Promise<RoleDataPermission | null> {
  const { data, error } = await supabase
    .from('role_data_permissions')
    .select('*')
    .eq('role_id', roleId)
    .maybeSingle();

  if (error) {
    console.error('获取数据权限失败:', error);
    throw new Error('获取数据权限失败');
  }

  return data;
}

export async function setRoleDataPermission(roleId: string, dataScope: 'self' | 'all' | 'organization'): Promise<void> {
  const existing = await getRoleDataPermission(roleId);

  if (existing) {
    const { error } = await supabase
      .from('role_data_permissions')
      .update({ data_scope: dataScope })
      .eq('role_id', roleId);

    if (error) {
      console.error('更新数据权限失败:', error);
      throw new Error('更新数据权限失败');
    }
  } else {
    const { error } = await supabase
      .from('role_data_permissions')
      .insert([{ role_id: roleId, data_scope: dataScope }]);

    if (error) {
      console.error('创建数据权限失败:', error);
      throw new Error('创建数据权限失败');
    }
  }
}

// User Roles
export async function getUserRoles(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId);

  if (error) {
    console.error('获取用户角色失败:', error);
    throw new Error('获取用户角色失败');
  }

  return data?.map(item => item.role_id) || [];
}

export async function getRoleUsers(roleId: string): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('role_id', roleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取角色用户失败:', error);
    throw new Error('获取角色用户失败');
  }

  return data || [];
}

export async function addUserToRole(userId: string, roleId: string): Promise<void> {
  const { error } = await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role_id: roleId }]);

  if (error && !error.message.includes('duplicate')) {
    console.error('添加用户到角色失败:', error);
    throw new Error('添加用户到角色失败');
  }
}

export async function removeUserFromRole(userId: string, roleId: string): Promise<void> {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role_id', roleId);

  if (error) {
    console.error('从角色移除用户失败:', error);
    throw new Error('从角色移除用户失败');
  }
}

export async function setUserRoles(userId: string, roleIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    console.error('删除用户角色失败:', deleteError);
    throw new Error('删除用户角色失败');
  }

  if (roleIds.length > 0) {
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert(roleIds.map(roleId => ({ user_id: userId, role_id: roleId })));

    if (insertError) {
      console.error('设置用户角色失败:', insertError);
      throw new Error('设置用户角色失败');
    }
  }
}
