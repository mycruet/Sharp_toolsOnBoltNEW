import { useState } from 'react';
import { MessageSquare, CheckSquare, Send, LayoutGrid, Zap } from 'lucide-react';
import ComingSoon from './ComingSoon';

const DashboardOverview = () => {
  const quickStats = [
    {
      icon: Zap,
      title: '实时数据',
      value: '1,234',
      unit: '个设备',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CheckSquare,
      title: '今日任务',
      value: '42',
      unit: '个待处理',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">欢迎回来</h1>
        <p className="text-slate-600">
          这是您的物联数智化赋能平台工作台
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-slate-100"
            >
              <div
                className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg w-fit mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </span>
                <span className="text-slate-500 text-sm mb-1">
                  {stat.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            最近活动
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium">
                    设备数据更新 #{item}
                  </p>
                  <p className="text-slate-500 text-sm">
                    2小时前 • 智能传感器组
                  </p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  同步中
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            快速导航
          </h2>
          <div className="space-y-3">
            {[
              '应用列表',
              '设备管理',
              '数据分析',
              '用户管理',
              '系统日志',
              '帮助文档',
            ].map((nav, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {nav}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [activeSubmenu, setActiveSubmenu] = useState('概览');

  const submenuItems = [
    { label: '我的消息', icon: MessageSquare, key: 'messages' },
    { label: '我的待办', icon: CheckSquare, key: 'todos' },
    { label: '我的发起', icon: Send, key: 'initiated' },
    { label: '我的看板', icon: LayoutGrid, key: 'board' },
    { label: '我的应用', icon: Zap, key: 'applications' },
  ];

  const renderContent = () => {
    switch (activeSubmenu) {
      case '概览':
        return <DashboardOverview />;
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
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">工作台</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSubmenu('概览')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 ${
                activeSubmenu === '概览'
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              概览
            </button>
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
