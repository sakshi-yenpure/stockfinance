#!/bin/bash

# Plutus Deployment Script for Linux
# Exit on error
set -e

echo "🚀 Starting Plutus Deployment..."

# 1. Install Global Process Manager
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi

if ! command -v serve &> /dev/null; then
    echo "Installing 'serve' globally for frontend..."
    npm install -g serve
fi

# 2. Setup Backend
echo "📦 Setting up Backend..."
cd backend
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi
python manage.py migrate
cd ..

# 3. Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
npm install
npm run build
cd ..

# 4. Initialize Logs Directory
mkdir -p logs

# 5. Start Services with PM2
echo "🎬 Starting Plutus services..."
pm2 start ecosystem.config.js --env production

# 6. Persistence
echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment Complete! Visit http://localhost:3000"
