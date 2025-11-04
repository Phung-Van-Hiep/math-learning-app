@echo off
REM Windows batch script to start all services

echo ========================================
echo    THCS Math Website - Auto Start
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Start database
echo [1/5] Starting database containers...
docker-compose up -d

REM Wait for database
echo [2/5] Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Setup backend if needed
if not exist "be\venv" (
    echo [3/5] Setting up backend (first time)...
    cd be
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt -q
    python create_admin.py
    cd ..
) else (
    echo [3/5] Backend already set up.
)

REM Setup frontend if needed
if not exist "fe\node_modules" (
    echo [4/5] Setting up frontend (first time)...
    cd fe
    call npm install
    cd ..
) else (
    echo [4/5] Frontend already set up.
)

REM Start all services
echo [5/5] Starting all services...
echo.

REM Start backend
echo Starting Backend API...
start "Backend API" cmd /k "cd be && venv\Scripts\activate && python main.py"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start client
echo Starting Client App...
start "Client App" cmd /k "cd fe && npm run dev:client"

REM Wait a bit
timeout /t 2 /nobreak >nul

REM Start admin
echo Starting Admin App...
start "Admin App" cmd /k "cd fe && npm run dev:admin"

REM Wait for everything to start
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    All services are running!
echo ========================================
echo.
echo Access your application:
echo    Client:     http://localhost:3000
echo    Admin:      http://localhost:3001
echo    API:        http://localhost:9532
echo    API Docs:   http://localhost:9532/docs
echo    Database:   http://localhost:8085
echo.
echo Admin Login:
echo    Email:    admin@thcsnhuquynh.edu.vn
echo    Password: admin123
echo.
echo Close the command windows to stop services.
echo.
pause
