import { Edit2, Trash2, Zap, Copy } from 'lucide-react';
import { Application } from '../services/applicationDB';

interface ApplicationListProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onDesign: (app: Application) => void;
}

export default function ApplicationList({
  applications,
  onEdit,
  onDelete,
  onDesign,
}: ApplicationListProps) {
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

  const getTemplateLabel = (templateType?: string) => {
    switch (templateType) {
      case 'MES':
        return 'MES';
      case 'QMS':
        return 'QMS';
      default:
        return '-';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Copy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">暂无应用，请新增一个应用</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">名称</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">类型</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">模版/地址</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">备注</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                  {app.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{app.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(app.type)}`}>
                    {getTypeLabel(app.type)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {app.type === 'external' && (
                    <a
                      href={app.deployment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block"
                    >
                      {app.deployment_url}
                    </a>
                  )}
                  {app.type === 'internal_template' && getTemplateLabel(app.template_type)}
                  {app.type === 'internal_custom' && '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                  {app.remark || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {app.type === 'internal_custom' && (
                      <button
                        onClick={() => onDesign(app)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="设计"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(app)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确定要删除此应用吗？')) {
                          onDelete(app.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
