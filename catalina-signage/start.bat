@echo off
REM ============================================================
REM  Catalina Signage - boot launcher
REM  Intended to be run by Windows Task Scheduler at system start.
REM  Logs to: logs\server.log (in this folder)
REM ============================================================

setlocal EnableDelayedExpansion

REM Always operate from this script's own folder, no matter who launches it.
cd /d "%~dp0"

if not exist logs mkdir logs
set "LOGFILE=logs\server.log"

REM Task Scheduler often runs with a minimal PATH that doesn't include Node.
REM Try `node` first, then fall back to the standard install locations.
set "NODE_EXE=node"
where node >nul 2>&1
if errorlevel 1 (
    if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
    if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"
)

echo. >> "%LOGFILE%"
echo === Catalina Signage launcher started on %DATE% %TIME% === >> "%LOGFILE%"
echo Using node: %NODE_EXE% >> "%LOGFILE%"

:loop
"%NODE_EXE%" server.js >> "%LOGFILE%" 2>&1
echo --- server exited (code !ERRORLEVEL!) on %DATE% %TIME%, restarting in 5s --- >> "%LOGFILE%"
timeout /t 5 /nobreak >nul
goto loop
