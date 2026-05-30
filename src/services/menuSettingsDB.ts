import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MenuSetting {
  id: string;
  menu_key: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemDef {
  key: string;
  label: string;
  parentKey: string;
  parentLabel: string;
}

export const MENU_REGISTRY: MenuItemDef[] = [
  // 水平菜单（顶部导航栏）
  { key: 'nav.dashboard', label: '工作台', parentKey: 'nav', parentLabel: '水平菜单' },
  { key: 'nav.app_management', label: '应用管理', parentKey: 'nav', parentLabel: '水平菜单' },
  { key: 'nav.enterprise', label: '企业管理', parentKey: 'nav', parentLabel: '水平菜单' },
  { key: 'nav.system', label: '系统管理', parentKey: 'nav', parentLabel: '水平菜单' },
  // 工作台
  { key: 'dashboard.messages', label: '我的消息', parentKey: 'dashboard', parentLabel: '工作台' },
  { key: 'dashboard.todos', label: '我的待办', parentKey: 'dashboard', parentLabel: '工作台' },
  { key: 'dashboard.initiated', label: '我的发起', parentKey: 'dashboard', parentLabel: '工作台' },
  { key: 'dashboard.board', label: '我的看板', parentKey: 'dashboard', parentLabel: '工作台' },
  { key: 'dashboard.applications', label: '我的应用', parentKey: 'dashboard', parentLabel: '工作台' },
  // 企业管理
  { key: 'enterprise.organization', label: '组织机构', parentKey: 'enterprise', parentLabel: '企业管理' },
  { key: 'enterprise.users', label: '用户管理', parentKey: 'enterprise', parentLabel: '企业管理' },
  { key: 'enterprise.permissions', label: '权限管理', parentKey: 'enterprise', parentLabel: '企业管理' },
  { key: 'enterprise.logs', label: '操作日志', parentKey: 'enterprise', parentLabel: '企业管理' },
  // 系统管理
  { key: 'system.dictionary', label: '字典管理', parentKey: 'system', parentLabel: '系统管理' },
  { key: 'system.menu', label: '菜单管理', parentKey: 'system', parentLabel: '系统管理' },
];

export async function getMenuSettings(): Promise<MenuSetting[]> {
  const { data, error } = await supabase
    .from('menu_settings')
    .select('*');

  if (error) {
    console.error('Failed to load menu settings:', error);
    return [];
  }
  return data || [];
}

export async function getMenuVisibilityMap(): Promise<Map<string, boolean>> {
  const settings = await getMenuSettings();
  const map = new Map<string, boolean>();
  // Default all to visible
  MENU_REGISTRY.forEach(item => {
    map.set(item.key, true);
  });
  // Apply saved settings
  settings.forEach(s => {
    map.set(s.menu_key, s.is_visible);
  });
  return map;
}

export async function upsertMenuSetting(menuKey: string, isVisible: boolean): Promise<MenuSetting | null> {
  const { data, error } = await supabase
    .from('menu_settings')
    .upsert(
      { menu_key: menuKey, is_visible: isVisible, updated_at: new Date().toISOString() },
      { onConflict: 'menu_key' }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('Failed to update menu setting:', error);
    return null;
  }
  return data;
}
