!define APP_NAME "Modbus Gateway"
!define SERVICE_NAME "ModbusGateway"

Name "${APP_NAME}"
OutFile "ModbusGatewaySetup.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"
RequestExecutionLevel admin

Page directory
Page instfiles

Section "Install"
    SetOutPath "$INSTDIR"
    File /r "dist\ModbusGateway\*.*"
    File "nssm.exe"
    
    CreateDirectory "$INSTDIR\logs"
    
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    
    ExecWait '"$INSTDIR\nssm.exe" install ${SERVICE_NAME} "$INSTDIR\ModbusGateway.exe"'
    ExecWait '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} AppDirectory "$INSTDIR"'
    ExecWait '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} DisplayName "${APP_NAME}"'
    ExecWait '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} Description "Modbus TCP Gateway Service"'
    ExecWait '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} Start SERVICE_AUTO_START'
    ExecWait '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} AppStdout "$INSTDIR\logs\service_stdout.log"'
    ExecWait '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} AppStderr "$INSTDIR\logs\service_stderr.log"'
    ExecWait 'sc start ${SERVICE_NAME}'
    
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
    ExecWait '"$INSTDIR\nssm.exe" stop ${SERVICE_NAME}'
    ExecWait '"$INSTDIR\nssm.exe" remove ${SERVICE_NAME} confirm'
    
    Delete "$INSTDIR\*.*"
    RMDir /r "$INSTDIR"
    
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
SectionEnd
