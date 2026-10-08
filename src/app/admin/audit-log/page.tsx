'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ShieldCheck, History, User, Clock, FileText } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/admin/audit-log');
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit & Activity Trail"
        subtitle="Full real-time audit record of all admin data mutations and synchronization events."
        badge="Security & Compliance Log"
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" /> Recent System Mutations ({logs.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit log stream...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No mutation logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Entity ID</th>
                  <th className="py-3.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      {log.user}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-700">{log.entity}</td>
                    <td className="py-3.5 px-4 text-slate-500">{log.entityId}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-sans max-w-xs truncate">
                      {log.newValue ? JSON.stringify(log.newValue) : 'Record Deleted'}
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
