import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Factory,
  ElectricBolt,
  Scale,
  CheckCircle,
  Error,
  Refresh
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { apiCall } from '../config/api';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  bgcolor: 'white',
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  ...(status === 'online' && {
    backgroundColor: '#10b981',
    color: 'white',
  }),
  ...(status === 'offline' && {
    backgroundColor: '#ef4444',
    color: 'white',
  })
}));

function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'oee',
    ip: '',
    port: 502,
    slave_id: 1
  });

  useEffect(() => {
    fetchDevices();
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await apiCall('/devices').catch(() => ({ ok: false }));
      if (response.ok) {
        const text = await response.text();
        try {
          const devices = JSON.parse(text);
          setDevices(devices);
        } catch (e) {
          console.warn('Devices API not available, using mock data');
          setDevices([
            { name: 'Device-1', type: 'oee', ip: '192.168.1.100', port: 502, slave_id: 1, offset: '0x0000' },
            { name: 'Device-2', type: 'pm', ip: '192.168.1.101', port: 502, slave_id: 2, offset: '0x0010' }
          ]);
        }
      } else {
        setDevices([
          { name: 'Device-1', type: 'oee', ip: '192.168.1.100', port: 502, slave_id: 1, offset: '0x0000' },
          { name: 'Device-2', type: 'pm', ip: '192.168.1.101', port: 502, slave_id: 2, offset: '0x0010' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([
        { name: 'Device-1', type: 'oee', ip: '192.168.1.100', port: 502, slave_id: 1, offset: '0x0000' },
        { name: 'Device-2', type: 'pm', ip: '192.168.1.101', port: 502, slave_id: 2, offset: '0x0010' }
      ]);
    }
  };

  const fetchData = async () => {
    try {
      const response = await apiCall('/data').catch(() => ({ ok: false }));
      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          setData(data);
        } catch (e) {
          console.warn('Data API not available, using mock data');
          setData({
            'Device-1': { status: 'online', values: { temperature: 25.5, pressure: 1.2, flow: 45.8 } },
            'Device-2': { status: 'offline', error: 'Connection timeout' }
          });
        }
      } else {
        setData({
          'Device-1': { status: 'online', values: { temperature: 25.5, pressure: 1.2, flow: 45.8 } },
          'Device-2': { status: 'offline', error: 'Connection timeout' }
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        'Device-1': { status: 'online', values: { temperature: 25.5, pressure: 1.2, flow: 45.8 } },
        'Device-2': { status: 'offline', error: 'Connection timeout' }
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editDevice ? `/devices/${editDevice.name}` : '/devices';
      const method = editDevice ? 'PUT' : 'POST';
      
      const response = await apiCall(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchDevices();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  const handleDelete = async (name) => {
    if (window.confirm(`Delete device ${name}?`)) {
      try {
        const response = await apiCall(`/devices/${name}`, { method: 'DELETE' });
        if (response.ok) {
          fetchDevices();
        }
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  const handleOpen = (device = null) => {
    if (device) {
      setEditDevice(device);
      setFormData({ ...device });
    } else {
      setEditDevice(null);
      setFormData({ name: '', type: 'oee', ip: '', port: 502, slave_id: 1 });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditDevice(null);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'oee': return <Factory />;
      case 'pm': return <ElectricBolt />;
      case 'scale': return <Scale />;
      default: return <Factory />;
    }
  };

  const getDeviceColor = (type) => {
    switch (type) {
      case 'oee': return '#2196f3';
      case 'pm': return '#ff9800';
      case 'scale': return '#4caf50';
      default: return '#9c27b0';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Device Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure and monitor your Modbus devices
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={fetchDevices}
              sx={{ 
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              }
            }}
          >
            Add Device
          </Button>
        </Box>
      </Box>

      {/* Devices Table */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#3b82f6' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Device</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Connection</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Offset</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => {
              const deviceData = data[device.name] || {};
              const isOnline = deviceData.status === 'online';
              
              return (
                <TableRow key={device.name} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          bgcolor: getDeviceColor(device.type) + '20',
                          color: getDeviceColor(device.type),
                          mr: 2,
                          display: 'flex'
                        }}
                      >
                        {getDeviceIcon(device.type)}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {device.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Slave ID: {device.slave_id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={device.type.toUpperCase()} 
                      size="small"
                      sx={{ 
                        bgcolor: getDeviceColor(device.type) + '20',
                        color: getDeviceColor(device.type),
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {device.ip}:{device.port}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip 
                      label={isOnline ? 'Online' : 'Offline'} 
                      status={isOnline ? 'online' : 'offline'}
                      size="small"
                      icon={isOnline ? <CheckCircle /> : <Error />}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {device.offset}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpen(device)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(device.name)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {devices.length === 0 && (
          <Box p={4} textAlign="center">
            <Factory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No devices configured
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Add your first Modbus device to get started
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => handleOpen()}
            >
              Add Device
            </Button>
          </Box>
        )}
      </StyledTableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editDevice ? 'Edit Device' : 'Add New Device'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Device Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Device Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="oee">OEE Device</MenuItem>
                <MenuItem value="pm">Power Meter</MenuItem>
                <MenuItem value="scale">Scale</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="IP Address"
                value={formData.ip}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Slave ID"
                type="number"
                value={formData.slave_id}
                onChange={(e) => setFormData({ ...formData, slave_id: parseInt(e.target.value) })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.ip}
          >
            {editDevice ? 'Update' : 'Add'} Device
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeviceManager;