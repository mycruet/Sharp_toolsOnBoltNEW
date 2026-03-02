import { Trash2, ExternalLink, Layers, Box } from 'lucide-react';
import { UserApplication } from '../services/userApplicationDB';

interface ApplicationCardProps {
  userApp: UserApplication;
  onDelete: (id: string) => void;
}

export default function ApplicationCard({ userApp, onDelete }: ApplicationCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'external':
        return ExternalLink;
      case 'internal_template':
        return Layers;
      case 'internal_custom':
        return Box;
      default:
        return Box;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'external':
        return 'from-blue-500 to-blue-600';
      case 'internal_template':
        return 'from-green-500 to-green-600';
      case 'internal_custom':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'external':
        return '外部';
      case 'internal_template':
        return '模版';
      case 'internal_custom':
        return '自定义';
      default:
        return type;
    }
  };

  const IconComponent = getTypeIcon(userApp.application.type);
  const colorGradient = getTypeColor(userApp.application.type);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      <div className={`bg-gradient-to-br ${colorGradient} h-24 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors">
          {userApp.application.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {userApp.application.remark || '无备注'}
        </p>

        <div className="flex items-center justify-between">
          <span className="inline-block px-2 py-1 bg-slate-100 text-xs font-medium text-slate-700 rounded">
            {getTypeLabel(userApp.application.type)}
          </span>
          <button
            onClick={() => {
              if (confirm('确定要删除此应用吗？')) {
                onDelete(userApp.id);
              }
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
