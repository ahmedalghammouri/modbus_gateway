import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ name: '', ip: '', port: 502, slave_id: 1, type: 'oee', offset: 0 });
  const [editing, setEditing] = useState(null);

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
    setForm({ name: '', ip: '', port: 502, slave_id: 1, type: 'oee', offset: 0 });
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

  const input = { padding: '8px', border: '1px solid #ddd', borderRadius: '4px' };
  const btn = { padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Device Manager</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <input style={input} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={input} placeholder="IP" value={form.ip} onChange={e => setForm({...form, ip: e.target.value})} required />
          <input style={input} type="number" placeholder="Port" value={form.port} onChange={e => setForm({...form, port: parseInt(e.target.value)})} required />
          <input style={input} type="number" placeholder="Slave ID" value={form.slave_id} onChange={e => setForm({...form, slave_id: parseInt(e.target.value)})} required />
          <select style={input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="oee">OEE</option>
            <option value="pm">Power Meter</option>
            <option value="scale">Scale</option>
          </select>
          <div style={{...input, backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center'}}>Offset: Auto</div>
        </div>
        <button type="submit" style={{...btn, marginTop: '10px'}}>{editing ? 'Update' : 'Add'} Device</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', ip: '', port: 502, slave_id: 1, type: 'oee', offset: 0 }); }} style={{ marginLeft: '10px', padding: '8px 16px' }}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            {['Name', 'IP', 'Port', 'Slave ID', 'Type', 'Offset', 'Actions'].map(h => 
              <th key={h} style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d.name}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{d.name}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{d.ip}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{d.port}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{d.slave_id}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{d.type}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{d.offset}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <button onClick={() => handleEdit(d)} style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(d.name)} style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeviceManager;
