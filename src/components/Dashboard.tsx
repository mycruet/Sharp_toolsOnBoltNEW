import { Zap, BarChart3, Settings, Package } from 'lucide-react';

export default function Dashboard() {
  const quickStats = [
    {
      icon: Zap,
      title: '实时数据',
      value: '1,234',
      unit: '个设备',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BarChart3,
      title: '今日任务',
      value: '42',
      unit: '个待处理',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Settings,
      title: '系统状态',
      value: '99.8%',
      unit: '可用率',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Package,
      title: '应用数量',
      value: '8',
      unit: '个已部署',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">欢迎回来</h1>
          <p className="text-slate-600">
            这是您的物联数智化赋能平台工作台
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
    </div>
  );
}
