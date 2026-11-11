@echo off
title AI Interview Prep - Starter
echo ========================================================
echo   AI Interview Prep - Automated Service Launcher
echo ========================================================
echo.

set SCRIPT_DIR=%~dp0
set MARIADB_EXE="C:\Program Files\MariaDB 12.2\bin\mysqld.exe"
set MVN_CMD="C:\Program Files\JetBrains\IntelliJ IDEA 2025.2\plugins\maven\lib\maven3\bin\mvn.cmd"

echo [1/3] Starting Database (MariaDB on port 3307)...
start "MariaDB (Port 3307)" %MARIADB_EXE% --defaults-file="%SCRIPT_DIR%mariadb-data\my.ini" --console

echo Waiting 3 seconds for database to initialize...
timeout /t 3 /nobreak > nul

echo [2/3] Starting Backend (Spring Boot on port 8080)...
start "AI Interview Prep Backend (Port 8080)" cmd /k "cd /d ""%SCRIPT_DIR%backend"" && %MVN_CMD% spring-boot:run"

echo Waiting 6 seconds for backend to start up...
timeout /t 6 /nobreak > nul

echo [3/3] Starting Frontend (Vite on port 5173)...
start "AI Interview Prep Frontend (Port 5173)" cmd /k "cd /d ""%SCRIPT_DIR%frontend"" && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ========================================================
echo   All services launched!
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:8080
echo   Database:  127.0.0.1:3307 (ai_interview_prep)
echo ========================================================
echo.
pause
