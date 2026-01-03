import asyncio
import struct
import time
import logging
from pymodbus.client import AsyncModbusTcpClient
from pymodbus.server import StartAsyncTcpServer
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSlaveContext, ModbusServerContext

logger = logging.getLogger(__name__)

class ModbusGateway:
    def __init__(self):
        store = ModbusSlaveContext(hr=ModbusSequentialDataBlock(0, [0]*30000))
        self.context = ModbusServerContext(slaves=store, single=True)
        self.devices = []
        self.device_data = {}
        self.running = False
        logger.info("ModbusGateway initialized")

    def decode_float32(self, regs):
        if len(regs) < 2: return None
        return struct.unpack(">f", struct.pack(">HH", regs[0], regs[1]))[0]

    def write_float32(self, offset, val):
        hi, lo = struct.unpack(">HH", struct.pack(">f", float(val)))
        self.context[0x03].setValues(3, offset, [hi, lo])

    async def poll_pm(self, dev):
        try:
            logger.debug(f"Polling PM {dev.name} at {dev.ip}:{dev.port}")
            client = AsyncModbusTcpClient(dev.ip, port=dev.port, timeout=5, retries=1)
            await client.connect()
            
            pm_params = dev.get_pm_params()
            data = {}
            for name, addr, rel in pm_params:
                rr = await client.read_holding_registers(addr, 2, slave=dev.slave_id)
                if not rr.isError():
                    val = self.decode_float32(rr.registers)
                    if val:
                        self.write_float32(dev.offset + rel, val)
                        data[name] = round(val, 2)
            
            self.device_data[dev.name] = {"values": data, "timestamp": time.time(), "status": "online"}
            logger.debug(f"PM {dev.name} OK - {len(data)} params")
            client.close()
        except Exception as e:
            self.device_data[dev.name] = {"error": str(e), "timestamp": time.time(), "status": "offline"}
            logger.error(f"PM {dev.name} error: {e}")

    async def poll_scale(self, dev):
        try:
            logger.debug(f"Polling Scale {dev.name} at {dev.ip}:{dev.port}")
            client = AsyncModbusTcpClient(dev.ip, port=dev.port, timeout=5, retries=1)
            await client.connect()
            
            rr = await client.read_holding_registers(1, 1, slave=dev.slave_id)
            if not rr.isError():
                self.context[0x03].setValues(3, dev.offset, rr.registers)
                self.device_data[dev.name] = {"values": {"weight": rr.registers[0]},
                                              "timestamp": time.time(), "status": "online"}
                logger.debug(f"Scale {dev.name} OK - weight={rr.registers[0]}")
            else:
                raise Exception(f"Read error: {rr}")
            client.close()
        except Exception as e:
            self.device_data[dev.name] = {"error": str(e), "timestamp": time.time(), "status": "offline"}
            logger.error(f"Scale {dev.name} error: {e}")

    async def poll_oee(self, dev):
        try:
            logger.debug(f"Polling OEE {dev.name} at {dev.ip}:{dev.port}")
            client = AsyncModbusTcpClient(dev.ip, port=dev.port, timeout=5, retries=1)
            await client.connect()
            
            rr = await client.read_holding_registers(1, 4, slave=dev.slave_id)
            if not rr.isError():
                self.context[0x03].setValues(3, dev.offset, rr.registers)
                status = "Start" if rr.registers[0] == 1 else "Stop"
                self.device_data[dev.name] = {"values": {
                    "available_status": status,
                    "meters_hsc": rr.registers[1],
                    "new_output_flag": rr.registers[2],
                    "start_of_production": rr.registers[3]
                }, "timestamp": time.time(), "status": "online"}
                logger.debug(f"OEE {dev.name} OK - status={status}")
            else:
                raise Exception(f"Read error: {rr}")
            client.close()
        except Exception as e:
            self.device_data[dev.name] = {"error": str(e), "timestamp": time.time(), "status": "offline"}
            logger.error(f"OEE {dev.name} error: {e}")

    async def poll_all(self):
        logger.info(f"Starting polling for {len(self.devices)} devices")
        while self.running:
            try:
                tasks = []
                for d in self.devices:
                    if d.type == "pm":
                        tasks.append(self.poll_pm(d))
                    elif d.type == "scale":
                        tasks.append(self.poll_scale(d))
                    else:
                        tasks.append(self.poll_oee(d))
                await asyncio.gather(*tasks, return_exceptions=True)
                await asyncio.sleep(1.0)
            except Exception as e:
                logger.error(f"Polling error: {e}", exc_info=True)
                await asyncio.sleep(5)

    async def start_server(self):
        try:
            self.running = True
            logger.info("Starting Modbus server on port 502")
            asyncio.create_task(self.poll_all())
            await StartAsyncTcpServer(context=self.context, address=("0.0.0.0", 502))
        except Exception as e:
            logger.error(f"Server start error: {e}", exc_info=True)
            raise

gateway = ModbusGateway()
