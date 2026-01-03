# Modbus Gateway - Professional Web Application

## Architecture
- **Backend**: FastAPI (Python) - REST API + WebSocket + Modbus Gateway
- **Frontend**: React - Real-time Dashboard
- **Features**: Device management, live monitoring, automatic offset calculation

## Installation

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```
Backend runs on: http://localhost:8000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## Quick Start with Simulator

### Test Environment (4 devices)
```bash
# Terminal 1 - Start simulator
cd backend
python simulator.py

# Terminal 2 - Start gateway
cd backend
python run.py

# Terminal 3 - Start frontend
cd frontend
npm start
```

### Production Environment (33 devices)
```bash
# Terminal 1 - Start production simulator
cd backend
python simulator_production.py

# Terminal 2 - Start gateway (uses devices.json)
cd backend
python run.py

# Terminal 3 - Start frontend
cd frontend
npm start
```

## Usage

1. **Access Dashboard**: Open http://localhost:3000
2. **Manage Devices**: Click "Devices" to add/edit/delete devices
3. **Monitor**: Dashboard shows real-time data from all devices
4. **Modbus Server**: Gateway exposes unified registers on port 502

## Device Types

### OEE (4 registers)
- **available_status**: Start/Stop flag (0=Stop, 1=Start)
- **meters_hsc**: High Speed Counter (0-65535)
- **new_output_flag**: Output flag (0/1)
- **start_of_production**: Production flag (0/1)

### Power Meter (26 registers - 13 float32)
- **kwh**: Energy consumption
- **v1, v2, v3**: Phase voltages (220-240V)
- **v12, v23, v13**: Line voltages (380-400V)
- **a1, a2, a3, a_avg**: Currents (0-100A)
- **freq_hz**: Frequency (49.5-50.5 Hz)
- **p_total_kw**: Total power (0-50 kW)

### Scale (1 register)
- **weight**: Weight value (0-50000)

## Automatic Offset Calculation

Offsets are calculated automatically based on device type:
- OEE: 4 registers
- PM: 26 registers
- Scale: 1 register

Example:
- Device 1 (OEE): offset 0-3
- Device 2 (PM): offset 4-29
- Device 3 (Scale): offset 30
- Device 4 (OEE): offset 31-34

## API Endpoints

- GET /api/devices - List all devices
- POST /api/devices - Add device (offset auto-calculated)
- PUT /api/devices/{name} - Update device
- DELETE /api/devices/{name} - Delete device
- GET /api/data - Get all device data
- WS /api/ws - WebSocket for real-time updates

## Production Deployment

### Windows Service
Use NSSM to run as service:
```bash
nssm install ModbusGateway "C:\Python\python.exe" "C:\path\to\backend\run.py"
```

### Docker
```bash
docker-compose up -d
```

## Configuration

Edit `backend/.env` to customize:
- SERVER_PORT: Modbus TCP port (default: 502)
- API_PORT: REST API port (default: 8000)
- SCAN_INTERVAL_SEC: Polling interval (default: 1.0)

## Security

- Restrict port 502 to trusted networks
- Use firewall rules for API access
- Consider adding authentication for production
- Use HTTPS for web interface in production
