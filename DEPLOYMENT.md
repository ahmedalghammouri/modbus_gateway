# Modbus Gateway - Deployment Guide

This guide covers production deployment of the Modbus Gateway as a Windows service.

## Prerequisites

- Windows Server 2016+ or Windows 10+

- Administrator privileges

- Network access to Modbus devices

- Port 502 and 8000 available

## Installation Methods

### Method 1: Using Installer (Recommended)

1. **Download** `ModbusGatewaySetup.exe` from releases

2. **Run as Administrator**

3. **Follow installation wizard**

4. **Service starts automatically**

### Method 2: Manual Installation

1. **Copy files** to `C:\Program Files\Modbus Gateway\`

2. **Install service** using NSSM:
   ```cmd
   nssm install "Modbus Gateway" "C:\Program Files\Modbus Gateway\ModbusGateway.exe"
   nssm set "Modbus Gateway" DisplayName "Modbus Gateway Service"
   nssm set "Modbus Gateway" Description "Industrial Modbus TCP Gateway"
   nssm set "Modbus Gateway" Start SERVICE_AUTO_START
   nssm start "Modbus Gateway"
   ```

## Service Management

### Windows Services GUI

1. Open **Services** (services.msc)

2. Find **Modbus Gateway**

3. Right-click → **Start/Stop/Restart**

### Command Line

```cmd
# Start service
net start "Modbus Gateway"

# Stop service
net stop "Modbus Gateway"

# Check status
sc query "Modbus Gateway"
```

### PowerShell

```powershell
# Start service
Start-Service "Modbus Gateway"

# Stop service
Stop-Service "Modbus Gateway"

# Get status
Get-Service "Modbus Gateway"
```

## Configuration

### Device Configuration

- Access web interface: http://localhost:8000

- Add devices via GUI or edit `devices.json`

- Restart service after configuration changes

### Network Configuration

- **Port 502**: Modbus TCP server (requires admin privileges)

- **Port 8000**: Web interface and API

- Configure Windows Firewall if needed

### Logging

- Service logs: `C:\Program Files\Modbus Gateway\logs\`

- Windows Event Viewer: Application logs

- Log level can be configured in application

## Security Considerations

### Network Security

- Restrict port 502 to trusted SCADA/MES systems

- Use VPN or private network for device communication

- Configure firewall rules for port 8000

### Service Security

- Service runs as Local System (default)

- Consider running as dedicated service account

- Limit file system permissions

### Web Interface Security

- Add authentication for production use

- Use HTTPS with SSL certificate

- Implement rate limiting

- Regular security updates

## Monitoring

### Health Checks

- Web interface: http://localhost:8000

- API endpoint: http://localhost:8000/api/devices

- Modbus connectivity: Test with Modbus client

### Performance Monitoring

- CPU usage (should be <5% normally)

- Memory usage (typically 50-100MB)

- Network traffic on ports 502 and 8000

- Device response times

### Alerting

- Monitor service status

- Check device connectivity

- Monitor log files for errors

- Set up automated notifications

## Backup and Recovery

### Backup Files

- `devices.json` - Device configuration

- `logs/` - Historical logs

- Custom configuration files

### Recovery Procedure

1. Stop service

2. Restore configuration files

3. Start service

4. Verify device connectivity

## Troubleshooting

### Service Won't Start

**Check Event Viewer:**

1. Open Event Viewer

2. Navigate to Windows Logs → Application

3. Look for Modbus Gateway errors

**Common Issues:**

- Port 502 already in use

- Missing dependencies

- Insufficient privileges

- Corrupted configuration

**Solutions:**

```cmd
# Check port usage
netstat -an | findstr :502

# Run as administrator
runas /user:Administrator "C:\Program Files\Modbus Gateway\ModbusGateway.exe"

# Reset configuration
del "C:\Program Files\Modbus Gateway\_internal\devices.json"
```

### Devices Offline

**Network Connectivity:**

```cmd
# Test device connectivity
ping 192.168.1.100
telnet 192.168.1.100 502
```

**Configuration Issues:**

- Verify IP addresses and ports

- Check slave IDs

- Validate device types

- Test with Modbus client tool

### Performance Issues

**High CPU Usage:**

- Reduce polling frequency

- Check for network timeouts

- Optimize device configuration

**Memory Leaks:**

- Restart service regularly

- Monitor memory usage

- Check for connection leaks

**Slow Response:**

- Check network latency

- Reduce concurrent connections

- Optimize Modbus parameters

## Maintenance

### Regular Tasks

- Monitor service status daily

- Check logs weekly

- Backup configuration monthly

- Update software quarterly

### Log Rotation

- Logs rotate automatically

- Keep 30 days of history

- Archive old logs if needed

### Updates

1. Stop service

2. Backup current installation

3. Install new version

4. Restore configuration

5. Start service

6. Verify functionality

## Integration

### SCADA Systems

- Connect to port 502 as Modbus TCP client

- Use slave ID 1

- Read holding registers starting from offset 0

- Refer to device mapping documentation

### MES Systems

- Use REST API on port 8000

- WebSocket for real-time data

- JSON format for all responses

- Authentication may be required

### Third-party Tools

- Modbus Poll/Slave for testing

- Wireshark for network analysis

- Performance counters for monitoring

- Custom applications via API

## Support

### Documentation

- README.md - General information

- API documentation - REST endpoints

- Device specifications - Modbus mappings

### Logs and Diagnostics

- Enable debug logging if needed

- Collect network traces

- Export device configuration

- System information

### Contact Information

- GitHub Issues for bugs

- Email support for enterprise

- Community forum for questions

- Professional services available