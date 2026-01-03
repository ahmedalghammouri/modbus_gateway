import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DeviceManager from './components/DeviceManager';

function App() {
  const [view, setView] = useState('dashboard');
  const nav = { backgroundColor: '#1e40af', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between' };
  const btn = (active) => ({ padding: '8px 16px', backgroundColor: active ? '#3b82f6' : 'transparent', 
                              color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav style={nav}>
        <h1 style={{ margin: 0 }}>Modbus Gateway</h1>
        <div>
          <button onClick={() => setView('dashboard')} style={btn(view === 'dashboard')}>Dashboard</button>
          <button onClick={() => setView('manager')} style={btn(view === 'manager')}>Devices</button>
        </div>
      </nav>
      {view === 'dashboard' ? <Dashboard /> : <DeviceManager />}
    </div>
  );
}

export default App;
