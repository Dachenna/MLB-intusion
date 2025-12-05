import React, { useReducer } from 'react';
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
  const initialState = {
    feature1: 5.1,
    result: null,
    loading: false,
    trafficCount: 1245,
    totalAlerts: 15,
    attackLogs: [
      { id: 1, timestamp: new Date(Date.now() - 60000), status: 'NORMAL', type: 'NORMAL_TRAFFIC', confidence: 0.95 },
      { id: 2, timestamp: new Date(Date.now() - 120000), status: 'ALERT', type: 'PORT_SCAN', confidence: 0.88 },
      { id: 3, timestamp: new Date(Date.now() - 180000), status: 'ALERT', type: 'DDOS_ATTEMPT', confidence: 0.91 },
    ],
    trafficHistory: [
      { time: '00:00', count: 1100, alerts: 12 },
      { time: '04:00', count: 1200, alerts: 14 },
      { time: '08:00', count: 1245, alerts: 15 },
    ],
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_FEATURE1':
        return { ...state, feature1: action.payload };
      case 'SET_RESULT':
        return { ...state, result: action.payload };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'INCREMENT_TRAFFIC':
        return { ...state, trafficCount: state.trafficCount + (action.payload || 1) };
      case 'INCREMENT_ALERTS':
        return { ...state, totalAlerts: state.totalAlerts + (action.payload || 1) };
      case 'ADD_LOG':
        return { ...state, attackLogs: [action.payload, ...state.attackLogs] };
      case 'SET_TRAFFIC_HISTORY':
        return { ...state, trafficHistory: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { feature1, result, loading, trafficCount, totalAlerts, attackLogs, trafficHistory } = state;

  const predictTraffic = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_RESULT', payload: null });
    dispatch({ type: 'INCREMENT_TRAFFIC' });

    const featuresToSend = [
      parseFloat(feature1),
      5.1,
      1.4,
      0.2
    ];

    try {
      const response = await axios.post(API_URL, { features: featuresToSend });
      dispatch({ type: 'SET_RESULT', payload: response.data });
      const newLog = {
        id: attackLogs.length + 1,
        timestamp: new Date(),
        status: response.data.status,
        type: response.data.attack_type || 'NORMAL_TRAFFIC',
        confidence: response.data.confidence || 0,
      };
      dispatch({ type: 'ADD_LOG', payload: newLog });
      if (response.data.status === 'ALERT') dispatch({ type: 'INCREMENT_ALERTS' });
    } catch (error) {
      console.error('Prediction failed:', error.response ? error.response.data : error.message);
      dispatch({ type: 'SET_RESULT', payload: { status: 'ERROR', message: 'API communication error.' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const currentStatus = result ? result.status : 'UNKNOWN';

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black text-white font-sans">
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
            <ControlPanel feature1={feature1} onChangeFeature1={(v) => dispatch({ type: 'SET_FEATURE1', payload: parseFloat(v) })} onPredict={predictTraffic} loading={loading} />
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
