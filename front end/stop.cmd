@echo off
title Drug Repurposing - Stop Services

echo Stopping all services...
taskkill /fi "WINDOWTITLE eq Backend" /f > nul 2>&1
taskkill /fi "WINDOWTITLE eq Frontend" /f > nul 2>&1
echo Done.
timeout /t 2 /nobreak > nul
