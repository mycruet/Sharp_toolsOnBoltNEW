import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Search, CheckSquare, Square, X, CreditCard as Edit2, Check, ExternalLink } from 'lucide-react';
import { Todo, getTodos, createTodo, updateTodo, deleteTodo, deleteTodos, getPendingCount } from '../services/todosDB';
import { getAllDictionaries, getContentsByDictionaryId, DictionaryContent } from '../services/indexedDB';
import { useAuth } from '../hooks/useAuth';

const URGENCY_DICT_NAME = '待办任务紧急程度';

export default function TodosPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // Urgency options from dictionary
  const [urgencyOptions, setUrgencyOptions] = useState<DictionaryContent[]>([]);

  // Filters
  const [titleSearch, setTitleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [processingTodo, setProcessingTodo] = useState<Todo | null>(null);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formUrgency, setFormUrgency] = useState('');

  const loadUrgencyOptions = useCallback(async () => {
    try {
      const dictionaries = await getAllDictionaries();
      const urgencyDict = dictionaries.find(d => d.name === URGENCY_DICT_NAME);
      if (urgencyDict) {
        const contents = await getContentsByDictionaryId(urgencyDict.id);
        setUrgencyOptions(contents);
      }
    } catch (error) {
      console.error('Failed to load urgency options:', error);
    }
  }, []);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTodos({
        userId: user?.id,
        status: statusFilter,
        urgency: urgencyFilter || undefined,
        titleSearch: titleSearch || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, statusFilter, urgencyFilter, titleSearch, startDate, endDate]);

  const loadPendingCount = useCallback(async () => {
    try {
      const count = await getPendingCount(user?.id);
      setPendingCount(count);
    } catch (error) {
      console.error('Failed to load pending count:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUrgencyOptions();
  }, [loadUrgencyOptions]);

  useEffect(() => {
    if (user?.id) {
      loadTodos();
      loadPendingCount();
    }
  }, [user?.id, loadTodos, loadPendingCount]);

  const handleSelectAll = () => {
    if (selectedIds.size === todos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(todos.map(t => t.id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectPending = () => {
    const pendingIds = todos.filter(t => t.status === 'pending').map(t => t.id);
    setSelectedIds(new Set(pendingIds));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定删除选中的 ${selectedIds.size} 条任务吗？`)) return;

    try {
      await deleteTodos(Array.from(selectedIds));
      setSelectedIds(new Set());
      loadTodos();
      loadPendingCount();
    } catch (error) {
      console.error('Failed to delete todos:', error);
      alert('删除失败');
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('确定删除该任务吗？')) return;

    try {
      await deleteTodo(id);
      loadTodos();
      loadPendingCount();
    } catch (error) {
      console.error('Failed to delete todo:', error);
      alert('删除失败');
    }
  };

  const handleMarkCompleted = async () => {
    if (selectedIds.size === 0) return;

    try {
      const ids = Array.from(selectedIds);
      for (const id of ids) {
        await updateTodo(id, { status: 'completed' });
      }
      setSelectedIds(new Set());
      loadTodos();
      loadPendingCount();
    } catch (error) {
      console.error('Failed to mark as completed:', error);
      alert('标记失败');
    }
  };

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormUrgency(urgencyOptions.length > 0 ? urgencyOptions[0].name : '普通');
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleOpenEdit = (todo: Todo) => {
    setFormTitle(todo.title);
    setFormUrgency(todo.urgency);
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('请输入标题');
      return;
    }

    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, {
          title: formTitle.trim(),
          urgency: formUrgency,
        });
      } else {
        await createTodo(user!.id, {
          title: formTitle.trim(),
          urgency: formUrgency,
          status: 'pending',
        });
      }
      setShowForm(false);
      setEditingTodo(null);
      loadTodos();
      loadPendingCount();
    } catch (error) {
      console.error('Failed to save todo:', error);
      alert('保存失败');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case '紧急':
        return 'bg-red-100 text-red-700';
      case '高':
        return 'bg-orange-100 text-orange-700';
      case '普通':
        return 'bg-blue-100 text-blue-700';
      case '低':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">我的待办</h1>
            <p className="text-sm text-slate-500 mt-1">
              共 {todos.length} 条任务
              {pendingCount > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({pendingCount} 条待处理)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            新增待办
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">标题搜索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索标题..."
                  value={titleSearch}
                  onChange={(e) => setTitleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">紧急程度</label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部</option>
                {urgencyOptions.map(opt => (
                  <option key={opt.id} value={opt.name}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed')}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部</option>
                <option value="pending">待处理</option>
                <option value="completed">已完成</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedIds.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center gap-4">
            <span className="text-sm text-blue-800 font-medium">
              已选择 {selectedIds.size} 条
            </span>
            <button
              onClick={handleMarkCompleted}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              标记完成
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              批量删除
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-sm"
            >
              取消选择
            </button>
          </div>
        )}

        {/* Todos Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-500">加载中...</div>
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <p>暂无待办任务</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <button
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {selectedIds.size === todos.length ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">标题</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">接收时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">紧急程度</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {todos.map((todo) => (
                  <tr key={todo.id} className={`hover:bg-slate-50 ${selectedIds.has(todo.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSelect(todo.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {selectedIds.has(todo.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                      {todo.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                      {todo.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(todo.received_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(todo.urgency)}`}>
                        {todo.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        todo.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {todo.status === 'pending' ? '待处理' : '已完成'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {todo.status === 'pending' && (
                          <button
                            onClick={() => setProcessingTodo(todo)}
                            className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            处理
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(todo)}
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOne(todo.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
          )}
        </div>

        {/* Quick action: Select pending */}
        {!isLoading && todos.some(t => t.status === 'pending') && (
          <div className="mt-4 text-center">
            <button
              onClick={handleSelectPending}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              选择所有待处理任务
            </button>
          </div>
        )}

        {/* No urgency options warning */}
        {urgencyOptions.length === 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p className="text-sm text-amber-800">
              未找到字典「{URGENCY_DICT_NAME}」，请在系统管理 - 字典管理中创建该字典并添加紧急程度选项
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                {editingTodo ? '编辑待办' : '新增待办'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="请输入待办标题"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  紧急程度 <span className="text-red-500">*</span>
                </label>
                {urgencyOptions.length > 0 ? (
                  <select
                    value={formUrgency}
                    onChange={(e) => setFormUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {urgencyOptions.map(opt => (
                      <option key={opt.id} value={opt.name}>{opt.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formUrgency}
                    onChange={(e) => setFormUrgency(e.target.value)}
                    placeholder="请输入紧急程度"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingTodo ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processing Panel */}
      {processingTodo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">处理待办</h2>
              <button
                onClick={() => setProcessingTodo(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500 mb-1">任务标题</p>
                <p className="text-base text-slate-800 font-medium">{processingTodo.title}</p>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">紧急程度</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(processingTodo.urgency)}`}>
                    {processingTodo.urgency}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">接收时间</p>
                  <p className="text-sm text-slate-700">{formatDate(processingTodo.received_at)}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">跳转到具体工作流处理</p>
                    <p className="text-xs text-blue-600 mt-1">点击下方按钮前往工作流处理页面</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={() => setProcessingTodo(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setProcessingTodo(null);
                    alert('跳转到具体工作流处理页面（功能待实现）');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  前往处理
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
