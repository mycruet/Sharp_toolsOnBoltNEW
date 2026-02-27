import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Application, NavigationType } from '../services/applicationDB';
import ContentDesign from './ContentDesign';

interface NavigationDesignProps {
  application: Application;
  onSave: (app: Application) => void;
  onCancel: () => void;
}

export default function NavigationDesign({ application, onSave, onCancel }: NavigationDesignProps) {
  const [step, setStep] = useState<'navigation' | 'entity' | 'content'>('navigation');
  const [navigationLevel, setNavigationLevel] = useState<NavigationType>(
    application.designData?.navigationLevel || 'none'
  );

  const navigationOptions: { value: NavigationType; label: string; description: string }[] = [
    { value: 'none', label: '无导航', description: '直接进入内容设计' },
    { value: 'level1', label: '1级导航', description: '单层导航结构' },
    { value: 'level2', label: '2级导航', description: '两层导航结构' },
    { value: 'level3', label: '3级导航', description: '三层导航结构' },
  ];

  const handleNavigationSelect = (navType: NavigationType) => {
    setNavigationLevel(navType);
    if (navType === 'none') {
      setStep('entity');
    } else {
      const updatedApp: Application = {
        ...application,
        designData: {
          navigationLevel: navType,
        },
      };
      onSave(updatedApp);
      onCancel();
    }
  };

  if (step === 'entity') {
    return (
      <EntityTypeSelection
        application={application}
        navigationLevel={navigationLevel}
        onSelectEntity={() => {
          setStep('content');
        }}
        onBack={() => setStep('navigation')}
      />
    );
  }

  if (step === 'content') {
    return (
      <ContentDesign
        application={application}
        navigationLevel={navigationLevel}
        onSave={onSave}
        onCancel={() => setStep('entity')}
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">应用设计 - {application.name}</h1>
          <p className="text-slate-600 mt-2">第1步：选择导航类型</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {navigationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleNavigationSelect(option.value)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                navigationLevel === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-300 bg-white hover:border-blue-400'
              }`}
            >
              <h3 className="text-lg font-bold text-slate-800">{option.label}</h3>
              <p className="text-sm text-slate-600 mt-2">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

interface EntityTypeSelectionProps {
  application: Application;
  navigationLevel: NavigationType;
  onSelectEntity: (entityType: string) => void;
  onBack: () => void;
}

function EntityTypeSelection({
  application,
  navigationLevel,
  onSelectEntity,
  onBack,
}: EntityTypeSelectionProps) {
  const entityOptions = [
    { value: 'form', label: '自定义表单', description: '创建数据输入表单' },
    { value: 'datasource', label: '数据源', description: '连接数据源' },
    { value: 'rule', label: '业务规则', description: '定义业务逻辑' },
    { value: 'dashboard', label: '自定义看板', description: '创建可视化仪表板' },
  ];

  const handleSelectEntity = (entityType: string) => {
    const updatedApp: Application = {
      ...application,
      designData: {
        navigationLevel,
        selectedEntity: entityType as any,
      },
    };
    onSelectEntity(entityType);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">应用设计 - {application.name}</h1>
          <p className="text-slate-600 mt-2">第2步：选择业务实体类型</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            已选择导航类型: <strong>无导航</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {entityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelectEntity(option.value)}
              className="p-6 rounded-lg border-2 border-slate-300 bg-white hover:border-blue-400 transition-all text-left"
            >
              <h3 className="text-lg font-bold text-slate-800">{option.label}</h3>
              <p className="text-sm text-slate-600 mt-2">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            上一步
          </button>
        </div>
      </div>
    </div>
  );
}
