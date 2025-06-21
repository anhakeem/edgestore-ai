// apps/web/src/app/admin/alerts/page.tsx

'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Alert {
  sessionId: string;
  type: string;
  timestamp: string;
}

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://edgestore-api.fly.dev/admin/alerts')
      .then(res => setAlerts(res.data.alerts || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  const typeColor = (type: string) => {
    if (type.includes('CHURN')) return 'bg-red-600';
    if (type.includes('CONVERSION')) return 'bg-green-600';
    if (type.includes('DORMANT')) return 'bg-yellow-600';
    return 'bg-slate-600';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-cyan-300">⚠ Trigger Alerts Dashboard</h1>
      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-gray-500">No alerts yet.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.slice().reverse().map((alert, i) => (
            <li key={i} className={`p-4 rounded-lg shadow-md ${typeColor(alert.type)}`}>
              <p className="font-bold">🚨 {alert.type}</p>
              <p><strong>Session:</strong> {alert.sessionId}</p>
              <p><strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertsPage;
