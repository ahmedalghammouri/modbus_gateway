import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PMParamsEditor from './PMParamsEditor';

const API = `http://${window.location.hostname}:8000/api`;

function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ name: '', ip: '', port: 502, slave_id: 1, type: 'oee', offset: 0, pm_params: null });
  const [editing, setEditing] = useState(null);
  const [showPMEditor, setShowPMEditor] = useState(false);

  useEffect(() => { loadDevices(); }, []);

  const loadDevices = async () => {
    const res = await axios.get(`${API}/devices`);
    setDevices(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API}/devices/${editing}`, form);
      setEditing(null);
    } else {
      await axios.post(`${API}/devices`, form);
    }
    setForm({ name: '', ip: '', port: 502, slave_id: 1, type: 'oee', offset: 0, pm_params: null });
    loadDevices();
  };

  const handleDelete = async (name) => {
    if (window.confirm(`Delete ${name}?`)) {
      await axios.delete(`${API}/devices/${name}`);
      loadDevices();
    }
  };

  const handleEdit = (d) => {
    setForm(d);
    setEditing(d.name);
  };

  const handlePMParamsSave = (params) => {
    setForm({...form, pm_params: params});
    setShowPMEditor(false);
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Device Manager</h2>
      
      <form onSubmit={handleSubmit} style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #3a3a3a' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input style={{ padding: '0.5rem', border: '1px solid #3a3a3a', borderRadius: '4px', background: '#2a2a2a', color: '#e0e0e0' }} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={{ padding: '0.5rem', border: '1px solid #3a3a3a', borderRadius: '4px', background: '#2a2a2a', color: '#e0e0e0' }} placeholder="IP" value={form.ip} onChange={e => setForm({...form, ip: e.target.value})} required />
          <input style={{ padding: '0.5rem', border: '1px solid #3a3a3a', borderRadius: '4px', background: '#2a2a2a', color: '#e0e0e0' }} type="number" placeholder="Port" value={form.port} onChange={e => setForm({...form, port: parseInt(e.target.value)})} required />
          <input style={{ padding: '0.5rem', border: '1px solid #3a3a3a', borderRadius: '4px', background: '#2a2a2a', color: '#e0e0e0' }} type="number" placeholder="Slave ID" value={form.slave_id} onChange={e => setForm({...form, slave_id: parseInt(e.target.value)})} required />
          <select style={{ padding: '0.5rem', border: '1px solid #3a3a3a', borderRadius: '4px', background: '#2a2a2a', color: '#e0e0e0' }} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="oee">OEE</option>
            <option value="pm">Power Meter</option>
            <option value="scale">Scale</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', ip: '', port: 502, slave_id: 1, type: 'oee', offset: 0, pm_params: null }); }} style={{ padding: '0.5rem 1rem', background: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
          {form.type === 'pm' && <button type="button" onClick={() => setShowPMEditor(true)} style={{ padding: '0.5rem 1rem', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>PM Config</button>}
        </div>
      </form>

      {showPMEditor && (
        <PMParamsEditor 
          deviceName={form.name || 'New Device'}
          currentParams={form.pm_params}
          onSave={handlePMParamsSave}
          onCancel={() => setShowPMEditor(false)}
        />
      )}

      <div style={{ background: '#2a2a2a', borderRadius: '4px', overflow: 'hidden', border: '1px solid #3a3a3a' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#4a90e2' }}>
              {['Name', 'IP', 'Port', 'Slave', 'Type', 'Offset', 'PM', 'Actions'].map(h => 
                <th key={h} style={{ padding: '0.5rem', textAlign: 'left', color: 'white', fontSize: '0.9rem' }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {devices.map((d, i) => (
              <tr key={d.name} style={{ background: i % 2 === 0 ? '#1a1a1a' : '#2a2a2a', borderBottom: '1px solid #3a3a3a' }}>
                <td style={{ padding: '0.5rem', color: '#e0e0e0' }}>{d.name}</td>
                <td style={{ padding: '0.5rem', color: '#bbb' }}>{d.ip}</td>
                <td style={{ padding: '0.5rem', color: '#bbb' }}>{d.port}</td>
                <td style={{ padding: '0.5rem', color: '#bbb' }}>{d.slave_id}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', background: d.type === 'oee' ? '#4a90e2' : d.type === 'pm' ? '#ff9800' : '#4caf50', color: 'white' }}>{d.type}</span>
                </td>
                <td style={{ padding: '0.5rem', color: '#bbb' }}>{d.offset}</td>
                <td style={{ padding: '0.5rem', color: '#bbb' }}>{d.type === 'pm' ? (d.pm_params ? 'Custom' : 'Default') : '-'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button onClick={() => handleEdit(d)} style={{ padding: '0.3rem 0.6rem', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.3rem' }}>Edit</button>
                  <button onClick={() => handleDelete(d.name)} style={{ padding: '0.3rem 0.6rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeviceManager;
