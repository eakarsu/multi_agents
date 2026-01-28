#!/bin/bash

# CraftAgent Pro - Complete Development Environment Startup Script
# This script handles port cleanup, environment setup, and service startup

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_PORT=3000
BACKEND_PORT=8000
DB_PORT=5432
REDIS_PORT=6379

echo -e "${BLUE}🚀 Starting CraftAgent Pro Development Environment${NC}"
echo "=============================================="

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local service_name=$2
    
    echo -e "${YELLOW}🔍 Checking port ${port} for ${service_name}...${NC}"
    
    # Find and kill processes using the port (try multiple times)
    for attempt in 1 2 3; do
        local pids=$(lsof -ti:$port 2>/dev/null || true)
        
        if [ -z "$pids" ]; then
            echo -e "${GREEN}✅ Port ${port} is free${NC}"
            return 0
        fi
        
        echo -e "${RED}💀 Found processes on port ${port}: ${pids} (attempt ${attempt})${NC}"
        
        # Force kill immediately - no graceful shutdown needed for development
        echo "$pids" | xargs kill -9 2>/dev/null || true
        
        # Wait and check again
        sleep 2
    done
    
    # Final aggressive cleanup
    echo -e "${RED}🔨 Aggressive cleanup for port ${port}...${NC}"
    
    # Kill any node processes that might be using the port
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "react-scripts" 2>/dev/null || true
    
    # Kill by port again
    local final_pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$final_pids" ]; then
        echo "$final_pids" | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    
    # Final check
    local final_check=$(lsof -ti:$port 2>/dev/null || true)
    if [ -z "$final_check" ]; then
        echo -e "${GREEN}✅ Port ${port} cleared successfully${NC}"
    else
        echo -e "${RED}❌ Unable to clear port ${port}. You may need to manually kill process: ${final_check}${NC}"
        echo -e "${YELLOW}💡 Try: kill -9 ${final_check}${NC}"
        exit 1
    fi
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for service
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=60
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for ${service_name} to start on port ${port}...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        # Check if port is listening
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${GREEN}✅ ${service_name} is ready on port ${port}${NC}"
            return 0
        fi
        
        # Show progress every 5 seconds
        if [ $((attempt % 5)) -eq 0 ]; then
            echo -e "${YELLOW}   Still waiting... (${attempt}/${max_attempts})${NC}"
        else
            echo -n "."
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ ${service_name} failed to start on port ${port} after ${max_attempts} seconds${NC}"
    echo -e "${YELLOW}💡 Check the service logs for errors${NC}"
    return 1
}

# Step 1: Clean up existing processes
echo -e "\n${BLUE}🧹 Cleaning up existing processes...${NC}"
kill_port $FRONTEND_PORT "React Frontend"
kill_port $BACKEND_PORT "Backend API"
kill_port $DB_PORT "PostgreSQL"
kill_port $REDIS_PORT "Redis"

# Step 2: Check required dependencies
echo -e "\n${BLUE}🔧 Checking dependencies...${NC}"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

# Check if Docker is available (for future backend services)
if command_exists docker; then
    echo -e "${GREEN}✅ Docker found (ready for backend services)${NC}"
else
    echo -e "${YELLOW}⚠️  Docker not found (backend services will be limited)${NC}"
fi

# Step 3: Environment setup
echo -e "\n${BLUE}🌍 Setting up environment...${NC}"

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found, creating from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env from .env.example${NC}"
        echo -e "${YELLOW}📝 Please update .env with your API keys${NC}"
    else
        echo -e "${RED}❌ No .env.example found${NC}"
    fi
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Validate required environment variables
if [ -f ".env" ]; then
    source .env
    
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${YELLOW}⚠️  ANTHROPIC_API_KEY not set in .env${NC}"
        echo -e "${YELLOW}   Demo will use fallback responses${NC}"
    else
        echo -e "${GREEN}✅ Anthropic API key configured for backend${NC}"
    fi
    
    if [ -z "$REACT_APP_BACKEND_URL" ]; then
        echo -e "${YELLOW}⚠️  REACT_APP_BACKEND_URL not set, using default: http://localhost:8000${NC}"
    else
        echo -e "${GREEN}✅ Backend URL configured: $REACT_APP_BACKEND_URL${NC}"
    fi
fi

# Step 4: Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"

if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing npm dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies up to date${NC}"
fi

# Step 5: Database setup (placeholder for future backend)
echo -e "\n${BLUE}🗄️  Database setup...${NC}"
echo -e "${YELLOW}📝 Note: Database services not yet implemented${NC}"
echo -e "${YELLOW}   Future: PostgreSQL + Redis setup will be added here${NC}"

# TODO: Add database initialization when backend is implemented
# docker-compose up -d postgres redis
# wait_for_service $DB_PORT "PostgreSQL"
# wait_for_service $REDIS_PORT "Redis"
# npm run db:migrate
# npm run db:seed

