import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Search, CheckSquare, Square, X, Eye, CreditCard as Edit2, Check } from 'lucide-react';
import { Message, getMessages, createMessage, updateMessage, deleteMessage, deleteMessages, markAsRead, getUnreadCount } from '../services/messagesDB';
import { useAuth } from '../hooks/useAuth';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Filters
  const [titleSearch, setTitleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMessages({
        userId: user?.id,
        status: statusFilter,
        titleSearch: titleSearch || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, statusFilter, titleSearch, startDate, endDate]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount(user?.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadMessages();
      loadUnreadCount();
    }
  }, [user?.id, loadMessages, loadUnreadCount]);

  const handleSelectAll = () => {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map(m => m.id)));
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

  const handleSelectUnread = () => {
    const unreadIds = messages.filter(m => m.status === 'unread').map(m => m.id);
    setSelectedIds(new Set(unreadIds));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定删除选中的 ${selectedIds.size} 条消息吗？`)) return;

    try {
      await deleteMessages(Array.from(selectedIds));
      setSelectedIds(new Set());
      loadMessages();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete messages:', error);
      alert('删除失败');
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('确定删除该消息吗？')) return;

    try {
      await deleteMessage(id);
      loadMessages();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('删除失败');
    }
  };

  const handleMarkRead = async () => {
    if (selectedIds.size === 0) return;

    try {
      await markAsRead(Array.from(selectedIds));
      setSelectedIds(new Set());
      loadMessages();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
      alert('标记失败');
    }
  };

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormContent('');
    setEditingMessage(null);
    setShowForm(true);
  };

  const handleOpenEdit = (message: Message) => {
    setFormTitle(message.title);
    setFormContent(message.content);
    setEditingMessage(message);
    setShowForm(true);
  };

  const handleViewMessage = (message: Message) => {
    setViewingMessage(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('请输入标题');
      return;
    }

    try {
      if (editingMessage) {
        await updateMessage(editingMessage.id, {
          title: formTitle.trim(),
          content: formContent.trim(),
        });
      } else {
        await createMessage(user!.id, {
          title: formTitle.trim(),
          content: formContent.trim(),
          status: 'unread',
        });
      }
      setShowForm(false);
      setEditingMessage(null);
      loadMessages();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to save message:', error);
      alert('保存失败');
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
            <h1 className="text-2xl font-bold text-slate-800">我的消息</h1>
            <p className="text-sm text-slate-500 mt-1">
              共 {messages.length} 条消息
              {unreadCount > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({unreadCount} 条未读)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            新增消息
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
              <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'unread' | 'read')}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部</option>
                <option value="unread">未读</option>
                <option value="read">已读</option>
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
              onClick={handleMarkRead}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              标记已读
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

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-500">加载中...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <p>暂无消息</p>
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
                      {selectedIds.size === messages.length ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">标题</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">接收时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {messages.map((message) => (
                  <tr key={message.id} className={`hover:bg-slate-50 ${selectedIds.has(message.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSelect(message.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {selectedIds.has(message.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                      {message.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="text-sm text-slate-800 hover:text-blue-600 font-medium text-left"
                      >
                        {message.title}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(message.received_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          message.status === 'unread'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {message.status === 'unread' ? '未读' : '已读'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="查看"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(message)}
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOne(message.id)}
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

        {/* Quick action: Select unread */}
        {!isLoading && messages.some(m => m.status === 'unread') && (
          <div className="mt-4 text-center">
            <button
              onClick={handleSelectUnread}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              选择所有未读消息
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                {editingMessage ? '编辑消息' : '新增消息'}
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
                  placeholder="请输入消息标题"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  内容
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="请输入消息内容"
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
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
                  {editingMessage ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">消息详情</h2>
              <button
                onClick={() => setViewingMessage(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">ID</label>
                <p className="text-sm text-slate-800 font-mono">{viewingMessage.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">标题</label>
                <p className="text-base text-slate-800 font-medium">{viewingMessage.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">内容</label>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{viewingMessage.content || '暂无内容'}</p>
              </div>

              <div className="flex gap-4 text-sm text-slate-500">
                <div>
                  <span className="font-medium">接收时间：</span>
                  {formatDate(viewingMessage.received_at)}
                </div>
                <div>
                  <span className="font-medium">状态：</span>
                  {viewingMessage.status === 'unread' ? '未读' : '已读'}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setViewingMessage(null);
                    handleOpenEdit(viewingMessage);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  编辑
                </button>
                <button
                  onClick={() => setViewingMessage(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
