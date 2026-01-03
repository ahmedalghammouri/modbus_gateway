from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
import json
import asyncio
from pathlib import Path
from app.models.device import Device
from app.core.gateway import gateway

router = APIRouter()
DEVICES_FILE = Path("devices.json")

DEVICE_SIZES = {"oee": 4, "pm": 26, "scale": 1}

def calculate_offset(devices, device_type):
    if not devices:
        return 0
    max_offset = max(d.offset for d in devices)
    last_device = next((d for d in devices if d.offset == max_offset), None)
    if last_device:
        return max_offset + DEVICE_SIZES[last_device.type]
    return 0

@router.get("/devices")
async def get_devices():
    return gateway.devices

@router.post("/devices")
async def add_device(device: Device):
    device.offset = calculate_offset(gateway.devices, device.type)
    gateway.devices.append(device)
    save_devices()
    return device

@router.put("/devices/{name}")
async def update_device(name: str, device: Device):
    for i, d in enumerate(gateway.devices):
        if d.name == name:
            gateway.devices[i] = device
            save_devices()
            return device
    raise HTTPException(404, "Device not found")

@router.delete("/devices/{name}")
async def delete_device(name: str):
    gateway.devices = [d for d in gateway.devices if d.name != name]
    save_devices()
    return {"ok": True}

@router.get("/data")
async def get_data():
    return gateway.device_data

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            await ws.send_json(gateway.device_data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass

def save_devices():
    data = [d.model_dump(exclude={"status", "last_error"}) for d in gateway.devices]
    DEVICES_FILE.write_text(json.dumps(data, indent=2))

def load_devices():
    if DEVICES_FILE.exists():
        gateway.devices = [Device(**d) for d in json.loads(DEVICES_FILE.read_text())]
        print(f"[API] Loaded {len(gateway.devices)} devices from {DEVICES_FILE}")
    else:
        print(f"[API] No devices file found at {DEVICES_FILE}")
