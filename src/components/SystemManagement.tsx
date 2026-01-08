import { useState } from 'react';
import { BookOpen, Menu as MenuIcon } from 'lucide-react';
import ComingSoon from './ComingSoon';

export default function SystemManagement() {
  const [activeSubmenu, setActiveSubmenu] = useState('dictionary');

  const submenuItems = [
    { label: '字典管理', icon: BookOpen, key: 'dictionary' },
    { label: '菜单管理', icon: MenuIcon, key: 'menu' },
  ];

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'dictionary':
        return <ComingSoon title="字典管理待上线" />;
      case 'menu':
        return <ComingSoon title="菜单管理待上线" />;
      default:
        return <ComingSoon title="字典管理待上线" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">系统管理</h2>
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
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
