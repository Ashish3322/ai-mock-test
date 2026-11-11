@echo off
title AI Interview Prep - Stopper
echo ========================================================
echo   Stopping AI Interview Prep Services...
echo ========================================================
echo.

echo Stopping Vite (node on 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Stopping Spring Boot (java on 8080)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Stopping MariaDB (mysqld on 3307)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3307') do taskkill /F /PID %%a 2>nul
taskkill /F /FI "WINDOWTITLE eq MariaDB (Port 3307)*" 2>nul

echo.
echo All services have been stopped.
pause
