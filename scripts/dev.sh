#!/bin/bash

# Frontend development script for Valux Frontend

case "$1" in
  start)
    echo "🚀 Starting Valux Frontend Development Server..."
    # Kill any existing processes on port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    # Kill any existing Next.js processes
    pkill -f "next dev" 2>/dev/null || true
    sleep 2
    echo "✅ Port 3000 cleared"
    
    # Start the development server in background
    nohup npm run dev > /dev/null 2>&1 &
    sleep 3
    
    # Check if server started successfully
    if lsof -i:3000 >/dev/null 2>&1; then
      echo "✅ Frontend server started successfully on port 3000"
      echo "🔗 Application: http://localhost:3000"
      echo "📱 Next.js ready for development"
    else
      echo "❌ Failed to start frontend server"
      exit 1
    fi
    ;;
    
  stop)
    echo "🛑 Stopping Valux Frontend Server..."
    # Kill processes using port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    # Kill Next.js processes
    pkill -f "next dev" 2>/dev/null || true
    # Remove lock file
    rm -f .next/cache/lock 2>/dev/null || true
    echo "✅ Frontend server stopped"
    ;;
    
  restart)
    $0 stop
    sleep 3
    $0 start
    ;;
    
  status)
    echo "📊 Frontend Server Status:"
    if lsof -i:3000 >/dev/null 2>&1; then
      echo "✅ Frontend server is running on port 3000"
      echo "🔗 Application: http://localhost:3000"
    else
      echo "❌ Frontend server is not running"
    fi
    ;;
    
  build)
    echo "🔨 Building Valux Frontend for production..."
    npm run build
    if [ $? -eq 0 ]; then
      echo "✅ Frontend build completed successfully"
      echo "📦 Production build ready in .next/"
    else
      echo "❌ Frontend build failed"
      exit 1
    fi
    ;;
    
  preview)
    echo "👀 Starting production preview server..."
    # Kill any existing processes on port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
    
    # Start production server
    nohup npm start > /dev/null 2>&1 &
    sleep 3
    
    if lsof -i:3000 >/dev/null 2>&1; then
      echo "✅ Production preview started on port 3000"
      echo "🔗 Preview: http://localhost:3000"
    else
      echo "❌ Failed to start production preview"
      exit 1
    fi
    ;;
    
  test)
    echo "🧪 Running frontend tests..."
    npm run test
    ;;
    
  lint)
    echo "🔍 Running ESLint validation..."
    npm run lint
    if [ $? -eq 0 ]; then
      echo "✅ Linting passed"
    else
      echo "❌ Linting failed - please fix the issues"
      exit 1
    fi
    ;;
    
  type-check)
    echo "📝 Running TypeScript type checking..."
    npm run type-check
    if [ $? -eq 0 ]; then
      echo "✅ Type checking passed"
    else
      echo "❌ Type checking failed - please fix the issues"
      exit 1
    fi
    ;;
    
  clean)
    echo "🧹 Cleaning frontend build artifacts..."
    rm -rf .next
    rm -rf node_modules/.cache
    rm -rf .eslintcache
    echo "✅ Frontend cleaned"
    ;;
    
  deps)
    echo "📦 Installing/updating dependencies..."
    npm install
    echo "✅ Dependencies updated"
    ;;
    
  *)
    echo "Usage: $0 {start|stop|restart|status|build|preview|test|lint|type-check|clean|deps}"
    echo ""
    echo "Commands:"
    echo "  start      - Start the development server (clears port conflicts)"
    echo "  stop       - Stop the development server"
    echo "  restart    - Restart the development server"
    echo "  status     - Check development server status"
    echo "  build      - Build for production"
    echo "  preview    - Start production preview server"
    echo "  test       - Run test suite"
    echo "  lint       - Run ESLint validation"
    echo "  type-check - Run TypeScript type checking"
    echo "  clean      - Clean build artifacts and cache"
    echo "  deps       - Install/update dependencies"
    echo ""
    echo "Examples:"
    echo "  ./scripts/dev.sh start     # Start development server"
    echo "  ./scripts/dev.sh build     # Build for production"
    echo "  ./scripts/dev.sh lint      # Check code quality"
    exit 1
    ;;
esac