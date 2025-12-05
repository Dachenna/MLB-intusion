import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DataCard from './components/DataCard';
import ControlPanel from './components/ControlPanel';
import Visualization from './components/Visualization';
import AlertBanner from './components/AlertBanner';
import Footer from './components/Footer';
import AttackLogTable from './components/AttackLogTable';

const API_URL = 'http://localhost:5000/api/predict';

function App() {
  const [feature1, setFeature1] = useState(5.1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trafficCount, setTrafficCount] = useState(1245);
  const [totalAlerts, setTotalAlerts] = useState(15);
  const [attackLogs, setAttackLogs] = useState([
    { id: 1, timestamp: new Date(Date.now() - 60000), status: 'NORMAL', type: 'NORMAL_TRAFFIC', confidence: 0.95 },
    { id: 2, timestamp: new Date(Date.now() - 120000), status: 'ALERT', type: 'PORT_SCAN', confidence: 0.88 },
    { id: 3, timestamp: new Date(Date.now() - 180000), status: 'ALERT', type: 'DDOS_ATTEMPT', confidence: 0.91 },
  ]);
  const [trafficHistory, setTrafficHistory] = useState([
    { time: '00:00', count: 1100, alerts: 12 },
    { time: '04:00', count: 1200, alerts: 14 },
    { time: '08:00', count: 1245, alerts: 15 },
  ]);

  const predictTraffic = async () => {
    setLoading(true);
    setResult(null);
    setTrafficCount(prev => prev + 1);

    const featuresToSend = [
      parseFloat(feature1),
      5.1,
      1.4,
      0.2
    ];

    try {
      const response = await axios.post(API_URL, { features: featuresToSend });
      setResult(response.data);
      if (response.data.status === 'ALERT') {
        setTotalAlerts(prev => prev + 1);
        setAttackLogs(prev => [{
          id: prev.length + 1,
          timestamp: new Date(),
          status: response.data.status,
          type: response.data.attack_type,
          confidence: response.data.confidence
        }, ...prev]);
      } else {
        setAttackLogs(prev => [{
          id: prev.length + 1,
          timestamp: new Date(),
          status: response.data.status,
          type: response.data.attack_type || 'NORMAL_TRAFFIC',
          confidence: response.data.confidence
        }, ...prev]);
      }
    } catch (error) {
      console.error('Prediction failed:', error.response ? error.response.data : error.message);
      setResult({ status: 'ERROR', message: 'API communication error.' });
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = result ? result.status : 'UNKNOWN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white font-sans">
      <Sidebar />
      <main className="ml-64 p-8">
        <Header currentStatus={currentStatus} />

        <AlertBanner result={result} />

        <section className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <DataCard title="Total Traffic Flows" value={trafficCount} unit="count" color="text-blue-400" />
          <DataCard title="Alerts This Session" value={totalAlerts} unit="alerts" color="text-red-400" />
          <DataCard title="Classification Status" value={currentStatus} unit="" color={currentStatus === 'ALERT' ? 'text-red-400' : 'text-green-400'} />
          <DataCard title="Network Latency" value="12" unit="ms" color="text-green-400" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ControlPanel feature1={feature1} setFeature1={setFeature1} onPredict={predictTraffic} loading={loading} />
          </div>
          <div className="lg:col-span-2">
            <Visualization result={result} trafficHistory={trafficHistory} />
          </div>
        </div>

        <AttackLogTable logs={attackLogs} />

        <Footer result={result} />
      </main>
    </div>
  );
}

export default App;
