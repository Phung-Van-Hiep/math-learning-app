#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   THCS Math Website - Auto Start${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo -e "${YELLOW}Please start Docker Desktop first.${NC}"
    exit 1
fi

# Start database
echo -e "${GREEN}🐳 Starting database containers...${NC}"
docker-compose up -d

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Check database health
if docker-compose ps | grep -q "healthy"; then
    echo -e "${GREEN}✅ Database is ready!${NC}\n"
else
    echo -e "${YELLOW}⚠️  Database is starting... (this may take a few more seconds)${NC}\n"
fi

# Setup backend if needed
if [ ! -d "be/venv" ]; then
    echo -e "${BLUE}📦 Setting up backend (first time)...${NC}"
    cd be
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt -q
    python create_admin.py
    cd ..
    echo -e "${GREEN}✅ Backend setup complete!${NC}\n"
fi

# Setup frontend if needed
if [ ! -d "fe/node_modules" ]; then
    echo -e "${BLUE}📦 Setting up frontend (first time)...${NC}"
    cd fe
    npm install -q
    cd ..
    echo -e "${GREEN}✅ Frontend setup complete!${NC}\n"
fi

# Start services
echo -e "${GREEN}🚀 Starting all services...${NC}\n"

# Start backend
echo -e "${BLUE}Starting Backend API...${NC}"
cd be
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend client
echo -e "${BLUE}Starting Client App...${NC}"
cd fe
npm run dev:client > /dev/null 2>&1 &
CLIENT_PID=$!

# Start frontend admin
echo -e "${BLUE}Starting Admin App...${NC}"
npm run dev:admin > /dev/null 2>&1 &
ADMIN_PID=$!
cd ..

sleep 3

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ All services are running!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}📱 Access your application:${NC}"
echo -e "   Client:     ${YELLOW}http://localhost:3000${NC}"
echo -e "   Admin:      ${YELLOW}http://localhost:3001${NC}"
echo -e "   API:        ${YELLOW}http://localhost:9532${NC}"
echo -e "   API Docs:   ${YELLOW}http://localhost:9532/docs${NC}"
echo -e "   Database:   ${YELLOW}http://localhost:8085${NC}"

echo -e "\n${BLUE}🔑 Admin Login:${NC}"
echo -e "   Email:    ${YELLOW}admin@thcsnhuquynh.edu.vn${NC}"
echo -e "   Password: ${YELLOW}admin123${NC}"

echo -e "\n${RED}Press Ctrl+C to stop all services${NC}\n"

# Trap to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all services...${NC}"
    kill $BACKEND_PID $CLIENT_PID $ADMIN_PID 2>/dev/null
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

trap cleanup INT TERM

# Keep script running
wait
