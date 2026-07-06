@echo off
title Drug Repurposing Launcher

:: تحديد مسار الفولدر الحالي تلقائياً بدون كتابته يدوياً
set "CURRENT_DIR=%~dp0"

:: تشغيل الباك إند تلقائياً بناءً على مكان الملف
start "Backend" cmd /k "cd /d "%CURRENT_DIR%backend" && npm run dev"

:: تشغيل الفرونت إند تلقائياً بناءً على مكان الملف
start "Frontend" cmd /k "cd /d "%CURRENT_DIR%drug-repurposing" && npm run dev"

cls
echo ============================================
echo   Drug Repurposing - Project Launcher
echo ============================================
echo.
echo  Backend  : http://localhost:8000
echo  Frontend : http://localhost:3000
echo.
echo  Close this window or press any key
echo  to stop all services.
echo ============================================
pause > nul

echo.
echo Stopping services...
taskkill /fi "WINDOWTITLE eq Backend" /f > nul 2>&1
taskkill /fi "WINDOWTITLE eq Frontend" /f > nul 2>&1
echo All services stopped.
timeout /t 2 /nobreak > nul