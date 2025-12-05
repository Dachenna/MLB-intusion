import React from 'react';

const AlertBanner = ({ result }) => {
  if (!result) return null;
  const isAlert = result.status === 'ALERT';
  return (
    <div className={`p-4 mb-6 rounded-lg shadow-inner border-l-4 ${isAlert ? 'bg-red-900 border-red-500 text-red-200' : 'bg-yellow-900 border-yellow-500 text-yellow-200'}`}>
      <div className="flex items-start gap-3">
        <div className="text-xl font-bold">{result.status}</div>
        <div>
          <div className="font-semibold">{result.attack_type}</div>
          <div className="text-sm text-gray-300">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
