@echo off
chcp 65001 >nul
title FLIC 2026 - Museu Offline
cd /d "%~dp0"
if not exist "runtime\node.exe" (
 echo O pacote esta incompleto. Extraia todos os arquivos do ZIP.
 pause
 exit /b 1
)
"runtime\node.exe" "servidor.mjs" --abrir
if errorlevel 1 pause
