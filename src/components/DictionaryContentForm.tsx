import { useState } from 'react';
import { X } from 'lucide-react';
import { DictionaryContent } from '../services/indexedDB';

interface DictionaryContentFormProps {
  content: DictionaryContent | null;
  onSubmit: (data: { name: string; remark: string }) => void;
  onCancel: () => void;
}

export default function DictionaryContentForm({ content, onSubmit, onCancel }: DictionaryContentFormProps) {
  const [name, setName] = useState(content?.name || '');
  const [remark, setRemark] = useState(content?.remark || '');
  const [errors, setErrors] = useState({ name: '' });

  const validateForm = () => {
    const newErrors = { name: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = '内容名称不能为空';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({ name, remark });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {content ? '编辑字典内容' : '新增字典内容'}
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
              内容名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="请输入内容名称"
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
              {content ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
