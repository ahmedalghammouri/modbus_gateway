# Modbus Device Simulator

## Quick Start - Test Environment (4 devices)

### 1. Start Simulator
```bash
cd backend
python simulator.py
```

This creates 4 simulated Modbus devices on localhost:
- **Port 5020** - OEE Device (slave 1)
- **Port 5021** - Power Meter (slave 1)
- **Port 5022** - OEE Device (slave 1)
- **Port 5023** - Power Meter (slave 1)

### 2. Start Gateway
```bash
cd backend
python run.py
```

### 3. Start Frontend
```bash
cd frontend
npm start
```

### 4. Open Browser
http://localhost:3000

---

## Production Environment (33 devices)

### 1. Start Production Simulator
```bash
cd backend
python simulator_production.py
```

This simulates 33 devices across 18 servers:
- **9 Edge PLCs** (ports 5001-5009) - OEE devices
- **13 Power Meters** (ports 5010-5018, slave 1-3) - PM devices
- **8 Scales** (ports 5010-5018, slave 2-3) - Scale devices
- **3 Additional PMs** (port 5012, slaves 1-3)

### 2. Start Gateway
```bash
cd backend
python run.py
```

Gateway automatically loads devices from `devices.json`

### 3. Start Frontend
```bash
cd frontend
npm start
```

---

## Device Types & Data

### OEE Devices (4 registers)
- **available_status**: 0=Stop, 1=Start
- **meters_hsc**: 0-65535 (High Speed Counter)
- **new_output_flag**: 0 or 1
- **start_of_production**: 0 or 1

### Power Meters (26 registers - 13 float32)
- **kwh**: 0-10000 kWh
- **v1, v2, v3**: 220-240V (phase voltages)
- **v12, v23, v13**: 380-400V (line voltages)
- **a1, a2, a3, a_avg**: 0-100A (currents)
- **freq_hz**: 49.5-50.5 Hz
- **p_total_kw**: 0-50 kW

### Scales (1 register)
- **weight**: 0-50000 (weight value)

---

## Port Mapping

**Test Environment:**
- 5020: OEE (slave 1)
- 5021: PM (slave 1)
- 5022: OEE (slave 1)
- 5023: PM (slave 1)

**Production Environment:**
- 5001-5009: Edge PLCs (OEE, slave 1)
- 5010-5018: Ethernet modules with multiple slaves:
  - Slave 1: Power Meter
  - Slave 2: Power Meter or Scale
  - Slave 3: Scale or Power Meter

---

## Update Frequency

All simulated devices update every 2 seconds with random realistic values.

---

## Testing

1. Start simulator first
2. Start gateway (loads devices.json)
3. Open web UI at http://localhost:3000
4. Watch live data on dashboard
5. Gateway exposes unified Modbus server on port 502
6. Add/edit/delete devices via web UI (offsets auto-calculated)
