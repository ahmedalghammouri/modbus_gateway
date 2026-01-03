from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.api.routes import router, load_devices
from app.core.gateway import gateway

app = FastAPI(title="Modbus Gateway")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup():
    load_devices()
    asyncio.create_task(gateway.start_server())

@app.on_event("shutdown")
async def shutdown():
    gateway.running = False

@app.get("/")
async def root():
    return {"status": "running", "devices": len(gateway.devices)}