# Step 6: Backend setup
echo -e "\n${BLUE}🚀 Backend setup...${NC}"

# Check if backend directory exists
if [ -d "backend" ]; then
    echo -e "${GREEN}✅ Backend directory found${NC}"
    
    # Install backend dependencies
    cd backend
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        echo -e "${YELLOW}📥 Installing backend dependencies...${NC}"
        npm install
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${GREEN}✅ Backend dependencies up to date${NC}"
    fi
    
    # Backend uses the root .env file
    echo -e "${GREEN}✅ Backend will use root .env configuration${NC}"
    
    # Start backend server
    echo -e "${YELLOW}🚀 Starting backend server...${NC}"
    
    # Start backend with output redirection for debugging
    npm start > ../backend.log 2>&1 &
    backend_pid=$!
    echo -e "${GREEN}✅ Backend started with PID: ${backend_pid}${NC}"
    cd ..
    
    # Wait for backend to be ready
    if wait_for_service $BACKEND_PORT "Backend API"; then
        echo -e "${GREEN}✅ Backend API is running${NC}"
    else
        echo -e "${RED}❌ Backend failed to start. Check backend.log for details:${NC}"
        if [ -f "backend.log" ]; then
            tail -10 backend.log
        fi
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Backend directory not found${NC}"
    echo -e "${YELLOW}   API calls will fail - backend is required for Anthropic integration${NC}"
fi

# Step 7: Start Frontend
echo -e "\n${BLUE}🎨 Starting Frontend...${NC}"

# Build if needed
if [ "$1" = "--build" ]; then
    echo -e "${YELLOW}🔨 Building frontend...${NC}"
    npm run build
    echo -e "${GREEN}✅ Frontend built${NC}"
fi

# Start React development server
echo -e "${YELLOW}🚀 Starting React development server...${NC}"

# Start frontend with explicit port 3000
PORT=3000 BROWSER=none npm start > frontend.log 2>&1 &
frontend_pid=$!
echo -e "${GREEN}✅ Frontend started with PID: ${frontend_pid}${NC}"

# Wait for frontend to be ready
if wait_for_service $FRONTEND_PORT "React Frontend"; then
    echo -e "${GREEN}✅ React Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend failed to start. Check frontend.log for details:${NC}"
    if [ -f "frontend.log" ]; then
        tail -10 frontend.log
    fi
    exit 1
fi

# Step 8: Health checks
echo -e "\n${BLUE}🏥 Running health checks...${NC}"

# Check frontend health
if curl -s http://localhost:$FRONTEND_PORT > /dev/null; then
    echo -e "${GREEN}✅ Frontend health check passed${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
fi

# Step 9: Success message and next steps
echo -e "\n${GREEN}🎉 CraftAgent Pro Development Environment Started Successfully!${NC}"
echo "=============================================="
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:${FRONTEND_PORT}"
echo -e "${BLUE}🔧 Backend:${NC} http://localhost:${BACKEND_PORT} ${YELLOW}(coming soon)${NC}"
echo -e "${BLUE}🗄️  Database:${NC} localhost:${DB_PORT} ${YELLOW}(coming soon)${NC}"
echo ""
echo -e "${BLUE}🛠️  Available Commands:${NC}"
echo "  • Frontend: http://localhost:${FRONTEND_PORT}"
echo "  • Demos: http://localhost:${FRONTEND_PORT}/#demo"
echo "  • Agent Templates: Browse 50+ pre-configured agents"
echo "  • API Integration: Anthropic Claude powered responses"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  • DEMO_SETUP.md - Demo configuration guide"
echo "  • README.md - Project overview"
echo ""
echo -e "${BLUE}🔧 Development:${NC}"
echo "  • npm run lint - Check code quality"
echo "  • npm run build - Build for production"
echo "  • npm test - Run tests"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "  1. Configure your Anthropic API key in .env"
echo "  2. Test the customer support demo"
echo "  3. Explore agent templates"
echo "  4. Try content creation and lead qualification demos"
echo ""
echo -e "${GREEN}🚀 Happy coding with CraftAgent Pro!${NC}"

# Keep the script running to monitor services
echo -e "\n${BLUE}👀 Monitoring services... (Press Ctrl+C to stop all)${NC}"

# Trap Ctrl+C to clean shutdown
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill_port $FRONTEND_PORT "React Frontend"
    kill_port $BACKEND_PORT "Backend API"
    # kill_port $DB_PORT "PostgreSQL"
    # kill_port $REDIS_PORT "Redis"
    
    # Clean up temporary files
    rm -f frontend.log backend.log
    
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

trap cleanup INT

# Wait for user to stop
while true; do
    sleep 1
done