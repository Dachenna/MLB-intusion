import React from 'react';

const Footer = ({ result }) => {
  const text = result ? `[${new Date().toLocaleTimeString()}] Status: ${result.status} | Type: ${result.attack_type} | Confidence: ${(result.confidence * 100).toFixed(1)}%` : 'Waiting for first classification...';
  const isAlert = result && result.status === 'ALERT';
  return (
    <div className={`p-4 rounded-lg ${isAlert ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
      <div className="text-sm font-mono">{text}</div>
    </div>
  );
};

export default Footer;
