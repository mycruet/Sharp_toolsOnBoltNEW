import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Key, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { User, getUsersByOrganizationId, createUser, updateUser, deleteUser, resetUserPassword, setOrgLeader } from '../services/userDB';
import { Organization, getAllOrganizations } from '../services/organizationDB';
import UserForm from './UserForm';

export default function UserManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedOrgName, setSelectedOrgName] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      loadUsers();
    }
  }, [selectedOrgId]);

  const loadOrganizations = async () => {
    try {
      const data = await getAllOrganizations();
      setOrganizations(data);
      const topLevelOrgs = data.filter(o => o.parentId === null);
      if (topLevelOrgs.length > 0) {
        setExpandedIds(new Set(topLevelOrgs.map(o => o.id)));
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsersByOrganizationId(selectedOrgId);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrgId(org.id);
    setSelectedOrgName(org.name);
  };

  const handleAddUser = async (data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'password_hash'>) => {
    try {
      await createUser(data);
      await loadUsers();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('创建用户失败');
    }
  };

  const handleUpdateUser = async (data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'password_hash'>) => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, data);
      await loadUsers();
      setEditingUser(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('更新用户失败');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('确定删除该用户吗？')) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('删除用户失败');
    }
  };

  const handleResetPassword = async (id: string) => {
    if (!confirm('确定重置该用户密码吗？密码将重置为默认密码。')) return;
    try {
      await resetUserPassword(id);
      alert('密码重置成功');
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('密码重置失败');
    }
  };

  const handleToggleOrgLeader = async (user: User) => {
    try {
      await setOrgLeader(user.id, !user.is_org_leader);
      await loadUsers();
    } catch (error) {
      console.error('Failed to set org leader:', error);
      alert('设置组织负责人失败');
    }
  };

  const getChildren = (parentId: string | null): Organization[] => {
    return organizations.filter(o => o.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const renderOrgTree = (org: Organization, depth: number = 0): JSX.Element => {
    const children = getChildren(org.id);
    const isExpanded = expandedIds.has(org.id);
    const isSelected = selectedOrgId === org.id;

    const orgElement = (
      <div
        key={org.id}
        className={`cursor-pointer hover:bg-slate-100 transition-colors ${
          isSelected ? 'bg-blue-50' : ''
        }`}
        onClick={() => handleSelectOrg(org)}
      >
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          {children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(org.id);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {children.length === 0 && <div className="w-4" />}
          <span className={`text-sm ${isSelected ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
            {org.name}
          </span>
        </div>
      </div>
    );

    if (!isExpanded || children.length === 0) {
      return orgElement;
    }

    return (
      <div key={org.id}>
        {orgElement}
        {children.map(child => renderOrgTree(child, depth + 1))}
      </div>
    );
  };

  const rootOrgs = getChildren(null);

  return (
    <div className="flex-1 flex overflow-hidden">
      <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-800">组织机构</h2>
        </div>
        <div className="py-2">
          {rootOrgs.map(org => renderOrgTree(org, 0))}
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">用户管理</h1>
              <p className="text-sm text-slate-500 mt-1">当前组织: {selectedOrgName}</p>
            </div>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              新增用户
            </button>
          </div>

          {showForm && (
            <UserForm
              user={editingUser}
              organizationId={selectedOrgId}
              organizationName={selectedOrgName}
              onSubmit={editingUser ? handleUpdateUser : handleAddUser}
              onCancel={() => {
                setShowForm(false);
                setEditingUser(null);
              }}
            />
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500">加载中...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-slate-500">该组织暂无用户，点击新增按钮添加用户</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">用户ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">用户名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">手机号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">邮箱</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">角色</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">组织负责人</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-slate-600 font-mono">
                        {user.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-800 font-medium">{user.username}</td>
                      <td className="px-4 py-4 text-sm text-slate-800">{user.nickname}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{user.phone || '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{user.email || '-'}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                              >
                                {role}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            user.is_org_leader
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {user.is_org_leader ? '是' : '否'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowForm(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="重置密码"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleOrgLeader(user)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title={user.is_org_leader ? '取消组织负责人' : '设为组织负责人'}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
