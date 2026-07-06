#!/bin/bash

# PharmacyHub Deployment Script
# Usage: ./deploy.sh [setup|deploy|update|migrate|seed]

set -e

echo "🏥 PharmacyHub Deployment Script"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
success() { echo -e "${GREEN}✓ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; exit 1; }

# Setup command
setup() {
    echo "📦 Setting up project..."
    
    # Check prerequisites
    command -v docker >/dev/null 2>&1 || error "Docker is not installed"
    command -v docker-compose >/dev/null 2>&1 || error "Docker Compose is not installed"
    
    # Copy environment file
    if [ ! -f backend/.env ]; then
        cp backend/.env.production backend/.env
        warning "Created .env from .env.production - Please update with your values"
    fi
    
    # Generate app key
    docker-compose exec app php artisan key:generate
    success "App key generated"
    
    # Start containers
    docker-compose up -d
    success "Containers started"
    
    # Wait for database
    echo "⏳ Waiting for database..."
    sleep 10
    
    # Run migrations
    docker-compose exec app php artisan migrate --force
    success "Migrations completed"
    
    # Seed database
    docker-compose exec app php artisan db:seed
    success "Database seeded"
    
    # Install frontend dependencies
    docker-compose run --rm frontend npm ci
    success "Frontend dependencies installed"
    
    # Build frontend
    docker-compose run --rm frontend npm run build
    success "Frontend built"
    
    # Cache configurations
    docker-compose exec app php artisan config:cache
    docker-compose exec app php artisan route:cache
    docker-compose exec app php artisan view:cache
    success "Caches warmed"
    
    echo ""
    success "Setup complete! 🎉"
    echo "Access: http://localhost"
}

# Deploy command
deploy() {
    echo "🚀 Deploying..."
    
    # Pull latest changes
    git pull origin main
    success "Code updated"
    
    # Update dependencies
    docker-compose exec app composer install --no-dev --optimize-autoloader
    success "Backend dependencies updated"
    
    # Run migrations
    docker-compose exec app php artisan migrate --force
    success "Migrations run"
    
    # Clear and rebuild caches
    docker-compose exec app php artisan config:cache
    docker-compose exec app php artisan route:cache
    docker-compose exec app php artisan view:cache
    docker-compose exec app php artisan event:cache
    success "Caches rebuilt"
    
    # Restart queue workers
    docker-compose exec app php artisan queue:restart
    success "Queue restarted"
    
    # Build frontend
    docker-compose run --rm frontend npm run build
    success "Frontend built"
    
    # Restart containers
    docker-compose restart
    success "Containers restarted"
    
    echo ""
    success "Deployment complete! 🎉"
}

# Update command
update() {
    echo "🔄 Updating..."
    
    docker-compose exec app composer update
    docker-compose exec app php artisan migrate
    docker-compose run --rm frontend npm update
    docker-compose run --rm frontend npm run build
    
    success "Update complete"
}

# Migrate command
migrate() {
    echo "🗃️ Running migrations..."
    docker-compose exec app php artisan migrate --force
    success "Migrations complete"
}

# Seed command
seed() {
    echo "🌱 Seeding database..."
    docker-compose exec app php artisan db:seed --force
    success "Database seeded"
}

# Status command
status() {
    echo "📊 Container Status:"
    docker-compose ps
    
    echo ""
    echo "📈 Health Check:"
    curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || echo "Backend: Down"
    echo ""
}

# Main
case "$1" in
    setup)
        setup
        ;;
    deploy)
        deploy
        ;;
    update)
        update
        ;;
    migrate)
        migrate
        ;;
    seed)
        seed
        ;;
    status)
        status
        ;;
    *)
        echo "Usage: $0 {setup|deploy|update|migrate|seed|status}"
        exit 1
        ;;
esac
