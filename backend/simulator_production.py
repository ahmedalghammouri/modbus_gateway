import asyncio
import struct
import random
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSlaveContext, ModbusServerContext
from pymodbus.server import StartAsyncTcpServer

def float_to_regs(val):
    return list(struct.unpack(">HH", struct.pack(">f", float(val))))

class MultiSlaveSimulator:
    def __init__(self, port, slaves):
        self.port = port
        self.slaves = slaves
        self.context = None
        
    async def update_loop(self):
        await asyncio.sleep(2)
        print(f"[SIM] Port {self.port} updater started")
        while True:
            try:
                for slave_id, device_type in self.slaves.items():
                    if device_type == "oee":
                        # OEE: Available flag (0/1), Meters HSC, New Output flag (0/1), Start of production (0/1)
                        vals = [
                            random.choice([0, 1]),      # available_flag (0=Stop, 1=Start)
                            random.randint(0, 65535),   # meters_hsc (High Speed Counter)
                            random.choice([0, 1]),      # new_output_flag
                            random.choice([0, 1])       # start_of_production
                        ]
                        self.context[slave_id].setValues(3, 1, vals)
                    elif device_type == "scale":
                        weight = random.randint(0, 50000)
                        self.context[slave_id].setValues(3, 1, [weight])
                    else:  # pm
                        pm = {2699: random.uniform(0, 10000), 3027: random.uniform(220, 240),
                              3029: random.uniform(220, 240), 3031: random.uniform(220, 240),
                              3019: random.uniform(380, 400), 3021: random.uniform(380, 400),
                              3023: random.uniform(380, 400), 2999: random.uniform(0, 100),
                              3001: random.uniform(0, 100), 3003: random.uniform(0, 100),
                              3009: random.uniform(0, 100), 3109: random.uniform(49.5, 50.5),
                              3059: random.uniform(0, 50)}
                        for addr, val in pm.items():
                            self.context[slave_id].setValues(3, addr, float_to_regs(val))
            except Exception as e:
                print(f"[SIM] Port {self.port} error: {e}")
            await asyncio.sleep(2)
    
    async def run(self):
        stores = {sid: ModbusSlaveContext(hr=ModbusSequentialDataBlock(0, [0]*50000)) 
                  for sid in self.slaves.keys()}
        self.context = ModbusServerContext(slaves=stores, single=False)
        asyncio.create_task(self.update_loop())
        print(f"[SIM] Starting 127.0.0.1:{self.port} slaves={list(self.slaves.keys())}")
        await StartAsyncTcpServer(context=self.context, address=("127.0.0.1", self.port))

async def main():
    print("="*60)
    print("Production Simulator - 33 Devices on localhost")
    print("="*60)
    
    servers = [
        MultiSlaveSimulator(5001, {1: "oee"}),  # Edge 1
        MultiSlaveSimulator(5002, {1: "oee"}),  # Edge 2
        MultiSlaveSimulator(5003, {1: "oee"}),  # Edge 3
        MultiSlaveSimulator(5004, {1: "oee"}),  # Edge 4
        MultiSlaveSimulator(5005, {1: "oee"}),  # Edge 5
        MultiSlaveSimulator(5006, {1: "oee"}),  # Edge 6
        MultiSlaveSimulator(5007, {1: "oee"}),  # Edge 7
        MultiSlaveSimulator(5008, {1: "oee"}),  # Edge 8
        MultiSlaveSimulator(5009, {1: "oee"}),  # Edge 9
        MultiSlaveSimulator(5010, {1: "pm", 2: "pm", 3: "scale"}),  # ETH1
        MultiSlaveSimulator(5011, {1: "pm", 2: "pm", 3: "scale"}),  # ETH2
        MultiSlaveSimulator(5012, {1: "pm", 2: "pm", 3: "pm"}),      # ETH3
        MultiSlaveSimulator(5013, {1: "pm", 2: "scale"}),           # ETH4
        MultiSlaveSimulator(5014, {1: "pm", 2: "scale"}),           # ETH5
        MultiSlaveSimulator(5015, {1: "pm", 2: "scale"}),           # ETH6
        MultiSlaveSimulator(5016, {1: "pm", 2: "scale"}),           # ETH7
        MultiSlaveSimulator(5017, {1: "pm", 2: "scale"}),           # ETH8
        MultiSlaveSimulator(5018, {1: "pm", 2: "scale"}),           # ETH9
    ]
    
    print(f"18 servers (ports 5001-5018), 33 devices total")
    print("="*60)
    
    await asyncio.gather(*[s.run() for s in servers])

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[SIM] Stopped")
