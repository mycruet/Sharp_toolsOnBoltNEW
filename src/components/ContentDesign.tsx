import { useState } from 'react';
import { ChevronLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { Application, NavigationType, EntityType } from '../services/applicationDB';

interface ContentDesignProps {
  application: Application;
  navigationLevel: NavigationType;
  onSave: (app: Application) => void;
  onCancel: () => void;
}

interface DesignElement {
  id: string;
  type: 'section' | 'field' | 'widget';
  name: string;
  config: Record<string, any>;
}

export default function ContentDesign({
  application,
  navigationLevel,
  onSave,
  onCancel,
}: ContentDesignProps) {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [newElementName, setNewElementName] = useState('');
  const [newElementType, setNewElementType] = useState<'section' | 'field' | 'widget'>('section');

  const handleAddElement = () => {
    if (!newElementName.trim()) return;

    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: newElementType,
      name: newElementName,
      config: {},
    };

    setElements([...elements, newElement]);
    setNewElementName('');
  };

  const handleRemoveElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleSave = () => {
    const updatedApp: Application = {
      ...application,
      designData: {
        navigationLevel,
        selectedEntity: application.designData?.selectedEntity,
        contentData: {
          elements,
          timestamp: Date.now(),
        },
      },
    };
    onSave(updatedApp);
  };

  const entityLabel = {
    form: '自定义表单',
    datasource: '数据源',
    rule: '业务规则',
    dashboard: '自定义看板',
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">应用设计 - {application.name}</h1>
          <p className="text-slate-600 mt-2">
            第3步：内容设计 ({entityLabel[application.designData?.selectedEntity as EntityType] || '未知'})
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            导航类型: <strong>无导航</strong> | 业务实体: <strong>{entityLabel[application.designData?.selectedEntity as EntityType]}</strong>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">添加元素</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    元素类型
                  </label>
                  <select
                    value={newElementType}
                    onChange={(e) => setNewElementType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="section">区域</option>
                    <option value="field">字段</option>
                    <option value="widget">组件</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    元素名称
                  </label>
                  <input
                    type="text"
                    value={newElementName}
                    onChange={(e) => setNewElementName(e.target.value)}
                    placeholder="请输入元素名称"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleAddElement();
                    }}
                  />
                </div>

                <button
                  onClick={handleAddElement}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  添加元素
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">设计预览</h2>

              {elements.length === 0 ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
                  <p className="text-slate-500">尚未添加任何元素，请在左侧添加</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {elements.map((element) => (
                    <div
                      key={element.id}
                      className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-700">
                            {element.type === 'section' ? '区域' : element.type === 'field' ? '字段' : '组件'}
                          </span>
                          <span className="font-medium text-slate-800">{element.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveElement(element.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            上一步
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            保存设计
          </button>
        </div>
      </div>
    </div>
  );
}
