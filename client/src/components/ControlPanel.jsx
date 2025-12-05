import React from 'react';

const ControlPanel = ({ feature1, onChangeFeature1, onPredict, loading }) => {
  return (
    <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-3">🔬 ML Feature Simulation</h3>

      <label className="block text-sm text-gray-400 mb-2">Duration (seconds) - Connection Length</label>
      <input
        type="number"
        step="0.1"
        value={feature1}
        onChange={(e) => onChangeFeature1(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white mb-2"
      />
      <p className="text-xs text-gray-500 mb-4">
        Network features: <span className="text-green-400">5.0s (Normal)</span>, <span className="text-yellow-400">15.0s (Probe)</span>, <span className="text-red-400">0.5s (DDoS)</span>
      </p>

      <button
        onClick={onPredict}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold transition ${loading ? 'bg-blue-600/60' : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'}`}>
        {loading ? 'Analyzing Flow...' : 'Classify Network Flow'}
      </button>
    </div>
  );
};

export default ControlPanel;
