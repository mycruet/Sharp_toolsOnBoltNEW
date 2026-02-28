import { X, List, Layers2, Layers3, LayoutList } from 'lucide-react';

interface NavigationTypeSelectorProps {
  onSelect: (type: 'none' | 'level_1' | 'level_2' | 'level_3') => void;
  onCancel: () => void;
}

export default function NavigationTypeSelector({ onSelect, onCancel }: NavigationTypeSelectorProps) {
  const options = [
    {
      id: 'none',
      icon: LayoutList,
      label: '无导航',
      description: '不使用导航菜单',
    },
    {
      id: 'level_1',
      icon: List,
      label: '1 级导航',
      description: '单层菜单结构',
    },
    {
      id: 'level_2',
      icon: Layers2,
      label: '2 级导航',
      description: '两层菜单结构',
    },
    {
      id: 'level_3',
      icon: Layers3,
      label: '3 级导航',
      description: '三层菜单结构',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">选择导航类型</h2>
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
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                    <Icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <div>
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
