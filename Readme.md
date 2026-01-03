# Modbus Gateway - Professional Web Application

A full-stack Modbus TCP gateway with real-time monitoring, automatic offset calculation, and support for multiple device types.

## Features

✅ **Real-time Dashboard** - Live data from all devices via WebSocket  
✅ **Device Management** - Add/edit/delete devices via web UI  
✅ **Automatic Offsets** - No manual offset calculation needed  
✅ **Multiple Device Types** - OEE, Power Meters, Scales  
✅ **Unified Modbus Server** - Single endpoint on port 502  
✅ **Production Simulator** - Test with 33 simulated devices  
✅ **REST API** - Full CRUD operations  
✅ **Responsive UI** - Works on desktop, tablet, mobile  
✅ **Windows Service** - Production-ready executable with installer  

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Devices   │─────▶│   Gateway    │◀─────│  SCADA/MES  │
│ (Modbus TCP)│      │ (Port 8000)  │      │ (Port 502)  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Web UI      │
                     │ (Port 3000)  │
                     └──────────────┘
```

## Quick Start

### Option 1: Windows Installer (Recommended)

1. **Download** the latest `ModbusGatewaySetup.exe` from releases
2. **Run installer** as Administrator
3. **Start service** from Windows Services or:
   ```cmd
   net start "Modbus Gateway"
   ```
4. **Open browser** to http://localhost:8000

### Option 2: Development Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start Simulator (Optional)
```bash
cd backend
python simulator.py          # 4 test devices
# OR
python simulator_production.py  # 33 production devices
```

### 3. Start Gateway
```bash
cd backend
python run.py
```

### 4. Start Frontend (Development)
```bash
cd frontend
npm start
```

### 5. Open Browser
- **Production**: http://localhost:8000 (built-in web interface)
- **Development**: http://localhost:3000 (React dev server)

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

Offsets are calculated automatically when adding devices:

```
Device 1 (OEE)   → offset 0   (uses 0-3)
Device 2 (PM)    → offset 4   (uses 4-29)
Device 3 (Scale) → offset 30  (uses 30)
Device 4 (OEE)   → offset 31  (uses 31-34)
```

## API Reference

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Add device (offset auto-calculated)
- `PUT /api/devices/{name}` - Update device
- `DELETE /api/devices/{name}` - Delete device

### Data
- `GET /api/data` - Get all device data
- `WS /api/ws` - WebSocket for real-time updates

## Production Deployment

### Windows Service (Recommended)

**Using Installer:**
1. Run `ModbusGatewaySetup.exe` as Administrator
2. Service automatically starts on boot
3. Manage via Windows Services or:
   ```cmd
   net start "Modbus Gateway"
   net stop "Modbus Gateway"
   ```

**Manual Installation:**
```bash
# Build executable
cd backend
pyinstaller modbus_gateway.spec

# Install as service using NSSM
nssm install "Modbus Gateway" "C:\Program Files\Modbus Gateway\ModbusGateway.exe"
nssm set "Modbus Gateway" DisplayName "Modbus Gateway Service"
nssm set "Modbus Gateway" Description "Industrial Modbus TCP Gateway"
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

## Building from Source

### Prerequisites
- Python 3.12+
- Node.js 18+
- PyInstaller
- NSIS (for Windows installer)

### Build Steps

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   pip install pyinstaller
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Build executable:**
   ```bash
   cd backend
   pyinstaller modbus_gateway.spec
   ```

4. **Create installer (Windows):**
   - Install NSIS from https://nsis.sourceforge.io/
   - Right-click `installer.nsi` and select "Compile NSIS Script"
   - Output: `ModbusGatewaySetup.exe`

## Configuration

Edit `backend/.env`:
```env
SERVER_HOST=0.0.0.0
SERVER_PORT=502
API_PORT=8000
SCAN_INTERVAL_SEC=1.0
```

## Security

- Restrict port 502 to trusted networks
- Use firewall rules for API access
- Add authentication for production
- Use HTTPS for web interface
- Implement rate limiting

## Troubleshooting

**Service won't start:**
- Check Windows Event Viewer for errors
- Verify port 502 is available (requires admin privileges)
- Check service logs in `C:\Program Files\Modbus Gateway\logs\`

**Missing dependencies error:**
- Ensure all Python packages are included in `modbus_gateway.spec`
- Rebuild executable with updated dependencies

**Devices offline:**
- Check IP addresses and ports in device configuration
- Verify slave IDs match device settings
- Check network connectivity and firewall rules

**Frontend not loading:**
- Verify service is running and listening on port 8000
- Check browser console for errors
- Clear browser cache and cookies

**Performance issues:**
- Reduce polling interval in configuration
- Check network latency to devices
- Monitor system resources

## File Structure

```
modbus_gateway/
├── backend/
│   ├── app/
│   │   ├── api/routes.py      # REST API endpoints
│   │   ├── core/gateway.py    # Modbus gateway logic
│   │   ├── models/device.py   # Device data models
│   │   └── main.py           # FastAPI application
│   ├── dist/ModbusGateway/   # Built executable
│   ├── modbus_gateway.spec   # PyInstaller configuration
│   ├── requirements.txt      # Python dependencies
│   └── run.py               # Application entry point
├── frontend/
│   ├── build/               # Production build
│   ├── src/                 # React source code
│   └── package.json         # Node.js dependencies
├── installer.nsi            # NSIS installer script
└── README.md               # This file
```

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
