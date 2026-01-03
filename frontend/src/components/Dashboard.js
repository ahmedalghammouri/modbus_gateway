import React, { useState, useEffect } from 'react';
import DeviceCard from './DeviceCard';

function Dashboard() {
  const [data, setData] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8000/api/ws`);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => setData(JSON.parse(e.data));
    return () => ws.close();
  }, []);

  const devices = Object.entries(data);
  const online = devices.filter(([_, d]) => d.status === 'online').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Dashboard</h2>
        <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', background: connected ? '#4caf50' : '#f44336', color: 'white' }}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        <span style={{ marginLeft: 'auto', color: '#999' }}>Total: {devices.length} | Online: {online} | Offline: {devices.length - online}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {devices.map(([name, d]) => <DeviceCard key={name} name={name} data={d} />)}
      </div>
      {devices.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>No devices configured</p>}
    </div>
  );
}

export default Dashboard;
