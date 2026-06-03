@echo off
REM Autoverse AI Agent Skills installer for Windows CMD users.

echo.
echo  Autoverse AI Agent Skills Installer
echo  Launching PowerShell installer...
echo.

powershell -ExecutionPolicy Bypass -NoProfile -Command "$script = irm 'https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1'; & ([scriptblock]::Create($script)) @args" %*

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  Installation failed. Try running PowerShell directly:
    echo    powershell -ExecutionPolicy Bypass -NoProfile -Command "$script = irm 'https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1'; ^& ([scriptblock]::Create($script)) -Agent codex"
    echo.
    pause
    exit /b 1
)
