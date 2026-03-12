@echo off
:: Plutus Deployment Script for Windows

echo 🚀 Starting Plutus Deployment on Windows...

:: 1. Check for PM2
where pm2 >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing PM2 globally...
    call npm install -g pm2
)

:: 2. Setup Backend
echo 📦 Setting up Backend...
cd backend
if exist requirements.txt (
    pip install -r requirements.txt
)
python manage.py migrate
cd ..

:: 3. Setup Frontend
echo 📦 Setting up Frontend...
cd frontend
call npm install
call npm run build
cd ..

:: 4. Initialize Logs Directory
if not exist logs mkdir logs

:: 5. Start Services with PM2
echo 🎬 Starting Plutus services...
pm2 start ecosystem.config.js --env production

:: 6. Persistence
echo 💾 Saving PM2 process list...
pm2 save

echo ✅ Deployment Complete! Visit http://localhost:3000
pause
