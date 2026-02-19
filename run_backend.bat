@echo off
echo ========================================
echo StegoCrypt - Backend Setup and Run
echo ========================================
echo.

cd backend

echo [1/3] Creating virtual environment...
python -m venv venv

echo [2/3] Activating virtual environment...
call venv\Scripts\activate

echo [3/3] Installing dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo Setup Complete!
echo Starting FastAPI server...
echo ========================================
echo.

python main.py
