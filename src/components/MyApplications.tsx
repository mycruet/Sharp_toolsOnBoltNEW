import { useState, useEffect } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
import { UserApplication, getUserApplications, addUserApplication, removeUserApplication } from '../services/userApplicationsDB';
import { Application, getApplications } from '../services/applicationDB';
import LogoSelector, { getLogoByName } from './LogoSelector';
import ApplicationSelector from './ApplicationSelector';
import { useAuth } from '../hooks/useAuth';

export default function MyApplications() {
  const { user } = useAuth();
  const [userApps, setUserApps] = useState<UserApplication[]>([]);
  const [applications, setApplications] = useState<Map<string, Application>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [showFlow, setShowFlow] = useState<'none' | 'app-select' | 'logo-select'>('none');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userAppsList, appsList] = await Promise.all([
        getUserApplications(user!.id).catch(() => []),
        getApplications().catch(() => []),
      ]);

      setUserApps(userAppsList || []);

      const appsMap = new Map<string, Application>();
      (appsList || []).forEach(app => {
        appsMap.set(app.id, app);
      });
      setApplications(appsMap);
    } catch (error) {
      console.error('加载数据失败:', error);
      setUserApps([]);
      setApplications(new Map());
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApplication = () => {
    setShowFlow('app-select');
  };

  const handleAppSelected = (app: Application) => {
    setSelectedApp(app);
    setShowFlow('logo-select');
  };

  const handleLogoSelected = async (logoName: string) => {
    if (!selectedApp || !user?.id) return;

    try {
      const userApp = await addUserApplication(user.id, selectedApp.id, logoName);
      setUserApps([...userApps, userApp]);
      setShowFlow('none');
      setSelectedApp(null);
    } catch (error) {
      console.error('添加应用失败:', error);
      alert('添加应用失败');
    }
  };

  const handleRemoveApp = async (id: string) => {
    if (window.confirm('确定删除该应用吗？')) {
      try {
        await removeUserApplication(id);
        setUserApps(userApps.filter(app => app.id !== id));
      } catch (error) {
        console.error('删除应用失败:', error);
        alert('删除应用失败');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-500">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">我的应用</h1>
            <p className="text-slate-500 mt-1">快速访问您的应用程序</p>
          </div>
          <button
            onClick={handleAddApplication}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            添加应用
          </button>
        </div>

        {userApps.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium mb-4">暂无应用</p>
            <p className="text-slate-400 text-sm mb-6">点击"添加应用"开始使用</p>
            <button
              onClick={handleAddApplication}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加应用
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userApps.map(userApp => {
              const app = applications.get(userApp.application_id);
              return (
                <div
                  key={userApp.id}
                  className="bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                          {getLogoByName(userApp.logo_name)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveApp(userApp.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {app && (
                      <>
                        <div className="mb-2">
                          <div className="font-semibold text-slate-800 truncate">
                            {app.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono truncate">
                            {userApp.application_id.slice(0, 8)}...
                          </div>
                        </div>

                        {app.remark && (
                          <div className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {app.remark}
                          </div>
                        )}

                        <div className="inline-block text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {app.type === 'external' && '外部应用'}
                          {app.type === 'internal_template' && '内部模版'}
                          {app.type === 'internal_custom' && '内部自定义'}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add button card */}
            <button
              onClick={handleAddApplication}
              className="bg-white rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 p-4 flex flex-col items-center justify-center min-h-[200px] group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-slate-600 group-hover:text-blue-600 font-medium transition-colors">
                添加应用
              </span>
            </button>
          </div>
        )}
      </div>

      {showFlow === 'app-select' && (
        <ApplicationSelector
          onSelect={handleAppSelected}
          onClose={() => setShowFlow('none')}
          onLogoSelect={() => {}}
        />
      )}

      {showFlow === 'logo-select' && (
        <LogoSelector
          onSelect={handleLogoSelected}
          onClose={() => {
            setShowFlow('none');
            setSelectedApp(null);
          }}
        />
      )}
    </div>
  );
}
