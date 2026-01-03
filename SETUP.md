# Modbus Gateway - Setup Guide

Complete setup guide for development and production environments.

## Architecture

- **Backend**: FastAPI (Python) - REST API + WebSocket + Modbus Gateway

- **Frontend**: React - Real-time Dashboard

- **Features**: Device management, live monitoring, automatic offset calculation

## Development Setup

### Prerequisites

- Python 3.12+

- Node.js 18+

- Git

### Backend Setup

1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd modbus_gateway/backend
   ```

2. **Create Virtual Environment:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start Backend:**
   ```bash
   python run.py
   ```

Backend runs on: http://localhost:8000

### Frontend Setup

1. **Navigate to Frontend:**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
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

## Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

### Backend Executable

```bash
cd backend
pyinstaller modbus_gateway.spec
```

### Windows Installer

1. Install NSIS from https://nsis.sourceforge.io/

2. Right-click `installer.nsi` and select "Compile NSIS Script"

3. Output: `ModbusGatewaySetup.exe`

## Usage

### Access Points

- **Development**: http://localhost:3000 (React dev server)

- **Production**: http://localhost:8000 (built-in web interface)

- **API**: http://localhost:8000/api/

- **Modbus Server**: Port 502

### Device Management

1. Click "Devices" to add/edit/delete devices

2. Offsets are calculated automatically

3. Changes are saved to `devices.json`

4. Restart service after configuration changes

### Monitoring

1. Dashboard shows real-time data from all devices

2. WebSocket updates every second

3. Device status indicators (online/offline)

4. Error messages displayed for failed connections

## Device Types

### OEE (4 registers)

| Register | Name | Description | Range |
|----------|------|-------------|-------|
| 0 | available_status | Start/Stop flag | 0=Stop, 1=Start |
| 1 | meters_hsc | High Speed Counter | 0-65535 |
| 2 | new_output_flag | Output flag | 0/1 |
| 3 | start_of_production | Production flag | 0/1 |

### Power Meter (26 registers - 13 float32)

| Registers | Name | Description | Range |
|-----------|------|-------------|-------|
| 0-1 | kwh | Energy consumption | 0-10000 kWh |
| 2-3 | v1 | Phase 1 voltage | 220-240V |
| 4-5 | v2 | Phase 2 voltage | 220-240V |
| 6-7 | v3 | Phase 3 voltage | 220-240V |
| 8-9 | v12 | Line voltage 1-2 | 380-400V |
| 10-11 | v23 | Line voltage 2-3 | 380-400V |
| 12-13 | v13 | Line voltage 1-3 | 380-400V |
| 14-15 | a1 | Phase 1 current | 0-100A |
| 16-17 | a2 | Phase 2 current | 0-100A |
| 18-19 | a3 | Phase 3 current | 0-100A |
| 20-21 | a_avg | Average current | 0-100A |
| 22-23 | freq_hz | Frequency | 49.5-50.5 Hz |
| 24-25 | p_total_kw | Total power | 0-50 kW |

### Scale (1 register)

| Register | Name | Description | Range |
|----------|------|-------------|-------|
| 0 | weight | Weight value | 0-50000 |

## Automatic Offset Calculation

Offsets are calculated automatically based on device type:

- **OEE**: 4 registers

- **PM**: 26 registers

- **Scale**: 1 register

**Example:**

- Device 1 (OEE): offset 0-3

- Device 2 (PM): offset 4-29

- Device 3 (Scale): offset 30

- Device 4 (OEE): offset 31-34

## API Endpoints

### Devices

- `GET /api/devices` - List all devices

- `POST /api/devices` - Add device (offset auto-calculated)

- `PUT /api/devices/{name}` - Update device

- `DELETE /api/devices/{name}` - Delete device

### Data

- `GET /api/data` - Get all device data

- `WS /api/ws` - WebSocket for real-time updates

### Power Meter Defaults

- `GET /api/pm-defaults` - Get default PM parameters

## Configuration

### Environment Variables

Edit `backend/.env` to customize:

```env
SERVER_HOST=0.0.0.0
SERVER_PORT=502
API_PORT=8000
SCAN_INTERVAL_SEC=1.0
LOG_LEVEL=INFO
```

### Device Configuration

Devices are stored in `backend/devices.json`:

```json
[
  {
    "name": "OEE_Line1",
    "type": "oee",
    "ip": "192.168.1.100",
    "port": 502,
    "slave_id": 1,
    "offset": 0
  }
]
```

## Production Deployment

### Windows Service (Recommended)

1. **Using Installer:**
   - Run `ModbusGatewaySetup.exe` as Administrator
   - Service automatically starts on boot

2. **Manual Installation:**
   ```cmd
   nssm install "Modbus Gateway" "C:\Program Files\Modbus Gateway\ModbusGateway.exe"
   nssm start "Modbus Gateway"
   ```

### Docker

```bash
docker-compose up -d
```

### Systemd (Linux)

```bash
sudo systemctl enable modbus-gateway
sudo systemctl start modbus-gateway
```

## Security

### Network Security

- Restrict port 502 to trusted networks

- Use firewall rules for API access

- Consider VPN for remote access

### Application Security

- Add authentication for production

- Use HTTPS for web interface

- Implement rate limiting

- Regular security updates

## Troubleshooting

### Common Issues

**Gateway won't start:**

- Check if port 502 is available (requires admin/root)

- Verify Python dependencies installed

- Check logs for error messages

**Devices offline:**

- Check IP addresses and ports

- Verify slave IDs match

- Check network connectivity

- Test with Modbus client tool

**Frontend not loading:**

- Verify backend is running on port 8000

- Check browser console for errors

- Clear browser cache

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
set LOG_LEVEL=DEBUG
python run.py
```

### Network Testing

```bash
# Test device connectivity
ping 192.168.1.100
telnet 192.168.1.100 502

# Check port usage
netstat -an | findstr :502
netstat -an | findstr :8000
```

## Development Tips

### Hot Reload

- Frontend: Changes auto-reload in development

- Backend: Restart `python run.py` after code changes

### Testing

- Use simulators for device testing

- Test API endpoints with Postman or curl

- Use browser dev tools for frontend debugging

### Code Structure

```
backend/
├── app/
│   ├── api/routes.py      # REST API endpoints
│   ├── core/gateway.py    # Modbus gateway logic
│   ├── models/device.py   # Device data models
│   └── main.py           # FastAPI application
├── simulator.py          # Test device simulator
├── run.py               # Application entry point
└── requirements.txt     # Python dependencies

frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   └── services/       # API services
└── package.json        # Node.js dependencies
```
