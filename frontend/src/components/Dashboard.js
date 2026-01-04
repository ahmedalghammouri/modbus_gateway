import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Divider
} from '@mui/material';
import {
  Speed,
  ElectricBolt,
  Scale,
  CheckCircle,
  Error,
  Refresh,
  TrendingUp,
  Factory,
  FilterList,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { apiCall } from '../config/api';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  color: 'white',
  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
}));

const MetricCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  }
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

function Dashboard() {
  const [data, setData] = useState({});
  const [devices, setDevices] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [showAllDevices, setShowAllDevices] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, devicesRes] = await Promise.all([
          apiCall('/data').catch(() => ({ ok: false })),
          apiCall('/devices').catch(() => ({ ok: false }))
        ]);
        
        if (dataRes.ok) {
          const dataText = await dataRes.text();
          try {
            const dataJson = JSON.parse(dataText);
            setData(dataJson);
          } catch (e) {
            console.warn('API not available, using mock data');
            setData({
              'Device-1': { status: 'online', values: { temperature: 25.5, pressure: 1.2, flow: 45.8, voltage: 220, current: 15.2 } },
              'Device-2': { status: 'offline', error: 'Connection timeout' }
            });
          }
        } else {
          setData({
            'Device-1': { status: 'online', values: { temperature: 25.5, pressure: 1.2, flow: 45.8, voltage: 220, current: 15.2 } },
            'Device-2': { status: 'offline', error: 'Connection timeout' }
          });
        }
        
        if (devicesRes.ok) {
          const devicesText = await devicesRes.text();
          try {
            const devicesJson = JSON.parse(devicesText);
            setDevices(devicesJson);
          } catch (e) {
            console.warn('Devices API not available, using mock data');
            setDevices([
              { name: 'Device-1', type: 'oee', ip: '192.168.1.100', port: 502, slave_id: 1 },
              { name: 'Device-2', type: 'pm', ip: '192.168.1.101', port: 502, slave_id: 2 }
            ]);
          }
        } else {
          setDevices([
            { name: 'Device-1', type: 'oee', ip: '192.168.1.100', port: 502, slave_id: 1, offset: '0x0000' },
            { name: 'Device-2', type: 'pm', ip: '192.168.1.101', port: 502, slave_id: 2, offset: '0x0010' }
          ]);
        }
        
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching data:', error);
        setData({
          'Device-1': { status: 'online', values: { temperature: 25.5, pressure: 1.2, flow: 45.8, voltage: 220, current: 15.2 } },
          'Device-2': { status: 'offline', error: 'Connection timeout' }
        });
        setDevices([
          { name: 'Device-1', type: 'oee', ip: '192.168.1.100', port: 502, slave_id: 1, offset: '0x0000' },
          { name: 'Device-2', type: 'pm', ip: '192.168.1.101', port: 502, slave_id: 2, offset: '0x0010' }
        ]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (devices.length > 0 && selectedDevices.length === 0) {
      setSelectedDevices(devices.map(d => d.name));
    }
  }, [devices]);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'oee': return <Factory />;
      case 'pm': return <ElectricBolt />;
      case 'scale': return <Scale />;
      default: return <Speed />;
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

  const handleDeviceSelection = (event) => {
    const value = event.target.value;
    setSelectedDevices(typeof value === 'string' ? value.split(',') : value);
  };

  const toggleShowAll = () => {
    setShowAllDevices(!showAllDevices);
    if (!showAllDevices) {
      setSelectedDevices(devices.map(d => d.name));
    }
  };

  const filteredDevices = showAllDevices ? devices : devices.filter(d => selectedDevices.includes(d.name));
  const onlineDevices = Object.values(data).filter(d => d.status === 'online').length;
  const totalDevices = devices.length;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            System Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time monitoring of industrial devices
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Toggle View">
            <IconButton 
              onClick={toggleShowAll}
              sx={{ 
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              {showAllDevices ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={() => window.location.reload()}
              sx={{ 
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Device Filter */}
      {!showAllDevices && (
        <Box mb={3}>
          <FormControl sx={{ minWidth: 300, maxWidth: 400 }}>
            <InputLabel sx={{ color: '#64748b' }}>Select Devices</InputLabel>
            <Select
              multiple
              value={selectedDevices}
              onChange={handleDeviceSelection}
              input={<OutlinedInput label="Select Devices" />}
              renderValue={(selected) => 
                selected.length > 2 
                  ? `${selected.length} devices selected`
                  : selected.join(', ')
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 350,
                    borderRadius: 12,
                    marginTop: 8,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  },
                },
              }}
              sx={{
                borderRadius: 2,
                bgcolor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
              }}
            >
              {devices.map((device) => (
                <MenuItem 
                  key={device.name} 
                  value={device.name}
                  sx={{
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    },
                  }}
                >
                  <Checkbox 
                    checked={selectedDevices.indexOf(device.name) > -1}
                    sx={{
                      color: '#3b82f6',
                      '&.Mui-checked': {
                        color: '#3b82f6',
                      },
                    }}
                  />
                  <ListItemText 
                    primary={device.name}
                    secondary={`${device.type.toUpperCase()} • ${device.ip}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {totalDevices}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Devices
                  </Typography>
                </Box>
                <Factory sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {onlineDevices}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Online
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {totalDevices - onlineDevices}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Offline
                  </Typography>
                </Box>
                <Error sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0}%
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Uptime
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={totalDevices > 0 ? (onlineDevices / totalDevices) * 100 : 0}
                sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
              />
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Device Cards */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Device Status
      </Typography>
      
      <Grid container spacing={3}>
        {filteredDevices.map((device) => {
          const deviceData = data[device.name] || {};
          const isOnline = deviceData.status === 'online';
          
          return (
            <Grid item xs={12} sm={6} md={4} key={device.name}>
              <MetricCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 2, 
                          bgcolor: getDeviceColor(device.type) + '20',
                          color: getDeviceColor(device.type),
                          mr: 2
                        }}
                      >
                        {getDeviceIcon(device.type)}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {device.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {device.type.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                    <StatusChip 
                      label={isOnline ? 'Online' : 'Offline'} 
                      status={isOnline ? 'online' : 'offline'}
                      size="small"
                    />
                  </Box>
                  
                  {/* Device Parameters */}
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Connection:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                      <Chip label={`IP: ${device.ip}`} size="small" variant="outlined" />
                      <Chip label={`Port: ${device.port}`} size="small" variant="outlined" />
                      <Chip label={`Slave: ${device.slave_id}`} size="small" variant="outlined" />
                    </Box>
                    {device.offset && (
                      <Chip label={`Offset: ${device.offset}`} size="small" variant="outlined" />
                    )}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {isOnline && deviceData.values ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Live Data:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {Object.entries(deviceData.values).map(([key, value]) => (
                          <Chip 
                            key={key}
                            label={`${key}: ${typeof value === 'number' ? value.toFixed(1) : value}`}
                            size="small"
                            sx={{ 
                              bgcolor: getDeviceColor(device.type) + '20',
                              color: getDeviceColor(device.type),
                              fontWeight: 'bold'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {deviceData.error || 'Device offline'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </MetricCard>
            </Grid>
          );
        })}
      </Grid>
      
      {filteredDevices.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Factory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No devices configured
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Go to the Devices page to add your first device
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Dashboard;