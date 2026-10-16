#!/bin/bash

# SocialSphere Start Script for macOS / Linux
echo "================================================"
echo "Starting SocialSphere DAA Teaching Lab"
echo "================================================"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Trap SIGINT to kill background processes cleanly
cleanup() {
    echo ""
    echo "Shutting down SocialSphere services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "1. Launching FastAPI backend on http://127.0.0.1:8000..."
cd "$ROOT_DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "2. Launching Vite frontend on http://localhost:5174..."
cd "$ROOT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================================"
echo "SocialSphere DAA Teaching Lab is running!"
echo "Frontend: http://localhost:5174"
echo "Backend:  http://127.0.0.1:8000"
echo "API Docs: http://127.0.0.1:8000/docs"
echo "Press Ctrl+C to terminate both servers."
echo "================================================"

wait
