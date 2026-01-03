# Modbus Gateway - Simulator Guide

Complete guide for using the Modbus device simulators for testing and development.

## Overview

The Modbus Gateway includes two simulators for testing:

- **Test Simulator** (`simulator.py`) - 4 devices for basic testing

- **Production Simulator** (`simulator_production.py`) - 33 devices for production testing

## Test Simulator

### Features

- **4 Simulated Devices:**
  - 1 OEE device
  - 1 Power Meter
  - 1 Scale
  - 1 Additional OEE device

- **Automatic Data Generation:**
  - Realistic value ranges
  - Periodic updates
  - Random variations

### Usage

```bash
cd backend
python simulator.py
```

### Device Configuration

| Device | Type | IP | Port | Slave ID | Description |
|--------|------|----|----- |----------|-------------|
| OEE_Line1 | oee | 127.0.0.1 | 5020 | 1 | Production line 1 |
| PM_Main | pm | 127.0.0.1 | 5021 | 1 | Main power meter |
| Scale_Warehouse | scale | 127.0.0.1 | 5022 | 1 | Warehouse scale |
| OEE_Line2 | oee | 127.0.0.1 | 5023 | 1 | Production line 2 |

### Data Patterns

**OEE Devices:**
- Status alternates between Start (1) and Stop (0)
- Counter increments when running
- Flags change randomly

**Power Meter:**
- Voltages: 220-240V (phases), 380-400V (lines)
- Currents: 10-50A with variations
- Power: Calculated from V×I
- Frequency: 49.8-50.2 Hz

**Scale:**
- Weight: 0-1000 kg with random changes
- Simulates loading/unloading cycles

## Production Simulator

### Features

- **33 Simulated Devices:**
  - 11 OEE devices (production lines)
  - 11 Power Meters (electrical monitoring)
  - 11 Scales (material handling)

- **Realistic Factory Environment:**
  - Multiple production lines
  - Distributed IP addresses
  - Varied update patterns

### Usage

```bash
cd backend
python simulator_production.py
```

### Device Layout

**OEE Devices (Lines 1-11):**
- IPs: 192.168.1.101 - 192.168.1.111
- Ports: 502
- Slave IDs: 1

**Power Meters (PM 1-11):**
- IPs: 192.168.1.121 - 192.168.1.131
- Ports: 502
- Slave IDs: 1

**Scales (Scale 1-11):**
- IPs: 192.168.1.141 - 192.168.1.151
- Ports: 502
- Slave IDs: 1

### Production Scenarios

**Shift Patterns:**
- Morning shift: High activity (7 AM - 3 PM)
- Evening shift: Medium activity (3 PM - 11 PM)
- Night shift: Low activity (11 PM - 7 AM)

**Line Variations:**
- Lines 1-4: High-speed production
- Lines 5-8: Medium-speed production
- Lines 9-11: Batch processing

## Simulator Architecture

### Core Components

```python
class ModbusSimulator:
    def __init__(self, port, device_type):
        self.port = port
        self.device_type = device_type
        self.data_store = {}
        
    async def start_server(self):
        # Start Modbus TCP server
        
    def update_data(self):
        # Generate realistic data
```

### Data Generation

**OEE Data Generation:**
```python
def generate_oee_data():
    return {
        'available_status': random.choice([0, 1]),
        'meters_hsc': random.randint(0, 65535),
        'new_output_flag': random.choice([0, 1]),
        'start_of_production': random.choice([0, 1])
    }
```

**Power Meter Data Generation:**
```python
def generate_pm_data():
    base_voltage = 230
    base_current = 25
    return {
        'v1': base_voltage + random.uniform(-10, 10),
        'v2': base_voltage + random.uniform(-10, 10),
        'v3': base_voltage + random.uniform(-10, 10),
        'a1': base_current + random.uniform(-15, 15),
        # ... more parameters
    }
```

**Scale Data Generation:**
```python
def generate_scale_data():
    return {
        'weight': random.randint(0, 50000)
    }
```

## Testing Scenarios

### Basic Connectivity Test

1. **Start Test Simulator:**
   ```bash
   python simulator.py
   ```

2. **Start Gateway:**
   ```bash
   python run.py
   ```

3. **Verify Connections:**
   - Check web interface at http://localhost:8000
   - All 4 devices should show as online
   - Data should update every second

