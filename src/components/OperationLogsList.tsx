import { useState, useEffect } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { OperationLog, getOperationLogs } from '../services/operationLogsDB';

interface OperationLogsListProps {
  onViewDetail: (log: OperationLog) => void;
}

export default function OperationLogsList({ onViewDetail }: OperationLogsListProps) {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<OperationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    ip_address: '',
    application_name: '',
    operator: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getOperationLogs();
      setLogs(data);
      setFilteredLogs(data);
    } catch (error) {
      console.error('加载操作日志失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    if (filters.ip_address) {
      filtered = filtered.filter(log =>
        log.ip_address.includes(filters.ip_address)
      );
    }
    if (filters.application_name) {
      filtered = filtered.filter(log =>
        log.application_name.includes(filters.application_name)
      );
    }
    if (filters.operator) {
      filtered = filtered.filter(log =>
        log.operator.includes(filters.operator)
      );
    }
    if (filters.start_date) {
      filtered = filtered.filter(log =>
        new Date(log.operation_time) >= new Date(filters.start_date)
      );
    }
    if (filters.end_date) {
      filtered = filtered.filter(log => {
        const endDate = new Date(filters.end_date);
        endDate.setHours(23, 59, 59, 999);
        return new Date(log.operation_time) <= endDate;
      });
    }

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      ip_address: '',
      application_name: '',
      operator: '',
      start_date: '',
      end_date: '',
    });
    setFilteredLogs(logs);
  };

  const handleExport = () => {
    const headers = ['ID', 'IP地址', '应用名称', '操作人员', '操作时间'];
    const rows = filteredLogs.map(log => [
      log.id,
      log.ip_address,
      log.application_name,
      log.operator,
      new Date(log.operation_time).toLocaleString('zh-CN'),
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `operation_logs_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">日志查询</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">IP地址</label>
            <input
              type="text"
              value={filters.ip_address}
              onChange={(e) => handleFilterChange('ip_address', e.target.value)}
              placeholder="输入IP地址"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">应用名称</label>
            <input
              type="text"
              value={filters.application_name}
              onChange={(e) => handleFilterChange('application_name', e.target.value)}
              placeholder="输入应用名称"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">操作人员</label>
            <input
              type="text"
              value={filters.operator}
              onChange={(e) => handleFilterChange('operator', e.target.value)}
              placeholder="输入操作人员"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">开始日期</label>
            <input
              type="datetime-local"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">结束日期</label>
            <input
              type="datetime-local"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            查询
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            重置
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">IP地址</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">应用名称</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">操作人员</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">操作时间</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  加载中...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  暂无数据
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.ip_address}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.application_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.operator}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(log.operation_time).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onViewDetail(log)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      查看
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
