import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import ApplicationList from './ApplicationList';
import ApplicationForm from './ApplicationForm';
import NavigationTypeSelector from './NavigationTypeSelector';
import BusinessEntityTypeSelector from './BusinessEntityTypeSelector';
import ContentDesigner from './ContentDesigner';
import { Application, getApplications, createApplication, updateApplication, deleteApplication } from '../services/applicationDB';

type UIState = 'list' | 'form' | 'navigation' | 'entity' | 'designer';

export default function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [uiState, setUiState] = useState<UIState>('list');
  const [selectedApp, setSelectedApp] = useState<Application | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedNavigationType, setSelectedNavigationType] = useState<'none' | 'level_1' | 'level_2' | 'level_3' | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<'custom_form' | 'data_source' | 'business_rule' | 'custom_dashboard' | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const apps = await getApplications();
    setApplications(apps);
  };

  const handleCreate = async (data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newApp = await createApplication(data);
      setApplications([newApp, ...applications]);
      setUiState('list');
    } catch (error) {
      console.error('Failed to create application:', error);
      alert('创建应用失败');
    }
  };

  const handleUpdate = async (data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedApp) return;
    try {
      const updated = await updateApplication(selectedApp.id, data);
      setApplications(applications.map((app) => (app.id === updated.id ? updated : app)));
      setUiState('list');
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('更新应用失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      setApplications(applications.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('删除应用失败');
    }
  };

  const handleDesignClick = (app: Application) => {
    setSelectedApp(app);
    setUiState('navigation');
  };

  const handleNavigationSelect = (type: 'none' | 'level_1' | 'level_2' | 'level_3') => {
    setSelectedNavigationType(type);
    if (type === 'none') {
      setUiState('entity');
    } else {
      setUiState('designer');
    }
  };

  const handleEntitySelect = (type: 'custom_form' | 'data_source' | 'business_rule' | 'custom_dashboard') => {
    setSelectedEntityType(type);
    setUiState('designer');
  };

  const handleBackToList = () => {
    setUiState('list');
    setSelectedApp(undefined);
    setSelectedNavigationType(null);
    setSelectedEntityType(null);
  };

  if (uiState === 'designer' && selectedApp && selectedEntityType) {
    return (
      <ContentDesigner
        application={selectedApp}
        businessEntityType={selectedEntityType}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">应用管理</h1>
            <p className="text-slate-500 mt-1">管理外部应用、内部模版应用和自定义应用</p>
          </div>
          <button
            onClick={() => {
              setFormMode('create');
              setSelectedApp(undefined);
              setUiState('form');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            新增应用
          </button>
        </div>

        {uiState === 'list' && (
          <ApplicationList
            applications={applications}
            onEdit={(app) => {
              setFormMode('edit');
              setSelectedApp(app);
              setUiState('form');
            }}
            onDelete={handleDelete}
            onDesign={handleDesignClick}
          />
        )}

        {uiState === 'form' && (
          <ApplicationForm
            application={formMode === 'edit' ? selectedApp : undefined}
            onSubmit={formMode === 'edit' ? handleUpdate : handleCreate}
            onCancel={() => {
              setUiState('list');
              setSelectedApp(undefined);
            }}
          />
        )}

        {uiState === 'navigation' && (
          <NavigationTypeSelector
            onSelect={handleNavigationSelect}
            onCancel={handleBackToList}
          />
        )}

        {uiState === 'entity' && (
          <BusinessEntityTypeSelector
            onSelect={handleEntitySelect}
            onCancel={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}
