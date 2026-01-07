import { useState } from 'react';
import { MessageSquare, CheckSquare, Send, LayoutGrid, Zap, Settings, ChevronLeft } from 'lucide-react';
import ComingSoon from './ComingSoon';

export default function Dashboard() {
  const [activeSubmenu, setActiveSubmenu] = useState('messages');
  const [activeCategory, setActiveCategory] = useState(null);

  const submenuItems = [
    { label: '我的消息', icon: MessageSquare, key: 'messages' },
    { label: '我的待办', icon: CheckSquare, key: 'todos' },
    { label: '我的发起', icon: Send, key: 'initiated' },
    { label: '我的看板', icon: LayoutGrid, key: 'board' },
    { label: '我的应用', icon: Zap, key: 'applications' },
  ];

  const systemMenuItems = [
    { label: '字典管理', key: 'dictionary' },
    { label: '菜单管理', key: 'menu' },
  ];

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
      case 'applications':
        return <ComingSoon title="我的应用待上线" />;
      case 'dictionary':
        return <ComingSoon title="字典管理待上线" />;
      case 'menu':
        return <ComingSoon title="菜单管理待上线" />;
      default:
        return <ComingSoon title="我的消息待上线" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            {activeCategory === 'system' && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-slate-800">
              {activeCategory === 'system' ? '系统管理' : '工作台'}
            </h2>
            {!activeCategory && <div className="w-5" />}
          </div>
          <nav className="space-y-2">
            {activeCategory === 'system' ? (
              systemMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSubmenu(item.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSubmenu === item.key
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))
            ) : (
              <>
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
                <button
                  onClick={() => {
                    setActiveCategory('system');
                    setActiveSubmenu(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 ${
                    activeCategory === 'system'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  系统管理
                </button>
              </>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
