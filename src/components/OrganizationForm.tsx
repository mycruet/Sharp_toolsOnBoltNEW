import { useState } from 'react';
import { X } from 'lucide-react';
import { Organization } from '../services/organizationDB';

interface OrganizationFormProps {
  organization: Organization | null;
  parentName?: string;
  onSubmit: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}

export default function OrganizationForm({ organization, parentName, onSubmit, onCancel }: OrganizationFormProps) {
  const [name, setName] = useState(organization?.name || '');
  const [description, setDescription] = useState(organization?.description || '');
  const [errors, setErrors] = useState({ name: '' });

  const validateForm = () => {
    const newErrors = { name: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = '组织机构名称不能为空';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({ name, description });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {organization ? '编辑组织机构' : '新增组织机构'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {parentName && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                父节点
              </label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
                {parentName}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              组织机构名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="请输入组织机构名称"
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
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入描述信息"
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
              {organization ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
