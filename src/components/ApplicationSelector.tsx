import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Application } from '../services/applicationDB';

interface ApplicationSelectorProps {
  applications: Application[];
  onSelect: (app: Application) => void;
  onCancel: () => void;
}

export default function ApplicationSelector({ applications, onSelect, onCancel }: ApplicationSelectorProps) {
  const [searchName, setSearchName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const types = [
    { value: 'external', label: '外部' },
    { value: 'internal_template', label: '内部（使用模版）' },
    { value: 'internal_custom', label: '内部（自定义）' },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesName = app.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesType = !selectedType || app.type === selectedType;
      return matchesName && matchesType;
    });
  }, [applications, searchName, selectedType]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'external':
        return '外部';
      case 'internal_template':
        return '内部（使用模版）';
      case 'internal_custom':
        return '内部（自定义）';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'external':
        return 'bg-blue-100 text-blue-800';
      case 'internal_template':
        return 'bg-green-100 text-green-800';
      case 'internal_custom':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold text-slate-800">选择应用</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4 border-b border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              应用名称
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入应用名称..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              应用类型
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                全部
              </button>
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">未找到匹配的应用</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onSelect(app)}
                  className="w-full text-left p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{app.remark || '无备注'}</p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getTypeColor(
                        app.type
                      )}`}
                    >
                      {getTypeLabel(app.type)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
