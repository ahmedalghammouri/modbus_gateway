@echo off
echo Building Modbus Gateway Windows Service...

echo.
echo Step 1: Installing PyInstaller...
pip install pyinstaller pywin32

echo.
echo Step 2: Building executable...
pyinstaller --clean modbus_gateway.spec --noconfirm

echo.
echo Step 3: Build complete!
echo Executable location: dist\ModbusGateway\ModbusGateway.exe

echo.
echo To create installer:
echo 1. Install NSIS from https://nsis.sourceforge.io/
echo 2. Right-click installer.nsi and select "Compile NSIS Script"
echo 3. Run ModbusGatewaySetup.exe on client machine

pause
