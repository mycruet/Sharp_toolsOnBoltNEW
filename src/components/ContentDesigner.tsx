import { ChevronLeft, Layout, Database, GitBranch, BarChart3 } from 'lucide-react';
import { Application } from '../services/applicationDB';

interface ContentDesignerProps {
  application: Application;
  businessEntityType: 'custom_form' | 'data_source' | 'business_rule' | 'custom_dashboard';
  onBack: () => void;
}

export default function ContentDesigner({ application, businessEntityType, onBack }: ContentDesignerProps) {
  const getEntityConfig = () => {
    switch (businessEntityType) {
      case 'custom_form':
        return {
          icon: Layout,
          title: '自定义表单设计',
          description: '设计表单字段、布局和交互逻辑',
          color: 'blue',
        };
      case 'data_source':
        return {
          icon: Database,
          title: '数据源配置',
          description: '配置数据库连接、数据表和查询逻辑',
          color: 'green',
        };
      case 'business_rule':
        return {
          icon: GitBranch,
          title: '业务规则配置',
          description: '定义业务流程、验证规则和自动化逻辑',
          color: 'orange',
        };
      case 'custom_dashboard':
        return {
          icon: BarChart3,
          title: '自定义看板设计',
          description: '设计数据可视化图表和仪表板布局',
          color: 'purple',
        };
    }
  };

  const config = getEntityConfig();
  const Icon = config.icon;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      gradient: 'from-blue-500 to-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      gradient: 'from-green-500 to-green-600',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      gradient: 'from-orange-500 to-orange-600',
    },
    purple: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-700',
      gradient: 'from-slate-500 to-slate-600',
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          返回
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">内容设计</h1>
            <p className="text-sm text-slate-500">应用名称: {application.name}</p>
          </div>

          <div className={`border-2 ${colors.border} ${colors.bg} rounded-lg p-8 mb-8`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 bg-gradient-to-r ${colors.gradient} rounded-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${colors.text} mb-2`}>{config.title}</h2>
                <p className="text-slate-600">{config.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">设计区域</h3>
              <div className="space-y-4">
                <div className="bg-white border border-slate-300 rounded-lg p-4">
                  <p className="text-slate-600 text-center py-8">
                    此功能正在开发中，即将上线
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">属性配置</h3>
              <div className="bg-white border border-slate-300 rounded-lg p-4">
                <p className="text-slate-600 text-center py-8">
                  选择左侧元素以配置其属性
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
