import { X } from 'lucide-react';
import { OperationLog } from '../services/operationLogsDB';

interface OperationLogsDetailProps {
  log: OperationLog | null;
  onClose: () => void;
}

export default function OperationLogsDetail({ log, onClose }: OperationLogsDetailProps) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">操作日志详情</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ID</label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600 font-mono">
                {log.id}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">IP地址</label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
                {log.ip_address}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">应用名称</label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
                {log.application_name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">操作人员</label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
                {log.operator}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">操作时间</label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
                {new Date(log.operation_time).toLocaleString('zh-CN')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">记录时间</label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
                {log.created_at ? new Date(log.created_at).toLocaleString('zh-CN') : '-'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">操作记录</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600 min-h-24 max-h-48 overflow-y-auto whitespace-pre-wrap break-words">
              {log.operation_record || '-'}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
