from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import logging
from app.api.routes import router, load_devices
from app.core.gateway import gateway

logger = logging.getLogger(__name__)

app = FastAPI(title="Modbus Gateway")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(router, prefix="/api")

try:
    app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")
    logger.info("Frontend mounted successfully")
except Exception as e:
    logger.warning(f"Frontend not mounted: {e}")

@app.on_event("startup")
async def startup():
    try:
        logger.info("Application startup...")
        load_devices()
        logger.info(f"Loaded {len(gateway.devices)} devices")
        asyncio.create_task(gateway.start_server())
        logger.info("Gateway server task started")
    except Exception as e:
        logger.error(f"Startup error: {e}", exc_info=True)
        raise

@app.on_event("shutdown")
async def shutdown():
    logger.info("Application shutdown...")
    gateway.running = False
