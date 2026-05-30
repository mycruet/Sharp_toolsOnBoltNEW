import { useState, useEffect } from 'react';
import { MessageSquare, CheckSquare, Send, LayoutGrid } from 'lucide-react';
import ComingSoon from './ComingSoon';
import { useMenuVisibility } from '../hooks/useMenuVisibility';

export default function Dashboard() {
  const [activeSubmenu, setActiveSubmenu] = useState('messages');
  const { isVisible } = useMenuVisibility();

  const allSubmenuItems = [
    { label: '我的消息', icon: MessageSquare, key: 'messages', menuKey: 'dashboard.messages' },
    { label: '我的待办', icon: CheckSquare, key: 'todos', menuKey: 'dashboard.todos' },
    { label: '我的发起', icon: Send, key: 'initiated', menuKey: 'dashboard.initiated' },
    { label: '我的看板', icon: LayoutGrid, key: 'board', menuKey: 'dashboard.board' },
  ];

  const submenuItems = allSubmenuItems.filter(item => isVisible(item.menuKey));

  useEffect(() => {
    if (submenuItems.length > 0 && !submenuItems.some(item => item.key === activeSubmenu)) {
      setActiveSubmenu(submenuItems[0].key);
    }
  }, [submenuItems.length]);

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'messages':
        return <ComingSoon title="我的消息待上线" />;
      case 'todos':
        return <ComingSoon title="我的待办待上线" />;
      case 'initiated':
        return <ComingSoon title="我的发起待上线" />;
      case 'board':
        return <ComingSoon title="我的看板待上线" />;
      default:
        return <ComingSoon title="我的消息待上线" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">工作台</h2>
          {submenuItems.length === 0 ? (
            <p className="text-sm text-slate-400">所有菜单已隐藏</p>
          ) : (
            <nav className="space-y-2">
              {submenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSubmenu(item.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 ${
                      activeSubmenu === item.key
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {submenuItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400">请在系统管理 - 菜单管理中显示菜单</p>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}
