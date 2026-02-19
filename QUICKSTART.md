# 🚀 Quick Start Guide

## Option 1: Windows

### Terminal 1 - Backend
```cmd
run_backend.bat
```

### Terminal 2 - Frontend
```cmd
run_frontend.bat
```

## Option 2: macOS/Linux

### Terminal 1 - Backend
```bash
chmod +x run_backend.sh
./run_backend.sh
```

### Terminal 2 - Frontend
```bash
chmod +x run_frontend.sh
./run_frontend.sh
```

## Option 3: Manual Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Test the Application

1. Open http://localhost:3000
2. Navigate to "Encode" page
3. Upload any image (PNG/JPEG)
4. Enter a test message: "Hello, this is a secret message!"
5. Optionally add a password
6. Click "Encode Message"
7. Download the stego image
8. Navigate to "Decode" page
9. Upload the stego image
10. Enter password if you used one
11. Click "Decode Message"
12. See your extracted message!

## Troubleshooting

**Backend won't start?**
- Ensure Python 3.10+ is installed: `python --version`
- Check if port 8000 is available
- Install dependencies manually: `pip install fastapi uvicorn pillow pycryptodome python-multipart`

**Frontend won't start?**
- Ensure Node.js 18+ is installed: `node --version`
- Clear cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**CORS errors?**
- Ensure backend is running on port 8000
- Check browser console for exact error
- Verify CORS settings in `backend/main.py`
