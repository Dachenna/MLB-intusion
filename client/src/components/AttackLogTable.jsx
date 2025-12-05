import React, { useState } from 'react';

const AttackLogTable = React.memo(({ logs }) => {
  const [sortBy, setSortBy] = useState('timestamp');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredLogs = filterStatus === 'ALL' ? logs : logs.filter(log => log.status === filterStatus);
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === 'timestamp') return new Date(b.timestamp) - new Date(a.timestamp);
    if (sortBy === 'confidence') return b.confidence - a.confidence;
    return 0;
  });

  const getStatusColor = (status) => {
    if (status === 'ALERT') return 'bg-red-900/30 text-red-300';
    if (status === 'NORMAL') return 'bg-green-900/30 text-green-300';
    return 'bg-yellow-900/30 text-yellow-300';
  };

  const getTypeIcon = (type) => {
    if (type.includes('PORT')) return '🔍';
    if (type.includes('DDOS')) return '💥';
    if (type.includes('NORMAL')) return '✅';
    return '⚠️';
  };

  return (
    <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">📋 Attack Log History</h3>
        <div className="flex gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1 rounded bg-gray-700 text-gray-200 text-sm border border-gray-600">
            <option value="ALL">All</option>
            <option value="ALERT">Alerts</option>
            <option value="NORMAL">Normal</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1 rounded bg-gray-700 text-gray-200 text-sm border border-gray-600">
            <option value="timestamp">Latest First</option>
            <option value="confidence">Highest Confidence</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Time</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Confidence</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition">
                  <td className="py-3 px-4 text-gray-300">{log.timestamp.toLocaleTimeString()}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      <span className="text-gray-300">{log.type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700/50 rounded h-1">
                        <div className="bg-blue-500 h-full rounded" style={{ width: `${log.confidence * 100}%` }}></div>
                      </div>
                      <span className="text-gray-300 text-xs">{(log.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-2 py-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 transition text-xs font-semibold">
                      Investigate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Showing {sortedLogs.length} of {logs.length} entries
      </div>
    </div>
  );
});

AttackLogTable.displayName = 'AttackLogTable';
export default AttackLogTable;
