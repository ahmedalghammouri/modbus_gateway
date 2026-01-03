import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DeviceManager from './components/DeviceManager';

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#e0e0e0' }}>
      <nav style={{ background: '#2a2a2a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #3a3a3a' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Modbus Gateway</h1>
        <div>
          <button onClick={() => setView('dashboard')} style={{ padding: '0.5rem 1rem', background: view === 'dashboard' ? '#4a90e2' : '#3a3a3a', color: 'white', border: 'none', borderRadius: '4px', marginRight: '0.5rem', cursor: 'pointer' }}>Dashboard</button>
          <button onClick={() => setView('manager')} style={{ padding: '0.5rem 1rem', background: view === 'manager' ? '#4a90e2' : '#3a3a3a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Devices</button>
        </div>
      </nav>
      <div style={{ padding: '1.5rem' }}>
        {view === 'dashboard' ? <Dashboard /> : <DeviceManager />}
      </div>
    </div>
  );
}

export default App;
