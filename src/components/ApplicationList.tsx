import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Palette } from 'lucide-react';
import { Application, ApplicationType, getAllApplications, addApplication, updateApplication, deleteApplication } from '../services/applicationDB';
import ApplicationForm from './ApplicationForm';
import NavigationDesign from './NavigationDesign';

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [designingApp, setDesigningApp] = useState<Application | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApp = async (data: Partial<Application>) => {
    try {
      const newApp: Application = {
        id: Date.now().toString(),
        name: data.name!,
        type: data.type!,
        remark: data.remark || '',
        deploymentUrl: data.deploymentUrl,
        template: data.template,
        createdAt: Date.now(),
      };
      await addApplication(newApp);
      await loadApplications();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add application:', error);
    }
  };

  const handleUpdateApp = async (data: Partial<Application>) => {
    if (!editingApp) return;
    try {
      const updatedApp: Application = {
        ...editingApp,
        name: data.name!,
        type: data.type!,
        remark: data.remark || '',
        deploymentUrl: data.deploymentUrl,
        template: data.template,
      };
      await updateApplication(updatedApp);
      await loadApplications();
      setEditingApp(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm('确定要删除该应用吗？')) return;
    try {
      await deleteApplication(id);
      await loadApplications();
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  const handleSaveDesign = async (app: Application) => {
    try {
      await updateApplication(app);
      await loadApplications();
      setDesigningApp(null);
    } catch (error) {
      console.error('Failed to save design:', error);
    }
  };

  const getTypeLabel = (type: ApplicationType): string => {
    const labels: Record<ApplicationType, string> = {
      'external': '外部',
      'internal-template': '内部（使用模板）',
      'internal-custom': '内部（自定义）',
    };
    return labels[type];
  };

  const getTypeColor = (type: ApplicationType): string => {
    const colors: Record<ApplicationType, string> = {
      'external': 'bg-blue-50 text-blue-700 border-blue-200',
      'internal-template': 'bg-green-50 text-green-700 border-green-200',
      'internal-custom': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[type];
  };

  if (designingApp) {
    return (
      <NavigationDesign
        application={designingApp}
        onSave={handleSaveDesign}
        onCancel={() => setDesigningApp(null)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">应用管理</h1>
          <button
            onClick={() => {
              setEditingApp(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            新增应用
          </button>
        </div>

        {showForm && (
          <ApplicationForm
            application={editingApp}
            onSubmit={editingApp ? handleUpdateApp : handleAddApp}
            onCancel={() => {
              setShowForm(false);
              setEditingApp(null);
            }}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-500">加载中...</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-500">暂无应用数据，点击新增按钮添加</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">类型</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">备注</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">详情</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{app.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{app.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(app.type)}`}>
                        {getTypeLabel(app.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.remark || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {app.type === 'external' && app.deploymentUrl && (
                        <a
                          href={app.deploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {app.deploymentUrl}
                        </a>
                      )}
                      {app.type === 'internal-template' && app.template && (
                        <span className="text-slate-600">{app.template.toUpperCase()}</span>
                      )}
                      {app.type === 'internal-custom' && (
                        <span className="text-slate-500">自定义应用</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {app.type === 'internal-custom' && (
                          <button
                            onClick={() => setDesigningApp(app)}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                            title="设计"
                          >
                            <Palette className="w-3 h-3" />
                            设计
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingApp(app);
                            setShowForm(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteApp(app.id)}
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
