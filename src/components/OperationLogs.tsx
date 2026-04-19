import { useState } from 'react';
import { OperationLog } from '../services/operationLogsDB';
import OperationLogsList from './OperationLogsList';
import OperationLogsDetail from './OperationLogsDetail';

export default function OperationLogs() {
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">操作日志</h1>
        <p className="text-sm text-slate-500 mt-1">查看和管理系统操作日志记录</p>
      </div>

      <OperationLogsList onViewDetail={setSelectedLog} />
      <OperationLogsDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
    </main>
  );
}
