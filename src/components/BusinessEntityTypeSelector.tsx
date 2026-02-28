import { Layout, Database, GitBranch, BarChart3, X } from 'lucide-react';

interface BusinessEntityTypeSelectorProps {
  onSelect: (type: 'custom_form' | 'data_source' | 'business_rule' | 'custom_dashboard') => void;
  onCancel: () => void;
}

export default function BusinessEntityTypeSelector({ onSelect, onCancel }: BusinessEntityTypeSelectorProps) {
  const options = [
    {
      id: 'custom_form',
      icon: Layout,
      label: '自定义表单',
      description: '设计表单字段、布局和交互',
    },
    {
      id: 'data_source',
      icon: Database,
      label: '数据源',
      description: '配置数据库和数据查询',
    },
    {
      id: 'business_rule',
      icon: GitBranch,
      label: '业务规则',
      description: '定义业务流程和验证规则',
    },
    {
      id: 'custom_dashboard',
      icon: BarChart3,
      label: '自定义看板',
      description: '设计数据可视化图表',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">选择业务实体类型</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id as any)}
                className="group p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-slate-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                    <Icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {option.label}
                    </h3>
                    <p className="text-sm text-slate-500">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
