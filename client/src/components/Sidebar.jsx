import React from 'react';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-black/60 backdrop-blur-lg p-6 z-20 border-r border-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-400">IDS <span className="text-red-500">Monitor</span></h1>
        <p className="text-xs text-gray-400 mt-1">Real-time intrusion detection</p>
      </div>

      <nav className="space-y-2 mt-6">
        <a className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 text-blue-300 font-semibold" href="#">Dashboard</a>
        <a className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-blue-300" href="#">Attack Logs</a>
        <a className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-blue-300" href="#">Settings</a>
      </nav>

      <div className="mt-auto text-xs text-gray-500 pt-6 border-t border-gray-800">
        Version 0.1 • Local
      </div>
    </aside>
  );
};

export default Sidebar;
