@echo off
echo ========================================
echo StegoCrypt - Frontend Setup and Run
echo ========================================
echo.

cd frontend

echo [1/2] Installing dependencies...
call npm install

echo [2/2] Starting development server...
echo.
echo ========================================
echo Frontend will start at http://localhost:3000
echo ========================================
echo.

call npm run dev
