import { useState } from 'react';
import { X, Save, Lock, Eye, EyeOff } from 'lucide-react';

interface AccountData {
  accountName: string;
  nickname: string;
  phone: string;
  email: string;
  role: string;
  organization: string;
  createdDate: string;
}

interface AccountInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accountData?: AccountData;
}

export default function AccountInfoPanel({
  isOpen,
  onClose,
  accountData = {
    accountName: 'user123',
    nickname: '张三',
    phone: '13800138000',
    email: 'user@example.com',
    role: '系统管理员',
    organization: '技术部',
    createdDate: '2024-01-15',
  },
}: AccountInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    nickname: accountData.nickname,
    phone: accountData.phone,
    email: accountData.email,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    old: '',
    new: '',
    confirm: '',
  });
  const [saveMessage, setSaveMessage] = useState('');

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (passwordErrors[field as keyof typeof passwordErrors]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = { old: '', new: '', confirm: '' };
    let isValid = true;

    if (!passwordData.oldPassword.trim()) {
      errors.old = '请输入原密码';
      isValid = false;
    }

    if (!passwordData.newPassword.trim()) {
      errors.new = '请输入新密码';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.new = '密码长度至少6位';
      isValid = false;
    }

    if (!passwordData.confirmPassword.trim()) {
      errors.confirm = '请确认新密码';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirm = '两次输入的密码不一致';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleSaveInfo = () => {
    console.log('保存编辑的账号信息:', editData);
    setSaveMessage('账号信息已保存成功');
    setTimeout(() => setSaveMessage(''), 3000);
    setEditMode(false);
  };

  const handleChangePassword = () => {
    if (!validatePasswordForm()) {
      return;
    }

    console.log('密码修改请求:', {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    });
    setSaveMessage('密码修改成功');
    setTimeout(() => setSaveMessage(''), 3000);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">账号信息</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="flex gap-4 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-4 font-medium transition-colors duration-200 relative ${
                activeTab === 'info'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              账号信息
              {activeTab === 'info' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-4 font-medium transition-colors duration-200 relative flex items-center gap-2 ${
                activeTab === 'password'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              修改密码
              {activeTab === 'password' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
              )}
            </button>
          </div>

          {saveMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
              {saveMessage}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-6">
                  {editMode ? '编辑账号信息' : '账号信息查看'}
                </h3>

                {!editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          账号名称
                        </label>
                        <p className="text-slate-800 font-medium">
                          {accountData.accountName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          昵称
                        </label>
                        <p className="text-slate-800 font-medium">
                          {accountData.nickname}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          电话
                        </label>
                        <p className="text-slate-800 font-medium">
                          {accountData.phone}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          邮箱
                        </label>
                        <p className="text-slate-800 font-medium">
                          {accountData.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          角色
                        </label>
                        <p className="text-slate-800 font-medium">
                          {accountData.role}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          所属组织
                        </label>
                        <p className="text-slate-800 font-medium">
                          {accountData.organization}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          创建日期
                        </label>
                        <p className="text-slate-800 font-medium">
                          {accountData.createdDate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      编辑信息
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        昵称
                      </label>
                      <input
                        type="text"
                        value={editData.nickname}
                        onChange={(e) =>
                          handleEditChange('nickname', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        电话
                      </label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                          handleEditChange('phone', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        邮箱
                      </label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          handleEditChange('email', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveInfo}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors duration-200"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-6">
                  修改密码
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      原密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.old ? 'text' : 'password'}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange('oldPassword', e.target.value)
                        }
                        placeholder="请输入原密码"
                        className={`w-full px-4 py-2 pr-12 border ${
                          passwordErrors.old
                            ? 'border-red-500'
                            : 'border-slate-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            old: !prev.old,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswords.old ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.old && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordErrors.old}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      新密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange('newPassword', e.target.value)
                        }
                        placeholder="请输入新密码（至少6位）"
                        className={`w-full px-4 py-2 pr-12 border ${
                          passwordErrors.new
                            ? 'border-red-500'
                            : 'border-slate-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordErrors.new}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      确认新密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange('confirmPassword', e.target.value)
                        }
                        placeholder="请再次输入新密码"
                        className={`w-full px-4 py-2 pr-12 border ${
                          passwordErrors.confirm
                            ? 'border-red-500'
                            : 'border-slate-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirm && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordErrors.confirm}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 mt-8"
                  >
                    修改密码
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
