import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Application, getApplications } from '../services/applicationDB';

interface ApplicationSelectorProps {
  onSelect: (application: Application) => void;
  onClose: () => void;
  onLogoSelect?: () => void;
}

export default function ApplicationSelector({
  onSelect,
  onClose,
}: ApplicationSelectorProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'external' | 'internal_template' | 'internal_custom'>('all');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const apps = await getApplications();
      setApplications(apps);
    } catch (error) {
      console.error('加载应用失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'external':
        return '外部应用';
      case 'internal_template':
        return '内部模版';
      case 'internal_custom':
        return '内部自定义';
      default:
        return type;
    }
  };

  const handleSelectApp = (app: Application) => {
    setSelectedAppId(app.id);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">加载中...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">选择应用</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索应用..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'external', 'internal_template', 'internal_custom'] as const).map(
              type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? '全部' : getTypeLabel(type)}
                </button>
              )
            )}
          </div>

          {/* Applications List */}
          <div className="border border-slate-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {filteredApplications.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                暂无应用
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredApplications.map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app)}
                    className={`w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      selectedAppId === app.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{app.name}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        <span className="inline-block bg-slate-100 px-2 py-1 rounded text-xs mr-2">
                          {getTypeLabel(app.type)}
                        </span>
                        {app.remark && <span>{app.remark}</span>}
                      </div>
                    </div>
                    {selectedAppId === app.id && (
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={() => {
              const app = applications.find(a => a.id === selectedAppId);
              if (app) {
                onSelect(app);
              }
            }}
            disabled={!selectedAppId}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}
