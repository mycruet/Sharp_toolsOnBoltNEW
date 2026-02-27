import { useState } from 'react';
import { X } from 'lucide-react';
import { Application, ApplicationType, TemplateType } from '../services/applicationDB';

interface ApplicationFormProps {
  application: Application | null;
  onSubmit: (data: Partial<Application>) => void;
  onCancel: () => void;
}

export default function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const [name, setName] = useState(application?.name || '');
  const [type, setType] = useState<ApplicationType>(application?.type || 'external');
  const [remark, setRemark] = useState(application?.remark || '');
  const [deploymentUrl, setDeploymentUrl] = useState(application?.deploymentUrl || '');
  const [template, setTemplate] = useState<TemplateType | ''>(application?.template || '');
  const [errors, setErrors] = useState({ name: '', deploymentUrl: '', template: '' });

  const validateForm = () => {
    const newErrors = { name: '', deploymentUrl: '', template: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = '应用名称不能为空';
      isValid = false;
    }

    if (type === 'external' && !deploymentUrl.trim()) {
      newErrors.deploymentUrl = '部署地址不能为空';
      isValid = false;
    }

    if (type === 'internal-template' && !template) {
      newErrors.template = '必须选择模板';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: Partial<Application> = {
      name,
      type,
      remark,
    };

    if (type === 'external') {
      data.deploymentUrl = deploymentUrl;
    }

    if (type === 'internal-template') {
      data.template = template as TemplateType;
    }

    onSubmit(data);
  };

  const typeLabels: Record<ApplicationType, string> = {
    'external': '外部',
    'internal-template': '内部（使用模板）',
    'internal-custom': '内部（自定义）',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {application ? '编辑应用' : '新增应用'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              应用名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="请输入应用名称"
              className={`w-full px-4 py-2 border ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              应用类型 <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as ApplicationType);
                setErrors({ ...errors, deploymentUrl: '', template: '' });
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {type === 'external' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                部署地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={deploymentUrl}
                onChange={(e) => {
                  setDeploymentUrl(e.target.value);
                  if (errors.deploymentUrl) setErrors({ ...errors, deploymentUrl: '' });
                }}
                placeholder="请输入部署地址，如: https://example.com"
                className={`w-full px-4 py-2 border ${
                  errors.deploymentUrl ? 'border-red-500' : 'border-slate-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
              {errors.deploymentUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.deploymentUrl}</p>
              )}
            </div>
          )}

          {type === 'internal-template' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                选择模板 <span className="text-red-500">*</span>
              </label>
              <select
                value={template}
                onChange={(e) => {
                  setTemplate(e.target.value as TemplateType);
                  if (errors.template) setErrors({ ...errors, template: '' });
                }}
                className={`w-full px-4 py-2 border ${
                  errors.template ? 'border-red-500' : 'border-slate-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              >
                <option value="">-- 请选择模板 --</option>
                <option value="mes">MES</option>
                <option value="qms">QMS</option>
              </select>
              {errors.template && (
                <p className="mt-1 text-sm text-red-500">{errors.template}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              备注
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请输入备注信息"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {application ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
