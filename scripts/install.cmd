@echo off
REM CraftRoster installer for Windows CMD users.

echo.
echo  CraftRoster Installer
echo  Launching PowerShell installer...
echo.

powershell -ExecutionPolicy Bypass -NoProfile -Command "$script = irm 'https://raw.githubusercontent.com/HsinPu/CraftRoster/main/scripts/install.ps1'; & ([scriptblock]::Create($script)) @args" %*

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  Installation failed. Try running PowerShell directly:
    echo    powershell -ExecutionPolicy Bypass -NoProfile -Command "$script = irm 'https://raw.githubusercontent.com/HsinPu/CraftRoster/main/scripts/install.ps1'; ^& ([scriptblock]::Create($script)) -Agent codex"
    echo.
    pause
    exit /b 1
)
