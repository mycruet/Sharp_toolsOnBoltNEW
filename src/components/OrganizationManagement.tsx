import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { Organization, getAllOrganizations, addOrganization, updateOrganization, deleteOrganization, updateBatch, getOrganizationsByParentId } from '../services/organizationDB';
import OrganizationForm from './OrganizationForm';

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [parentForNewOrg, setParentForNewOrg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transferSource, setTransferSource] = useState<Organization | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to load organizations:', error);
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

  const handleAddOrg = async (data: { name: string; description: string }) => {
    try {
      const siblings = await getOrganizationsByParentId(parentForNewOrg);
      const newOrg: Organization = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        parentId: parentForNewOrg,
        level: parentForNewOrg ? 1 : 0,
        order: siblings.length,
        createdAt: Date.now(),
      };
      await addOrganization(newOrg);
      await loadOrganizations();
      setShowForm(false);
      setParentForNewOrg(null);
    } catch (error) {
      console.error('Failed to add organization:', error);
    }
  };

  const handleUpdateOrg = async (data: { name: string; description: string }) => {
    if (!editingOrg) return;
    try {
      const updatedOrg: Organization = {
        ...editingOrg,
        name: data.name,
        description: data.description,
      };
      await updateOrganization(updatedOrg);
      await loadOrganizations();
      setEditingOrg(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update organization:', error);
    }
  };

  const handleDeleteOrg = async (id: string) => {
    if (!confirm('删除该组织机构后，其下级机构将自动上升一级。确定删除吗？')) return;
    try {
      const children = organizations.filter(o => o.parentId === id);
      const parentOrg = organizations.find(o => o.id === editingOrg?.parentId);

      const updates: Organization[] = [];
      for (const child of children) {
        updates.push({
          ...child,
          parentId: editingOrg?.parentId || null,
          level: (editingOrg?.level || 0) - 1,
        });
      }

      if (updates.length > 0) {
        await updateBatch(updates);
      }

      await deleteOrganization(id);
      await loadOrganizations();
    } catch (error) {
      console.error('Failed to delete organization:', error);
    }
  };

  const handleMoveUp = async (org: Organization) => {
    try {
      const siblings = organizations.filter(o => o.parentId === org.parentId && o.id !== org.id);
      const currentIndex = siblings.findIndex(s => s.order === org.order - 1);

      if (currentIndex < 0) return;

      const sibling = siblings[currentIndex];
      const updates = [
        { ...org, order: sibling.order },
        { ...sibling, order: org.order },
      ];

      await updateBatch(updates);
      await loadOrganizations();
    } catch (error) {
      console.error('Failed to move up:', error);
    }
  };

  const handleMoveDown = async (org: Organization) => {
    try {
      const siblings = organizations.filter(o => o.parentId === org.parentId && o.id !== org.id);
      const currentIndex = siblings.findIndex(s => s.order === org.order + 1);

      if (currentIndex < 0) return;

      const sibling = siblings[currentIndex];
      const updates = [
        { ...org, order: sibling.order },
        { ...sibling, order: org.order },
      ];

      await updateBatch(updates);
      await loadOrganizations();
    } catch (error) {
      console.error('Failed to move down:', error);
    }
  };

  const handleStartTransfer = (org: Organization) => {
    setTransferSource(org);
  };

  const handleTransferTo = async (targetOrg: Organization) => {
    if (!transferSource || transferSource.id === targetOrg.id) return;

    try {
      if (isDescendant(transferSource.id, targetOrg.id)) {
        alert('不能将组织机构划拨给其下级机构');
        return;
      }

      const movedOrg: Organization = {
        ...transferSource,
        parentId: targetOrg.id,
        level: targetOrg.level + 1,
      };

      await updateOrganization(movedOrg);
      await loadOrganizations();
      setTransferSource(null);
    } catch (error) {
      console.error('Failed to transfer:', error);
    }
  };

  const isDescendant = (parentId: string, checkId: string): boolean => {
    const org = organizations.find(o => o.id === checkId);
    if (!org) return false;
    if (org.parentId === parentId) return true;
    return isDescendant(parentId, org.parentId || '');
  };

  const getChildren = (parentId: string | null): Organization[] => {
    return organizations.filter(o => o.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const renderOrgRow = (org: Organization, depth: number = 0): JSX.Element[] => {
    const children = getChildren(org.id);
    const isExpanded = expandedIds.has(org.id);
    const isTransferSource = transferSource?.id === org.id;
    const isTransferable = transferSource && transferSource.id !== org.id && !isDescendant(transferSource.id, org.id);

    const rows: JSX.Element[] = [
      <tr
        key={org.id}
        className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
          isTransferSource ? 'bg-yellow-50' : ''
        }`}
      >
        <td className="px-6 py-4 text-sm text-slate-600">
          <div style={{ paddingLeft: `${depth * 24}px` }} className="flex items-center gap-2">
            {children.length > 0 && (
              <button
                onClick={() => toggleExpand(org.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            {children.length === 0 && <div className="w-4" />}
            {org.id}
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-800 font-medium">{org.name}</td>
        <td className="px-6 py-4 text-sm text-slate-600">
          {organizations.find(o => o.id === org.parentId)?.name || '根'}
        </td>
        <td className="px-6 py-4 text-sm text-slate-600">{org.description}</td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <button
              onClick={() => {
                setParentForNewOrg(org.id);
                setEditingOrg(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors"
              title="增加下级"
            >
              <Plus className="w-3 h-3" />
              增加下级
            </button>
            <button
              onClick={() => handleMoveUp(org)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="上移"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleMoveDown(org)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="下移"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleStartTransfer(org)}
              className={`flex items-center gap-1 px-2 py-1 text-xs ${
                isTransferSource
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              } rounded transition-colors`}
              title="划拨源"
            >
              <Copy className="w-3 h-3" />
              {isTransferSource ? '取消' : '划拨'}
            </button>
            {isTransferable && (
              <button
                onClick={() => handleTransferTo(org)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                title="划拨至此"
              >
                <Copy className="w-3 h-3" />
                放置
              </button>
            )}
            <button
              onClick={() => {
                setEditingOrg(org);
                setShowForm(true);
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded transition-colors"
              title="编辑"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDeleteOrg(org.id)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="删除"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </td>
      </tr>,
    ];

    if (isExpanded && children.length > 0) {
      children.forEach(child => {
        rows.push(...renderOrgRow(child, depth + 1));
      });
    }

    return rows;
  };

  const rootOrganizations = getChildren(null);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">组织机构</h1>
          <button
            onClick={() => {
              setParentForNewOrg(null);
              setEditingOrg(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            新增顶级机构
          </button>
        </div>

        {transferSource && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              正在划拨: <strong>{transferSource.name}</strong>
              <button
                onClick={() => setTransferSource(null)}
                className="ml-4 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
              >
                取消
              </button>
            </p>
          </div>
        )}

        {showForm && (
          <OrganizationForm
            organization={editingOrg}
            parentName={parentForNewOrg ? organizations.find(o => o.id === parentForNewOrg)?.name : undefined}
            onSubmit={editingOrg ? handleUpdateOrg : handleAddOrg}
            onCancel={() => {
              setShowForm(false);
              setEditingOrg(null);
              setParentForNewOrg(null);
            }}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-500">加载中...</div>
          </div>
        ) : rootOrganizations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-500">暂无组织机构数据，点击新增按钮添加</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700 min-w-[150px]">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700 min-w-[150px]">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700 min-w-[150px]">父节点</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700 min-w-[200px]">描述</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {rootOrganizations.flatMap(org => renderOrgRow(org))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
