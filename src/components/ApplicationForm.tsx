import { X } from 'lucide-react';
import { Application } from '../services/applicationDB';
import { useEffect, useState } from 'react';

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export default function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'external' as 'external' | 'internal_template' | 'internal_custom',
    remark: '',
    deployment_url: '',
    template_type: 'MES' as 'MES' | 'QMS',
  });

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name,
        type: application.type,
        remark: application.remark,
        deployment_url: application.deployment_url || '',
        template_type: application.template_type || 'MES',
      });
    }
  }, [application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('请输入应用名称');
      return;
    }

    const submitData: any = {
      name: formData.name.trim(),
      type: formData.type,
      remark: formData.remark.trim(),
    };

    if (formData.type === 'external') {
      if (!formData.deployment_url.trim()) {
        alert('请输入部署地址');
        return;
      }
      submitData.deployment_url = formData.deployment_url.trim();
    } else if (formData.type === 'internal_template') {
      submitData.template_type = formData.template_type;
    }

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {application ? '编辑应用' : '新增应用'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              应用名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入应用名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              应用类型 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!application}
            >
              <option value="external">外部</option>
              <option value="internal_template">内部（使用模版）</option>
              <option value="internal_custom">内部（自定义）</option>
            </select>
          </div>

          {formData.type === 'external' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                部署地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.deployment_url}
                onChange={(e) => setFormData({ ...formData, deployment_url: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          )}

          {formData.type === 'internal_template' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                选择模版 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.template_type}
                onChange={(e) => setFormData({ ...formData, template_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MES">MES (制造执行系统)</option>
                <option value="QMS">QMS (质量管理系统)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              备注
            </label>
            <textarea
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="输入备注信息"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {application ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
