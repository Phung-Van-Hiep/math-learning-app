#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Starting Development Servers${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Start backend
echo -e "${GREEN}🚀 Starting backend server...${NC}"
cd be
python main.py &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✅ Backend server started with PID: $BACKEND_PID${NC}\n"

# Start frontend
echo -e "${GREEN}🚀 Starting frontend servers...${NC}"
cd fe
npm run dev &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✅ Frontend servers started with PID: $FRONTEND_PID${NC}\n"

# Wait for processes to exit
wait $BACKEND_PID
wait $FRONTEND_PID
