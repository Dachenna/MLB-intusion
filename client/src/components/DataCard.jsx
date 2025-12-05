import React from 'react';

const DataCard = React.memo(({ title, value, unit, color = 'text-white' }) => (
  <div className="bg-linear-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-xl border border-gray-700">
    <p className="text-xs text-gray-400 uppercase tracking-wider">{title}</p>
    <div className="flex items-baseline space-x-2 mt-2">
      <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
      {unit && <span className="text-sm text-gray-400">{unit}</span>}
    </div>
  </div>
));

DataCard.displayName = 'DataCard';
export default DataCard;
