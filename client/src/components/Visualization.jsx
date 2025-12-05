import React, { Suspense, lazy } from 'react';

const LineChart = lazy(() => import('recharts').then(m => ({ default: m.LineChart })));
const PieChart = lazy(() => import('recharts').then(m => ({ default: m.PieChart })));
const Line = lazy(() => import('recharts').then(m => ({ default: m.Line })));
const Pie = lazy(() => import('recharts').then(m => ({ default: m.Pie })));
const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(m => ({ default: m.Tooltip })));
const Legend = lazy(() => import('recharts').then(m => ({ default: m.Legend })));
const Cell = lazy(() => import('recharts').then(m => ({ default: m.Cell })));
const ResponsiveContainer = lazy(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })));

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
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">📊 Real-Time Traffic & Attack Analytics</h3>

      {/* Traffic Over Time Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Traffic Flow Over Time</h4>
        <Suspense fallback={<ChartLoader />}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trafficHistory}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Suspense>
      </div>

      {/* Attack Type Distribution - Pie Chart */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Attack Type Distribution</h4>
          <Suspense fallback={<ChartLoader />}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={attackTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attackTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Suspense>
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
