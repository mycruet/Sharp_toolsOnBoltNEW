import { Plus, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import ApplicationCard from './ApplicationCard';
import ApplicationSelector from './ApplicationSelector';
import { Application, getApplications } from '../services/applicationDB';
import { UserApplication, getUserApplications, addUserApplication, removeUserApplication } from '../services/userApplicationDB';

export default function MyApplications() {
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const apps = await getApplications();
      setAllApplications(apps);
      const userApps = await getUserApplications(apps);
      setUserApplications(userApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectApplication = async (app: Application) => {
    try {
      const newUserApp = await addUserApplication(app.id, app);
      setUserApplications([newUserApp, ...userApplications]);
      setShowSelector(false);
    } catch (error) {
      console.error('Failed to add application:', error);
      alert('添加应用失败');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await removeUserApplication(id);
      setUserApplications(userApplications.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('删除应用失败');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">我的应用</h2>
          <p className="text-slate-500 mt-1">管理你收藏的应用</p>
        </div>
        <button
          onClick={() => setShowSelector(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          添加应用
        </button>
      </div>

      {userApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">还没有添加应用</p>
          <button
            onClick={() => setShowSelector(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            添加第一个应用
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {userApplications.map((userApp) => (
            <ApplicationCard
              key={userApp.id}
              userApp={userApp}
              onDelete={handleDeleteApplication}
            />
          ))}
        </div>
      )}

      {showSelector && (
        <ApplicationSelector
          applications={allApplications}
          onSelect={handleSelectApplication}
          onCancel={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
