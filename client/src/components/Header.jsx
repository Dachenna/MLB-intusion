import React from 'react';

const Header = ({ currentStatus }) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-100">Real-Time Network Monitoring</h2>
        <p className="text-sm text-gray-400 mt-1">Detect anomalies and respond with confidence</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">{new Date().toLocaleString()}</div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${currentStatus === 'ALERT' ? 'bg-red-700 text-red-100' : 'bg-green-800 text-green-100'}`}>
          {currentStatus}
        </div>
      </div>
    </header>
  );
};

export default Header;
