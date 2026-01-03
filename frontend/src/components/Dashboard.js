import React, { useState, useEffect } from 'react';
import DeviceCard from './DeviceCard';

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/api/ws');
    ws.onmessage = (e) => setData(JSON.parse(e.data));
    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Live Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {Object.entries(data).map(([name, d]) => <DeviceCard key={name} name={name} data={d} />)}
      </div>
      {Object.keys(data).length === 0 && <p>No devices configured. Add devices in the Devices tab.</p>}
    </div>
  );
}

export default Dashboard;
