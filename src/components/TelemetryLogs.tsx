import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  Trash2, 
  Download, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Cpu, 
  Server,
  Clock
} from 'lucide-react';
import { LogEntry, LogLevel } from '../types';

interface TelemetryLogsProps {
  logs: LogEntry[];
  onClearLogs: () => Promise<void>;
  metrics: {
    totalRequests: number;
    uptimeSeconds: number;
    violationsDetected: number;
    modelInferences: number;
    apiSuccessRate: number;
    avgModelInferenceMs: number;
  };
}

export const TelemetryLogs: React.FC<TelemetryLogsProps> = ({
  logs,
  onClearLogs,
  metrics
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'ERROR':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'WARN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'AUDIT':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'INFO':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drishti-audit-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              Telemetry & Structured Logging Core
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Prometheus & ELK Compatible
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Real-Time System Observability & Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured JSON event telemetry capturing model inferences, cadastral queries, JWT authorizations, and statutory violation events.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Logs</span>
          </button>
          <button
            onClick={onClearLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 rounded-lg text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Buffer</span>
          </button>
        </div>
      </div>

      {/* Prometheus Telemetry Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>HTTP Throughput</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5">
            {metrics.totalRequests.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">99.8% Success Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Uptime (s)</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5">
            {metrics.uptimeSeconds}s
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Cluster: asia-south1</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Violations Flagged</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1.5">
            {metrics.violationsDetected}
          </div>
          <div className="text-[10px] text-rose-400/80 mt-0.5 font-medium">Enforcement Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>YOLO Inferences</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5">
            {metrics.modelInferences}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Avg: {metrics.avgModelInferenceMs}ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Spatial Engine</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1.5">
            PostGIS
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">GEOS 3.11.2 Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Log Entries</span>
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5">
            {logs.length}
          </div>
          <div className="text-[10px] text-indigo-400 mt-0.5 font-mono">Ring Buffer: 500</div>
        </div>
      </div>

      {/* Structured Log Stream Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-400 mr-2 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" /> Log Level:
            </span>
            {['ALL', 'INFO', 'WARN', 'ERROR', 'AUDIT'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition ${
                  selectedLevel === lvl
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search logs or service name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Console Log Rows */}
        <div className="bg-slate-950 rounded-lg border border-slate-800/80 p-3 h-96 overflow-y-auto font-mono text-xs space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 text-center py-12">
              No log events matching current filters.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="hover:bg-slate-900/60 p-1.5 rounded transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900/80"
              >
                <div className="flex items-start sm:items-center space-x-2.5 overflow-hidden">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getLevelBadge(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-indigo-400 shrink-0 font-semibold">
                    [{log.service}]
                  </span>
                  <span className="text-slate-200 truncate">
                    {log.message}
                  </span>
                </div>

                {log.userId && (
                  <span className="text-[10px] text-slate-500 shrink-0 self-end sm:self-center">
                    User: {log.userId}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
