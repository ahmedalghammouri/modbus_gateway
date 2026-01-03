# Windows Service Deployment Guide

## Build Executable (Development Machine)

1. Install dependencies:
```bash
pip install pyinstaller
```

2. Build executable:
```cmd
cd backend
pyinstaller --clean modbus_gateway.spec
```

3. Download NSSM (Non-Sucking Service Manager):
   - Get from: https://nssm.cc/download
   - Extract `nssm.exe` (64-bit) to `backend/` folder

4. Output: `dist/ModbusGateway/` folder with all files

## Deploy to Client (Option 1: Manual with NSSM)

1. Copy `dist/ModbusGateway/` folder to client machine (e.g., `C:\ModbusGateway\`)

2. Download NSSM and copy `nssm.exe` to `C:\ModbusGateway\`

3. Install as Windows service (run as Administrator):
```cmd
cd C:\ModbusGateway
nssm install ModbusGateway "%CD%\ModbusGateway.exe"
nssm set ModbusGateway AppDirectory "%CD%"
nssm set ModbusGateway DisplayName "Modbus Gateway"
nssm set ModbusGateway Start SERVICE_AUTO_START
nssm set ModbusGateway AppStdout "%CD%\logs\service_stdout.log"
nssm set ModbusGateway AppStderr "%CD%\logs\service_stderr.log"
sc start ModbusGateway
```

4. Access UI: `http://localhost:8000`

## Deploy to Client (Option 2: Installer)

1. Download NSSM and copy `nssm.exe` to `backend/` folder

2. Install NSIS: https://nsis.sourceforge.io/

3. Build installer:
   - Right-click `installer.nsi`
   - Select "Compile NSIS Script"

4. Run `ModbusGatewaySetup.exe` on client machine (as Administrator)

5. Service auto-starts, access UI: `http://localhost:8000`

## Service Management

Start: `sc start ModbusGateway` or `nssm start ModbusGateway`
Stop: `sc stop ModbusGateway` or `nssm stop ModbusGateway`
Restart: `nssm restart ModbusGateway`
Status: `sc query ModbusGateway` or `nssm status ModbusGateway`
Remove: `nssm remove ModbusGateway confirm`

## Configuration

Edit `devices.json` in installation folder, restart service.

## Firewall

Open port 8000 (Web UI + API) and port 502 (Modbus server).

## Troubleshooting

If service doesn't start:
1. Check log files in `logs/` folder:
   - `gateway_YYYYMMDD.log` - Application log
   - `service_stdout.log` - Service output
   - `service_stderr.log` - Service errors
2. Run `ModbusGateway.exe` directly to see console output
3. Check Event Viewer > Windows Logs > Application
4. Check `nssm status ModbusGateway` for service status
5. Ensure running as Administrator
6. Verify port 502 and 8000 are not in use

## Notes

- No Python installation required on client
- Single executable with all dependencies
- NSSM handles service wrapper (simpler than pywin32)
- Runs as Windows service (auto-start on boot)
- Web UI accessible from any browser on network
- All errors logged to `logs/` folder
