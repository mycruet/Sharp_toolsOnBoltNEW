import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Role, Operation, PermissionApp } from '../services/roleDB';
import {
  getOperations,
  getPermissionApps,
  getRoleOperationPermissions,
  setRoleOperationPermissions,
  getRoleApplicationPermissions,
  setRoleApplicationPermissions,
  getRoleDataPermission,
  setRoleDataPermission,
} from '../services/roleDB';

interface PermissionConfigProps {
  role: Role;
  onClose: () => void;
}

interface OperationNode extends Operation {
  children?: OperationNode[];
  expanded?: boolean;
  checked?: boolean;
}

export default function PermissionConfig({ role, onClose }: PermissionConfigProps) {
  const [dataScope, setDataScope] = useState<'self' | 'all' | 'organization'>('all');
  const [operations, setOperations] = useState<OperationNode[]>([]);
  const [apps, setApps] = useState<PermissionApp[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [searchOp, setSearchOp] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [opsData, appsData, opPerms, appPerms, dataPerms] = await Promise.all([
        getOperations(),
        getPermissionApps(),
        getRoleOperationPermissions(role.id),
        getRoleApplicationPermissions(role.id),
        getRoleDataPermission(role.id),
      ]);

      if (dataPerms) {
        setDataScope(dataPerms.data_scope);
      }
      setSelectedAppIds(appPerms);
      setApps(appsData);

      // Build operation tree
      const tree = buildOperationTree(opsData, opPerms);
      setOperations(tree);
    } catch (error) {
      console.error('加载权限数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildOperationTree = (ops: Operation[], selectedIds: string[]): OperationNode[] => {
    const map = new Map<string, OperationNode>();
    const roots: OperationNode[] = [];

    ops.forEach(op => {
      map.set(op.id, { ...op, children: [], checked: selectedIds.includes(op.id) });
    });

    ops.forEach(op => {
      const node = map.get(op.id)!;
      if (op.parent_id) {
        const parent = map.get(op.parent_id);
        if (parent) {
          parent.children?.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const toggleNode = (nodeId: string) => {
    const toggle = (nodes: OperationNode[]): OperationNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: toggle(node.children) };
        }
        return node;
      });
    };
    setOperations(toggle(operations));
  };

  const toggleCheck = (nodeId: string, checked: boolean) => {
    const updateChecks = (nodes: OperationNode[]): OperationNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          const newChecked = !checked;
          return {
            ...node,
            checked: newChecked,
            children: newChecked
              ? node.children?.map(child => updateCheckRecursive(child, true))
              : node.children,
          };
        }
        if (node.children) {
          return { ...node, children: updateChecks(node.children) };
        }
        return node;
      });
    };

    const updateCheckRecursive = (node: OperationNode, check: boolean): OperationNode => {
      return {
        ...node,
        checked: check,
        children: node.children?.map(child => updateCheckRecursive(child, check)),
      };
    };

    setOperations(updateChecks(operations));
  };

  const filterOperations = (nodes: OperationNode[], query: string): OperationNode[] => {
    return nodes
      .filter(node => {
        const matchesQuery =
          node.name.toLowerCase().includes(query.toLowerCase()) ||
          (node.children && filterOperations(node.children, query).length > 0);
        return matchesQuery;
      })
      .map(node => ({
        ...node,
        expanded: query.length > 0 ? true : node.expanded,
        children: node.children ? filterOperations(node.children, query) : [],
      }));
  };

  const displayedOps = searchOp ? filterOperations(operations, searchOp) : operations;

  const getCheckedCount = (nodes: OperationNode[] = operations): number => {
    let count = 0;
    const traverse = (nodes: OperationNode[]) => {
      nodes.forEach(node => {
        if (node.checked) count++;
        if (node.children) traverse(node.children);
      });
    };
    traverse(nodes);
    return count;
  };

  const toggleSelectAll = () => {
    const allChecked = getCheckedCount() > 0;
    const updateAll = (nodes: OperationNode[]): OperationNode[] => {
      return nodes.map(node => ({
        ...node,
        checked: !allChecked,
        children: node.children ? updateAll(node.children) : [],
      }));
    };
    setOperations(updateAll(operations));
  };

  const collectCheckedIds = (nodes: OperationNode[] = operations): string[] => {
    const ids: string[] = [];
    const traverse = (nodes: OperationNode[]) => {
      nodes.forEach(node => {
        if (node.checked) ids.push(node.id);
        if (node.children) traverse(node.children);
      });
    };
    traverse(nodes);
    return ids;
  };

  const handleSave = async () => {
    try {
      await setRoleDataPermission(role.id, dataScope);
      await setRoleOperationPermissions(role.id, collectCheckedIds());
      await setRoleApplicationPermissions(role.id, selectedAppIds);
      onClose();
    } catch (error) {
      alert('保存权限失败，请重试');
    }
  };

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
          <h2 className="text-lg font-bold text-slate-800">配置权限 - {role.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Data Permission */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">数据权限</h3>
            <div className="space-y-2">
              {(['self', 'all', 'organization'] as const).map(scope => (
                <label key={scope} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dataScope"
                    value={scope}
                    checked={dataScope === scope}
                    onChange={(e) => setDataScope(e.target.value as typeof scope)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">
                    {scope === 'self' && '本人'}
                    {scope === 'all' && '全部'}
                    {scope === 'organization' && '所属机构'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Operation Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">操作权限</h3>
              <button
                onClick={toggleSelectAll}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              >
                {getCheckedCount() > 0 ? '全取消' : '全选'}
              </button>
            </div>

            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索操作..."
                  value={searchOp}
                  onChange={(e) => setSearchOp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
              {displayedOps.length === 0 ? (
                <div className="text-sm text-slate-500 py-8 text-center">暂无操作</div>
              ) : (
                <OperationTree
                  nodes={displayedOps}
                  onToggle={toggleNode}
                  onCheck={toggleCheck}
                />
              )}
            </div>
          </div>

          {/* Application Permissions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">应用权限</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
              {apps.length === 0 ? (
                <div className="text-sm text-slate-500 py-8 text-center">暂无应用</div>
              ) : (
                apps.map(app => (
                  <label key={app.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAppIds.includes(app.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAppIds([...selectedAppIds, app.id]);
                        } else {
                          setSelectedAppIds(selectedAppIds.filter(id => id !== app.id));
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-700">{app.name}</span>
                  </label>
                ))
              )}
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
      </div>
    </div>
  );
}

interface OperationTreeProps {
  nodes: OperationNode[];
  onToggle: (nodeId: string) => void;
  onCheck: (nodeId: string, checked: boolean) => void;
}

function OperationTree({ nodes, onToggle, onCheck }: OperationTreeProps) {
  return (
    <>
      {nodes.map(node => (
        <div key={node.id}>
          <div className="flex items-center gap-2 hover:bg-slate-100 rounded p-1">
            {node.children && node.children.length > 0 && (
              <button
                onClick={() => onToggle(node.id)}
                className="p-0 hover:bg-slate-200 rounded"
              >
                {node.expanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
              </button>
            )}
            {(!node.children || node.children.length === 0) && (
              <div className="w-4" />
            )}

            <input
              type="checkbox"
              checked={node.checked || false}
              onChange={(e) => onCheck(node.id, node.checked || false)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-slate-700">{node.name}</span>
          </div>

          {node.expanded && node.children && node.children.length > 0 && (
            <div className="ml-4 border-l border-slate-200">
              <OperationTree nodes={node.children} onToggle={onToggle} onCheck={onCheck} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
