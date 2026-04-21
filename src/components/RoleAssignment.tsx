import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import { Role } from '../services/roleDB';
import {
  getRoleUsers,
  removeUserFromRole,
  setUserRoles,
} from '../services/roleDB';
import { getAllUsers, User } from '../services/userDB';

interface RoleAssignmentProps {
  role: Role;
  onClose: () => void;
}

interface AssignedUser {
  user_id: string;
  user_name: string;
}

export default function RoleAssignment({ role, onClose }: RoleAssignmentProps) {
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [searchAssigned, setSearchAssigned] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showUserSelector, setShowUserSelector] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [users, roleUsers] = await Promise.all([
        getAllUsers(),
        getRoleUsers(role.id),
      ]);

      setAllUsers(users);

      const assigned: AssignedUser[] = [];
      for (const userRole of roleUsers) {
        const user = users.find(u => u.id === userRole.user_id);
        if (user) {
          assigned.push({
            user_id: userRole.user_id,
            user_name: user.nickname || user.username,
          });
        }
      }
      setAssignedUsers(assigned);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableUsers = () => {
    return allUsers.filter(
      user => !assignedUsers.some(au => au.user_id === user.id)
    );
  };

  const handleAddUsers = (selectedUserIds: string[]) => {
    const newUsers = selectedUserIds
      .map(userId => {
        const user = allUsers.find(u => u.id === userId);
        return user
          ? { user_id: userId, user_name: user.nickname || user.username }
          : null;
      })
      .filter((u): u is AssignedUser => u !== null);

    setAssignedUsers([...assignedUsers, ...newUsers]);
    setShowUserSelector(false);
  };

  const handleRemoveUser = (userId: string) => {
    setAssignedUsers(assignedUsers.filter(u => u.user_id !== userId));
  };

  const handleSave = async () => {
    try {
      await setUserRoles(
        assignedUsers.map(u => u.user_id),
        [role.id]
      );
      onClose();
    } catch (error) {
      alert('保存失败，请重试');
    }
  };

  const filteredAssigned = assignedUsers.filter(user =>
    user.user_name.toLowerCase().includes(searchAssigned.toLowerCase())
  );

  const availableUsers = getAvailableUsers().filter(user =>
    (user.nickname || user.username)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">加载中...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">分配角色 - {role.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Assigned Users */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">已分配用户</h3>
                <button
                  onClick={() => setShowUserSelector(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>

              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索已分配用户..."
                    value={searchAssigned}
                    onChange={(e) => setSearchAssigned(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">
                        名称
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAssigned.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          暂无用户
                        </td>
                      </tr>
                    ) : (
                      filteredAssigned.map(user => (
                        <tr key={user.user_id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2 text-slate-600 font-mono">
                            {user.user_id.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-2 text-slate-800">{user.user_name}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleRemoveUser(user.user_id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              删除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            保存
          </button>
        </div>

        {/* User Selector Modal */}
        {showUserSelector && (
          <UserSelector
            availableUsers={availableUsers}
            search={search}
            onSearch={setSearch}
            onSelect={handleAddUsers}
            onClose={() => setShowUserSelector(false)}
          />
        )}
      </div>
    </div>
  );
}

interface UserSelectorProps {
  availableUsers: User[];
  search: string;
  onSearch: (value: string) => void;
  onSelect: (userIds: string[]) => void;
  onClose: () => void;
}

function UserSelector({
  availableUsers,
  search,
  onSearch,
  onSelect,
  onClose,
}: UserSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const displayedUsers = availableUsers.filter(user =>
    (user.nickname || user.username).toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      alert('请至少选择一个用户');
      return;
    }
    onSelect(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto w-full max-w-md">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">选择用户</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索用户..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {displayedUsers.length === 0 ? (
              <div className="text-sm text-slate-500 py-8 text-center">暂无用户</div>
            ) : (
              displayedUsers.map(user => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, user.id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== user.id));
                      }
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {user.nickname || user.username}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{user.id.slice(0, 8)}...</div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
