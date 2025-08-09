#!/bin/bash

# Development Docker Compose Script
# This script provides easy commands for development with live reloading

case "$1" in
    "start")
        echo "🚀 Starting development environment with live reloading..."
        docker compose -f docker-compose.dev.yml up --build
        ;;
    "start-detached")
        echo "🚀 Starting development environment in background..."
        docker compose -f docker-compose.dev.yml up --build -d
        ;;
    "stop")
        echo "🛑 Stopping development environment..."
        docker compose -f docker-compose.dev.yml down
        ;;
    "logs")
        echo "📋 Showing logs..."
        docker compose -f docker-compose.dev.yml logs -f
        ;;
    "logs-frontend")
        echo "📋 Showing frontend logs..."
        docker compose -f docker-compose.dev.yml logs -f frontend
        ;;
    "logs-backend")
        echo "📋 Showing backend logs..."
        docker compose -f docker-compose.dev.yml logs -f backend
        ;;
    "restart")
        echo "🔄 Restarting development environment..."
        docker compose -f docker-compose.dev.yml down
        docker compose -f docker-compose.dev.yml up --build -d
        ;;
    "clean")
        echo "🧹 Cleaning up development environment..."
        docker compose -f docker-compose.dev.yml down -v
        docker system prune -f
        ;;
    "shell-frontend")
        echo "🐚 Opening shell in frontend container..."
        docker compose -f docker-compose.dev.yml exec frontend sh
        ;;
    "shell-backend")
        echo "🐚 Opening shell in backend container..."
        docker compose -f docker-compose.dev.yml exec backend sh
        ;;
    *)
        echo "🐳 Development Docker Compose Commands:"
        echo ""
        echo "  ./dev.sh start           - Start development environment"
        echo "  ./dev.sh start-detached  - Start in background"
        echo "  ./dev.sh stop            - Stop development environment"
        echo "  ./dev.sh restart         - Restart development environment"
        echo "  ./dev.sh logs            - Show all logs"
        echo "  ./dev.sh logs-frontend   - Show frontend logs only"
        echo "  ./dev.sh logs-backend    - Show backend logs only"
        echo "  ./dev.sh clean           - Clean up containers and volumes"
        echo "  ./dev.sh shell-frontend  - Open shell in frontend container"
        echo "  ./dev.sh shell-backend   - Open shell in backend container"
        echo ""
        echo "Development servers will be available at:"
        echo "  Frontend: http://localhost:5173"
        echo "  Backend:  http://localhost:4000"
        ;;
esac
