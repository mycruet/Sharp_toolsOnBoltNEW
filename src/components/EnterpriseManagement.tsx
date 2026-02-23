import { useState } from 'react';
import { Layers, Users, Lock, FileText } from 'lucide-react';
import ComingSoon from './ComingSoon';
import OrganizationManagement from './OrganizationManagement';

export default function EnterpriseManagement() {
  const [activeSubmenu, setActiveSubmenu] = useState('organization');

  const submenuItems = [
    { label: '组织机构', icon: Layers, key: 'organization' },
    { label: '用户管理', icon: Users, key: 'users' },
    { label: '权限管理', icon: Lock, key: 'permissions' },
    { label: '操作日志', icon: FileText, key: 'logs' },
  ];

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'organization':
        return <OrganizationManagement />;
      case 'users':
        return <ComingSoon title="用户管理待上线" />;
      case 'permissions':
        return <ComingSoon title="权限管理待上线" />;
      case 'logs':
        return <ComingSoon title="操作日志待上线" />;
      default:
        return <OrganizationManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">企业管理</h2>
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
