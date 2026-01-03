import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

function PMParamsEditor({ deviceName, currentParams, onSave, onCancel }) {
  const [params, setParams] = useState([]);
  
  useEffect(() => {
    if (currentParams) {
      setParams(currentParams);
    } else {
      axios.get(`${API}/pm-defaults`).then(res => setParams(res.data.params));
    }
  }, [currentParams]);

  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index] = field === 'name' 
      ? [value, newParams[index][1]] 
      : [newParams[index][0], parseInt(value)];
    setParams(newParams);
  };

  const input = { padding: '6px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
        <h3>Configure PM Parameters for {deviceName}</h3>
        <div style={{ marginBottom: '16px' }}>
          {params.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <input style={input} value={p[0]} onChange={e => updateParam(i, 'name', e.target.value)} placeholder="Name" />
              <input style={input} type="number" value={p[1]} onChange={e => updateParam(i, 'addr', e.target.value)} placeholder="Address" />
            </div>
          ))}
        </div>
        <div>
          <button onClick={() => onSave(params)} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Save</button>
          <button onClick={onCancel} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default PMParamsEditor;