### Load Testing

1. **Start Production Simulator:**
   ```bash
   python simulator_production.py
   ```

2. **Monitor Performance:**
   - CPU usage should remain low
   - Memory usage should be stable
   - All 33 devices should be responsive

### Network Simulation

**Simulate Network Issues:**
```python
# Add delays to simulate network latency
await asyncio.sleep(random.uniform(0.1, 0.5))

# Simulate connection failures
if random.random() < 0.05:  # 5% failure rate
    raise ConnectionError("Simulated network failure")
```

## Custom Simulators

### Creating Custom Device Types

```python
class CustomDeviceSimulator(ModbusSimulator):
    def __init__(self, port):
        super().__init__(port, "custom")
        
    def generate_data(self):
        # Custom data generation logic
        return {
            'custom_param1': random.randint(0, 100),
            'custom_param2': random.uniform(0.0, 10.0)
        }
```

### Adding New Devices

1. **Define Device Parameters:**
   ```python
   CUSTOM_DEVICE = {
       'name': 'Custom_Device',
       'type': 'custom',
       'ip': '127.0.0.1',
       'port': 5030,
       'slave_id': 1,
       'registers': 5  # Number of registers
   }
   ```

2. **Implement Data Generation:**
   ```python
   def update_custom_device(self):
       # Generate custom data
       data = self.generate_custom_data()
       # Update Modbus registers
       self.update_registers(data)
   ```

## Troubleshooting

### Common Issues

**Simulator Won't Start:**

- Check if ports are available
- Verify Python dependencies
- Check for firewall blocking

**Gateway Can't Connect:**

- Verify IP addresses and ports
- Check simulator is running
- Test with Modbus client tool

**Performance Issues:**

- Reduce update frequency
- Limit number of devices
- Check system resources

### Debug Mode

Enable debug logging in simulators:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Network Testing

```bash
# Test simulator connectivity
telnet 127.0.0.1 5020
telnet 192.168.1.101 502

# Check port usage
netstat -an | findstr :5020
netstat -an | findstr :502
```

## Integration Testing

### End-to-End Test

1. **Start Production Simulator:**
   ```bash
   python simulator_production.py
   ```

2. **Start Gateway:**
   ```bash
   python run.py
   ```

3. **Start Frontend:**
   ```bash
   cd ../frontend
   npm start
   ```

4. **Verify Full Stack:**
   - All devices visible in web interface
   - Real-time data updates
   - Device management functions work
   - Modbus server responds on port 502

### API Testing

```bash
# Test device list
curl http://localhost:8000/api/devices

# Test data endpoint
curl http://localhost:8000/api/data

# Test WebSocket (using wscat)
wscat -c ws://localhost:8000/api/ws
```

### SCADA Integration Test

```python
# Test with pymodbus client
from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient('localhost', port=502)
client.connect()

# Read OEE data (offset 0-3)
result = client.read_holding_registers(0, 4, slave=1)
print(f"OEE Data: {result.registers}")

# Read PM data (offset 4-29)
result = client.read_holding_registers(4, 26, slave=1)
print(f"PM Data: {result.registers}")

client.close()
```

## Performance Benchmarks

### Expected Performance

**Test Simulator (4 devices):**
- CPU Usage: <1%
- Memory Usage: ~20MB
- Response Time: <10ms

**Production Simulator (33 devices):**
- CPU Usage: <5%
- Memory Usage: ~50MB
- Response Time: <50ms

### Monitoring

```python
import psutil
import time

def monitor_performance():
    process = psutil.Process()
    while True:
        cpu_percent = process.cpu_percent()
        memory_mb = process.memory_info().rss / 1024 / 1024
        print(f"CPU: {cpu_percent}%, Memory: {memory_mb:.1f}MB")
        time.sleep(5)
```

## Best Practices

### Development

- Use test simulator for initial development

- Test with production simulator before deployment

- Monitor resource usage during testing

- Implement proper error handling

### Testing

- Test network failure scenarios

- Verify data consistency

- Check memory leaks during long runs

- Test concurrent connections

### Deployment

- Use production simulator for system testing

- Validate performance under load

- Test failover scenarios

- Document test procedures

---

*For additional simulator features or custom device types, please refer to the source code or contact the development team.*