import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { User } from '../services/userDB';

interface UserFormProps {
  user: User | null;
  organizationId: string | null;
  organizationName: string;
  onSubmit: (data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'password_hash'>) => void;
  onCancel: () => void;
}

export default function UserForm({ user, organizationId, organizationName, onSubmit, onCancel }: UserFormProps) {
  const [username, setUsername] = useState(user?.username || '');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [roles, setRoles] = useState<string[]>(user?.roles || []);
  const [isOrgLeader, setIsOrgLeader] = useState(user?.is_org_leader || false);
  const [newRole, setNewRole] = useState('');
  const [errors, setErrors] = useState({ username: '', nickname: '' });

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setNickname(user.nickname);
      setPhone(user.phone);
      setEmail(user.email);
      setRoles(user.roles);
      setIsOrgLeader(user.is_org_leader);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = { username: '', nickname: '' };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = '用户名不能为空';
      isValid = false;
    }

    if (!nickname.trim()) {
      newErrors.nickname = '姓名不能为空';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setRoles(roles.filter(r => r !== role));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      username: username.trim(),
      nickname: nickname.trim(),
      phone: phone.trim(),
      email: email.trim(),
      roles,
      organization_id: organizationId,
      is_org_leader: isOrgLeader,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {user ? '编辑用户' : '新增用户'}
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
              所属组织
            </label>
            <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
              {organizationName}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              用户名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: '' });
              }}
              placeholder="请输入用户名"
              disabled={!!user}
              className={`w-full px-4 py-2 border ${
                errors.username ? 'border-red-500' : 'border-slate-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                user ? 'bg-slate-50 cursor-not-allowed' : ''
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              姓名（昵称） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (errors.nickname) setErrors({ ...errors, nickname: '' });
              }}
              placeholder="请输入姓名"
              className={`w-full px-4 py-2 border ${
                errors.nickname ? 'border-red-500' : 'border-slate-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            {errors.nickname && (
              <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              手机号
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              角色
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
                placeholder="输入角色名称后按回车"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="hover:text-blue-900 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOrgLeader}
                onChange={(e) => setIsOrgLeader(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">组织负责人</span>
            </label>
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
              {user ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
