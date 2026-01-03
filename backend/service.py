import win32serviceutil
import win32service
import win32event
import servicemanager
import socket
import sys
import os
import subprocess

class ModbusGatewayService(win32serviceutil.ServiceFramework):
    _svc_name_ = "ModbusGateway"
    _svc_display_name_ = "Modbus Gateway Service"
    _svc_description_ = "Modbus TCP Gateway Service"

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)
        self.process = None

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)
        if self.process:
            self.process.terminate()

    def SvcDoRun(self):
        servicemanager.LogMsg(servicemanager.EVENTLOG_INFORMATION_TYPE,
                              servicemanager.PYS_SERVICE_STARTED,
                              (self._svc_name_, ''))
        self.main()

    def main(self):
        exe_path = os.path.join(os.path.dirname(__file__), 'ModbusGateway.exe')
        self.process = subprocess.Popen([exe_path])
        win32event.WaitForSingleObject(self.stop_event, win32event.INFINITE)

if __name__ == '__main__':
    if len(sys.argv) == 1:
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(ModbusGatewayService)
        servicemanager.StartServiceCtrlDispatcher()
    else:
        win32serviceutil.HandleCommandLine(ModbusGatewayService)
