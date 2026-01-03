# Changelog

All notable changes to the Modbus Gateway project will be documented in this file.

## [1.1.0] - 2026-01-04

### Added

- ✅ **Windows Service Support** - Production-ready executable with NSIS installer

- ✅ **Complete PyInstaller Configuration** - All dependencies properly bundled

- ✅ **Service Management** - Start/stop via Windows Services or command line

- ✅ **Production Logging** - Comprehensive logging with rotation

- ✅ **Deployment Documentation** - Complete deployment and troubleshooting guide

### Fixed

- 🔧 **Missing FastAPI Dependencies** - Added all FastAPI, Starlette, Pydantic modules to PyInstaller spec

- 🔧 **Missing Uvicorn Dependencies** - Included complete Uvicorn server components

- 🔧 **Missing Pymodbus Dependencies** - Added client and server modules for Modbus communication

- 🔧 **Frontend Path Issues** - Corrected static file paths for frozen executable

- 🔧 **Import Errors** - Resolved "No module named 'fastapi'" and related dependency issues

### Changed

- 📝 **Updated README.md** - Added Windows service installation instructions

- 📝 **Enhanced Documentation** - Complete deployment guide with troubleshooting

- 🏗️ **Improved Build Process** - Streamlined executable creation with proper dependencies

### Technical Details

#### PyInstaller Configuration Updates

```python
hiddenimports=[
    # FastAPI Framework
    'fastapi',
    'fastapi.applications',
    'fastapi.routing',
    'fastapi.middleware',
    'fastapi.middleware.cors',
    'fastapi.staticfiles',
    'fastapi.exceptions',
    
    # Pydantic Data Validation
    'pydantic',
    'pydantic.main',
    'pydantic.fields',
    'pydantic.types',
    
    # Starlette ASGI Framework
    'starlette',
    'starlette.applications',
    'starlette.routing',
    'starlette.middleware',
    'starlette.middleware.cors',
    'starlette.staticfiles',
    'starlette.responses',
    'starlette.requests',
    
    # Uvicorn ASGI Server
    'uvicorn',
    'uvicorn.main',
    'uvicorn.server',
    'uvicorn.config',
    'uvicorn.importer',
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    
    # Pymodbus Library
    'pymodbus',
    'pymodbus.client',
    'pymodbus.server',
    'pymodbus.datastore',
    'pymodbus.device',
    'pymodbus.exceptions',
    'pymodbus.constants',
]
```

#### Service Installation

- Executable built with PyInstaller includes all Python dependencies

- NSIS installer creates Windows service automatically

- Service runs as Local System with automatic startup

- Logs stored in `C:\Program Files\Modbus Gateway\logs\`

#### Resolved Issues

1. **ModuleNotFoundError: No module named 'fastapi'** - Fixed by adding complete FastAPI dependency tree

2. **ModuleNotFoundError: No module named 'pymodbus'** - Fixed by including all Pymodbus modules

3. **Frontend mounting errors** - Fixed static file paths for production deployment

4. **Service startup failures** - Resolved dependency and permission issues

## [1.0.0] - 2025-12-XX

### Added

- 🚀 **Initial Release** - Full-stack Modbus TCP gateway

- 🌐 **Web Interface** - React-based dashboard with real-time updates

- 🔌 **Device Support** - OEE, Power Meters, and Scale devices

- 📊 **Real-time Monitoring** - WebSocket-based live data streaming

- 🔧 **Device Management** - Add/edit/delete devices via web UI

- 📈 **Automatic Offsets** - No manual Modbus register calculation needed

- 🎯 **Production Simulator** - 33 simulated devices for testing

- 🔗 **REST API** - Complete CRUD operations for devices and data

- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### Features

- FastAPI backend with async Modbus communication

- React frontend with Material-UI components

- Unified Modbus server on port 502

- Web interface on port 8000

- WebSocket real-time updates

- JSON-based device configuration

- Comprehensive logging

- Error handling and recovery

---

## Version History

- **v1.1.0** - Production Windows Service Release

- **v1.0.0** - Initial Development Release

## Upgrade Notes

### From v1.0.0 to v1.1.0

1. **Backup Configuration:**
   ```bash
   copy devices.json devices.json.backup
   ```

2. **Stop Development Server:**
   ```bash
   # Stop any running Python processes
   taskkill /f /im python.exe
   ```

3. **Install Service:**
   - Run `ModbusGatewaySetup.exe` as Administrator
   - Service will start automatically

4. **Restore Configuration:**
   - Copy `devices.json` to `C:\Program Files\Modbus Gateway\_internal\`
   - Restart service if needed

5. **Verify Installation:**
   - Check service status in Windows Services
   - Access web interface at http://localhost:8000
   - Verify device connectivity

## Known Issues

### v1.1.0

- Frontend path warning on first startup (cosmetic only)

- Win32timezone module not found (does not affect functionality)

- Service requires administrator privileges for port 502

### Workarounds

- Frontend warning can be ignored - web interface works correctly

- Port 502 binding requires running as administrator or Local System

- Use Windows Firewall to restrict access to trusted networks

## Future Roadmap

### v1.2.0 (Planned)

- 🔐 **Authentication System** - User login and role-based access

- 📊 **Historical Data** - Database storage and trending

- 🚨 **Alerting System** - Email/SMS notifications for device failures

- 🔄 **Auto-discovery** - Automatic device detection on network

- 📈 **Performance Metrics** - Response time and throughput monitoring

### v1.3.0 (Planned)

- 🌐 **HTTPS Support** - SSL/TLS encryption for web interface

- 🔌 **Protocol Extensions** - Modbus RTU over TCP support

- 📱 **Mobile App** - Native iOS/Android applications

- 🏭 **OPC UA Gateway** - Dual protocol support

- ☁️ **Cloud Integration** - Azure IoT Hub and AWS IoT Core

---

*For technical support and feature requests, please visit our GitHub repository or contact the development team.*