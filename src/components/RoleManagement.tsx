import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Lock, Users, Search } from 'lucide-react';
import { Role, getRoles, createRole, updateRole, deleteRole } from '../services/roleDB';
import PermissionConfig from './PermissionConfig';
import RoleAssignment from './RoleAssignment';

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPermissionConfig, setShowPermissionConfig] = useState(false);
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
      setFilteredRoles(data);
    } catch (error) {
      console.error('加载角色失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(value.toLowerCase()) ||
      (role.description?.toLowerCase().includes(value.toLowerCase()) ?? false)
    );
    setFilteredRoles(filtered);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('请输入角色名称');
      return;
    }

    try {
      if (editingRole) {
        await updateRole(editingRole.id, formData);
      } else {
        await createRole(formData);
      }
      loadRoles();
      setShowForm(false);
      setEditingRole(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      alert('操作失败，请重试');
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, description: role.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (roleId: string) => {
    if (!window.confirm('确定删除该角色吗？')) return;

    try {
      await deleteRole(roleId);
      loadRoles();
    } catch (error) {
      alert('删除失败，请重试');
    }
  };

  const handleConfigPermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionConfig(true);
  };

  const handleAssignRoles = (role: Role) => {
    setSelectedRole(role);
    setShowRoleAssignment(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">权限管理</h1>
        <p className="text-sm text-slate-500 mt-1">管理系统角色和权限配置</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索角色名称或描述..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增角色
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">名称</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">描述</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  加载中...
                </td>
              </tr>
            ) : filteredRoles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  暂无数据
                </td>
              </tr>
            ) : (
              filteredRoles.map(role => (
                <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{role.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{role.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{role.description || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfigPermissions(role)}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                      >
                        <Lock className="w-3 h-3" />
                        配置权限
                      </button>
                      <button
                        onClick={() => handleAssignRoles(role)}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        分配角色
                      </button>
                      <button
                        onClick={() => handleEdit(role)}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {editingRole ? '编辑角色' : '新增角色'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">角色名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入角色名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="输入角色描述"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={closeForm}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {showPermissionConfig && selectedRole && (
        <PermissionConfig
          role={selectedRole}
          onClose={() => {
            setShowPermissionConfig(false);
            setSelectedRole(null);
          }}
        />
      )}

      {showRoleAssignment && selectedRole && (
        <RoleAssignment
          role={selectedRole}
          onClose={() => {
            setShowRoleAssignment(false);
            setSelectedRole(null);
          }}
        />
      )}
    </main>
  );
}
