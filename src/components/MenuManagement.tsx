import { useState, useEffect } from 'react';
import { Eye, EyeOff, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { MENU_REGISTRY, getMenuVisibilityMap, upsertMenuSetting, MenuItemDef } from '../services/menuSettingsDB';

interface GroupedMenus {
  [parentKey: string]: {
    label: string;
    items: MenuItemDef[];
  };
}

export default function MenuManagement() {
  const [visibilityMap, setVisibilityMap] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const map = await getMenuVisibilityMap();
    setVisibilityMap(map);
    // Expand all groups by default
    const groups = new Set<string>();
    MENU_REGISTRY.forEach(item => groups.add(item.parentKey));
    setExpandedGroups(groups);
    setIsLoading(false);
  };

  const groupedMenus: GroupedMenus = {};
  MENU_REGISTRY.forEach(item => {
    if (!groupedMenus[item.parentKey]) {
      groupedMenus[item.parentKey] = {
        label: item.parentLabel,
        items: [],
      };
    }
    groupedMenus[item.parentKey].items.push(item);
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleVisibility = async (menuKey: string) => {
    const current = visibilityMap.get(menuKey) ?? true;
    const next = !current;
    setSavingKey(menuKey);
    setVisibilityMap(prev => {
      const nextMap = new Map(prev);
      nextMap.set(menuKey, next);
      return nextMap;
    });

    await upsertMenuSetting(menuKey, next);
    setSavingKey(null);
  };

  const resetAll = async () => {
    if (!window.confirm('确定要重置所有菜单为显示状态吗？')) return;
    setIsLoading(true);
    for (const item of MENU_REGISTRY) {
      await upsertMenuSetting(item.key, true);
    }
    const map = await getMenuVisibilityMap();
    setVisibilityMap(map);
    setIsLoading(false);
  };

  const getVisibleCount = (parentKey: string) => {
    const items = groupedMenus[parentKey]?.items || [];
    return items.filter(item => visibilityMap.get(item.key) !== false).length;
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-500">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">菜单管理</h1>
            <p className="text-slate-500 mt-1">设置工作台侧边栏菜单的显示与隐藏</p>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            重置全部
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(groupedMenus).map(([parentKey, group]) => {
            const isExpanded = expandedGroups.has(parentKey);
            const visibleCount = getVisibleCount(parentKey);
            const totalCount = group.items.length;

            return (
              <div
                key={parentKey}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleGroup(parentKey)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                    <span className="font-semibold text-slate-800">{group.label}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {visibleCount}/{totalCount} 显示
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100">
                    {group.items.map((item) => {
                      const isVisible = visibilityMap.get(item.key) !== false;
                      const isSaving = savingKey === item.key;

                      return (
                        <div
                          key={item.key}
                          className={`flex items-center justify-between px-5 py-3.5 border-b border-slate-50 last:border-b-0 transition-colors ${
                            !isVisible ? 'bg-slate-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full transition-colors ${
                                isVisible ? 'bg-emerald-400' : 'bg-slate-300'
                              }`}
                            />
                            <span
                              className={`font-medium transition-colors ${
                                isVisible ? 'text-slate-700' : 'text-slate-400'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleVisibility(item.key)}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                              isVisible
                                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isVisible ? (
                              <>
                                <Eye className="w-4 h-4" />
                                显示
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4" />
                                隐藏
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            隐藏的菜单不会从系统中删除，只是不在侧边栏中显示。您可以随时通过菜单管理重新显示它们。
          </p>
        </div>
      </div>
    </div>
  );
}
