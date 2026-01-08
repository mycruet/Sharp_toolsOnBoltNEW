import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Settings } from 'lucide-react';
import { Dictionary, getAllDictionaries, addDictionary, updateDictionary, deleteDictionary } from '../services/indexedDB';
import DictionaryForm from './DictionaryForm';
import DictionaryContentList from './DictionaryContentList';

export default function DictionaryManagement() {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDict, setEditingDict] = useState<Dictionary | null>(null);
  const [selectedDict, setSelectedDict] = useState<Dictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDictionaries();
  }, []);

  const loadDictionaries = async () => {
    setIsLoading(true);
    try {
      const data = await getAllDictionaries();
      setDictionaries(data);
    } catch (error) {
      console.error('Failed to load dictionaries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDict = async (data: { name: string; remark: string }) => {
    try {
      const newDict: Dictionary = {
        id: Date.now().toString(),
        name: data.name,
        remark: data.remark,
        createdAt: Date.now(),
      };
      await addDictionary(newDict);
      setDictionaries([newDict, ...dictionaries]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add dictionary:', error);
    }
  };

  const handleUpdateDict = async (data: { name: string; remark: string }) => {
    if (!editingDict) return;
    try {
      const updatedDict: Dictionary = {
        ...editingDict,
        name: data.name,
        remark: data.remark,
      };
      await updateDictionary(updatedDict);
      setDictionaries(dictionaries.map(d => d.id === editingDict.id ? updatedDict : d));
      setEditingDict(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update dictionary:', error);
    }
  };

  const handleDeleteDict = async (id: string) => {
    if (!confirm('确定删除该字典吗？')) return;
    try {
      await deleteDictionary(id);
      setDictionaries(dictionaries.filter(d => d.id !== id));
    } catch (error) {
      console.error('Failed to delete dictionary:', error);
    }
  };

  if (selectedDict) {
    return (
      <DictionaryContentList
        dictionary={selectedDict}
        onBack={() => setSelectedDict(null)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">字典管理</h1>
          <button
            onClick={() => {
              setEditingDict(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            新增字典
          </button>
        </div>

        {showForm && (
          <DictionaryForm
            dictionary={editingDict}
            onSubmit={editingDict ? handleUpdateDict : handleAddDict}
            onCancel={() => {
              setShowForm(false);
              setEditingDict(null);
            }}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-500">加载中...</div>
          </div>
        ) : dictionaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-500">暂无字典数据，点击新增按钮添加字典</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">字典ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">字典名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">备注</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {dictionaries.map((dict) => (
                  <tr key={dict.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{dict.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{dict.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{dict.remark}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDict(dict)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="配置"
                        >
                          <Settings className="w-4 h-4" />
                          配置
                        </button>
                        <button
                          onClick={() => {
                            setEditingDict(dict);
                            setShowForm(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteDict(dict.id)}
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
