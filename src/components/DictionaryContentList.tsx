import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChevronLeft } from 'lucide-react';
import { Dictionary, DictionaryContent, getContentsByDictionaryId, addDictionaryContent, updateDictionaryContent, deleteDictionaryContent } from '../services/indexedDB';
import DictionaryContentForm from './DictionaryContentForm';

interface DictionaryContentListProps {
  dictionary: Dictionary;
  onBack: () => void;
}

export default function DictionaryContentList({ dictionary, onBack }: DictionaryContentListProps) {
  const [contents, setContents] = useState<DictionaryContent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<DictionaryContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContents();
  }, [dictionary.id]);

  const loadContents = async () => {
    setIsLoading(true);
    try {
      const data = await getContentsByDictionaryId(dictionary.id);
      setContents(data);
    } catch (error) {
      console.error('Failed to load contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContent = async (data: { name: string; remark: string }) => {
    try {
      const newContent: DictionaryContent = {
        id: Date.now().toString(),
        dictionaryId: dictionary.id,
        name: data.name,
        remark: data.remark,
        createdAt: Date.now(),
      };
      await addDictionaryContent(newContent);
      setContents([newContent, ...contents]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add content:', error);
    }
  };

  const handleUpdateContent = async (data: { name: string; remark: string }) => {
    if (!editingContent) return;
    try {
      const updatedContent: DictionaryContent = {
        ...editingContent,
        name: data.name,
        remark: data.remark,
      };
      await updateDictionaryContent(updatedContent);
      setContents(contents.map(c => c.id === editingContent.id ? updatedContent : c));
      setEditingContent(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('确定删除该字典内容吗？')) return;
    try {
      await deleteDictionaryContent(id);
      setContents(contents.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          返回
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">字典配置</h1>
            <p className="text-sm text-slate-500 mt-1">字典名称: {dictionary.name}</p>
          </div>
          <button
            onClick={() => {
              setEditingContent(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            新增内容
          </button>
        </div>

        {showForm && (
          <DictionaryContentForm
            content={editingContent}
            onSubmit={editingContent ? handleUpdateContent : handleAddContent}
            onCancel={() => {
              setShowForm(false);
              setEditingContent(null);
            }}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-500">加载中...</div>
          </div>
        ) : contents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-500">暂无内容数据，点击新增按钮添加内容</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">内容ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">内容名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">备注</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => (
                  <tr key={content.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{content.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{content.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{content.remark}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingContent(content);
                            setShowForm(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
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
    </div>
  );
}
