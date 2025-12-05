import React, { Suspense } from 'react';
const LazyRecharts = React.lazy(() => import('./LazyRecharts'));

const ChartLoader = () => (
  <div className="h-64 bg-linear-to-br from-gray-700/40 to-gray-800/20 rounded-lg flex items-center justify-center text-gray-400">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div>
      <p className="text-sm">Loading chart...</p>
    </div>
  </div>
);

const Visualization = React.memo(({ result, trafficHistory }) => {
  const attackTypeData = [
    { name: 'Normal Traffic', value: 65 },
    { name: 'Port Scans', value: 15 },
    { name: 'DDoS', value: 12 },
    { name: 'Other', value: 8 },
  ];

  const COLORS = ['#10b981', '#f97316', '#ef4444', '#8b5cf6'];

  return (
    <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">📊 Real-Time Traffic & Attack Analytics</h3>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Traffic Flow Over Time</h4>
        <Suspense fallback={<ChartLoader />}>
          <LazyRecharts trafficHistory={trafficHistory} attackTypeData={attackTypeData} COLORS={COLORS} />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Attack Type Distribution</h4>
          <div className="mb-2">
            {/* Pie is rendered inside LazyRecharts too (below the line chart) */}
          </div>
        </div>

        {/* Top Attacking IPs */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Top Attack Sources</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
              <span className="text-gray-300">192.168.1.105</span>
              <span className="text-red-400 font-semibold">8 attacks</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
              <span className="text-gray-300">10.0.0.52</span>
              <span className="text-orange-400 font-semibold">5 attacks</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
              <span className="text-gray-300">172.16.0.88</span>
              <span className="text-yellow-400 font-semibold">3 attacks</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
              <span className="text-gray-300">203.0.113.42</span>
              <span className="text-green-400 font-semibold">1 attack</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-4 p-3 rounded-lg bg-gray-700/30 border border-gray-600 text-xs text-gray-300">
          <span className="font-semibold">Latest Detection:</span> {result.status} • {result.attack_type} • {(result.confidence * 100).toFixed(1)}% confidence
        </div>
      )}
    </div>
  );
});

Visualization.displayName = 'Visualization';
export default Visualization;
