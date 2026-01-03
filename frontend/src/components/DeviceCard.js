import React from 'react';

function DeviceCard({ name, data }) {
  const online = data.status === 'online';
  
  return (
    <div style={{ background: '#2a2a2a', borderRadius: '4px', padding: '1rem', border: `2px solid ${online ? '#4caf50' : '#555'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{name}</h3>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: online ? '#4caf50' : '#777' }} />
      </div>
      
      {data.values && (
        <div style={{ background: '#1a1a1a', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
          {Object.entries(data.values).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
              <span style={{ color: '#999' }}>{key}:</span>
              <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
            </div>
          ))}
        </div>
      )}
      
      {data.error && <div style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '0.5rem' }}>{data.error}</div>}
      <div style={{ fontSize: '0.7rem', color: '#777', marginTop: '0.5rem' }}>{new Date(data.timestamp * 1000).toLocaleTimeString()}</div>
    </div>
  );
}

export default DeviceCard;
