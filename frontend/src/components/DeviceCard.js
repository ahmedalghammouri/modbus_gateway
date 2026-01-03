import React from 'react';

function DeviceCard({ name, data }) {
  const online = data.status === 'online';
  
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: online ? '#f0f9ff' : '#fff1f2' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>{name}</h3>
        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                       backgroundColor: online ? '#22c55e' : '#ef4444', color: 'white' }}>
          {online ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>
      
      {data.values && (
        <div style={{ fontSize: '14px' }}>
          {Object.entries(data.values).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ fontWeight: '500' }}>{key.toUpperCase()}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
      
      {data.error && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px' }}>Error: {data.error}</div>}
      
      <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
        Last update: {new Date(data.timestamp * 1000).toLocaleTimeString()}
      </div>
    </div>
  );
}

export default DeviceCard;
