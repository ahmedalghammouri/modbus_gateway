import uvicorn
import sys
import os
import logging
from datetime import datetime

# Setup logging
log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, f'gateway_{datetime.now().strftime("%Y%m%d")}.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

try:
    logger.info("Starting Modbus Gateway...")
    logger.info(f"Python version: {sys.version}")
    logger.info(f"Working directory: {os.getcwd()}")
    
    if getattr(sys, 'frozen', False):
        logger.info("Running as frozen executable")
        os.chdir(sys._MEIPASS)
        logger.info(f"Changed to: {os.getcwd()}")
    
    logger.info("Starting uvicorn server...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False, log_level="info")
except Exception as e:
    logger.error(f"Fatal error: {e}", exc_info=True)
    raise
