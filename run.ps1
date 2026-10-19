# AI Interview Prep - Complete One-Command Runner for VS Code
$ErrorActionPreference = "SilentlyContinue"
$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = "C:\Users\ashis\scratch\ai-interview" }

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   🚀 AI INTERVIEW PREP - AUTOMATED LAUNCHER              " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check & Start MariaDB (Port 3307)
$dbRunning = Get-NetTCPConnection -LocalPort 3307 -ErrorAction SilentlyContinue
if (-not $dbRunning) {
    Write-Host "[1/3] Starting Database (MariaDB on port 3307)..." -ForegroundColor Yellow
    $dbExe = "C:\Program Files\MariaDB 12.2\bin\mysqld.exe"
    $dbArgs = "--datadir=`"$scriptDir\mariadb-data`" --port=3307 --bind-address=127.0.0.1"
    Start-Process -FilePath $dbExe -ArgumentList $dbArgs -WindowStyle Minimized
    Start-Sleep -Seconds 2
} else {
    Write-Host "[1/3] Database is already running on port 3307." -ForegroundColor Green
}

# 2. Check & Start Backend (Port 8080)
$beRunning = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if (-not $beRunning) {
    Write-Host "[2/3] Starting Backend (Spring Boot on port 8080)..." -ForegroundColor Yellow
    $mvnCmd = "C:\Program Files\JetBrains\IntelliJ IDEA 2025.2\plugins\maven\lib\maven3\bin\mvn.cmd"
    $backendCmd = "/k cd /d `"$scriptDir\backend`" && `"$mvnCmd`" spring-boot:run"
    Start-Process -FilePath "cmd.exe" -ArgumentList $backendCmd
    Start-Sleep -Seconds 5
} else {
    Write-Host "[2/3] Backend is already running on port 8080." -ForegroundColor Green
}

# 3. Check & Start Frontend (Port 5173)
$feRunning = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if (-not $feRunning) {
    Write-Host "[3/3] Starting Frontend (React Vite on port 5173)..." -ForegroundColor Yellow
    $frontendCmd = "/k cd /d `"$scriptDir\frontend`" && npm.cmd run dev -- --host 127.0.0.1 --port 5173"
    Start-Process -FilePath "cmd.exe" -ArgumentList $frontendCmd
    Start-Sleep -Seconds 3
} else {
    Write-Host "[3/3] Frontend is already running on port 5173." -ForegroundColor Green
}
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   ALL SERVICES READY AND RUNNING!                        " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   Frontend Website: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend REST API: http://localhost:8080" -ForegroundColor White
Write-Host "   Database Server:  127.0.0.1:3307 (ai_interview_prep)" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green

# Open browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"
