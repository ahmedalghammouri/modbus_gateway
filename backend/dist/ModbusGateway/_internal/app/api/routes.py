from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
import json
import asyncio
import logging
from pathlib import Path
from app.models.device import Device
from app.core.gateway import gateway

logger = logging.getLogger(__name__)

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

@router.get("/pm-defaults")
async def get_pm_defaults():
    from app.models.device import DEFAULT_PM_PARAMS
    return {"params": DEFAULT_PM_PARAMS}

@router.get("/devices")
async def get_devices():
    return gateway.devices

@router.post("/devices")
async def add_device(device: Device):
    try:
        device.offset = calculate_offset(gateway.devices, device.type)
        gateway.devices.append(device)
        save_devices()
        logger.info(f"Added device: {device.name}")
        return device
    except Exception as e:
        logger.error(f"Error adding device: {e}", exc_info=True)
        raise HTTPException(500, str(e))

@router.put("/devices/{name}")
async def update_device(name: str, device: Device):
    try:
        for i, d in enumerate(gateway.devices):
            if d.name == name:
                gateway.devices[i] = device
                save_devices()
                logger.info(f"Updated device: {name}")
                return device
        raise HTTPException(404, "Device not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating device: {e}", exc_info=True)
        raise HTTPException(500, str(e))

@router.delete("/devices/{name}")
async def delete_device(name: str):
    try:
        gateway.devices = [d for d in gateway.devices if d.name != name]
        save_devices()
        logger.info(f"Deleted device: {name}")
        return {"ok": True}
    except Exception as e:
        logger.error(f"Error deleting device: {e}", exc_info=True)
        raise HTTPException(500, str(e))

@router.get("/data")
async def get_data():
    return gateway.device_data

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    logger.info("WebSocket client connected")
    try:
        while True:
            await ws.send_json(gateway.device_data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")

def save_devices():
    try:
        data = [d.model_dump(exclude={"status", "last_error"}) for d in gateway.devices]
        DEVICES_FILE.write_text(json.dumps(data, indent=2))
        logger.info(f"Saved {len(gateway.devices)} devices")
    except Exception as e:
        logger.error(f"Error saving devices: {e}", exc_info=True)
        raise

def load_devices():
    try:
        if DEVICES_FILE.exists():
            gateway.devices = [Device(**d) for d in json.loads(DEVICES_FILE.read_text())]
            logger.info(f"Loaded {len(gateway.devices)} devices from {DEVICES_FILE}")
        else:
            logger.warning(f"No devices file found at {DEVICES_FILE}")
    except Exception as e:
        logger.error(f"Error loading devices: {e}", exc_info=True)
        gateway.devices = []
