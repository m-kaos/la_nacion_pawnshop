#!/bin/bash

##############################################################################
# Template Setup Script
#
# This script helps you quickly set up the e-commerce template for a new
# client project. It will:
#   1. Check prerequisites (Docker, Node.js)
#   2. Create .env file from .env.example
#   3. Optionally update store name
#   4. Start Docker containers
#   5. Provide next steps
#
# Usage:
#   bash scripts/setup-template.sh
#   chmod +x scripts/setup-template.sh && ./scripts/setup-template.sh
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Helper functions
log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

log_header() {
    echo -e "\n${BLUE}${BOLD}$1${NC}\n"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    clear
    echo -e "${BLUE}${BOLD}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         E-Commerce Template Setup                         ║"
    echo "║         KaoStore - Quick Setup Wizard                      ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"

    # Step 1: Check prerequisites
    log_header "📋 Step 1: Checking Prerequisites"

    if command_exists docker; then
        log_success "Docker is installed"
    else
        log_error "Docker is not installed"
        log_info "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
        exit 1
    fi

    if command_exists docker-compose || docker compose version >/dev/null 2>&1; then
        log_success "Docker Compose is available"
    else
        log_error "Docker Compose is not available"
        log_info "Please install Docker Desktop which includes Docker Compose"
        exit 1
    fi

    if command_exists node; then
        NODE_VERSION=$(node -v)
        log_success "Node.js is installed: $NODE_VERSION"
    else
        log_warning "Node.js not found (optional for Docker setup)"
    fi

    if command_exists git; then
        log_success "Git is installed"
    else
        log_warning "Git not found (recommended for version control)"
    fi

    # Step 2: Create .env file
    log_header "📝 Step 2: Environment Configuration"

    if [ -f .env ]; then
        log_warning ".env file already exists"
        read -p "$(echo -e ${CYAN})Overwrite? (y/N): $(echo -e ${NC})" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.example .env
            log_success "Created new .env file"
        else
            log_info "Keeping existing .env file"
        fi
    else
        cp .env.example .env
        log_success "Created .env file from .env.example"
    fi

    # Step 3: Optional customization
    log_header "🎨 Step 3: Quick Customization (Optional)"

    read -p "$(echo -e ${CYAN})Do you want to set a custom store name now? (y/N): $(echo -e ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "$(echo -e ${CYAN})Enter store name (e.g., MyStore): $(echo -e ${NC})" STORE_NAME
        if [ -n "$STORE_NAME" ]; then
            log_info "Store name will be: $STORE_NAME"
            log_warning "You'll need to manually update these files:"
            echo "  - storefront/app/layout.tsx (line 12)"
            echo "  - storefront/components/Header.tsx (line 15)"
            echo "  - backend/src/vendure-config.ts (line 76)"
            log_info "See CUSTOMIZATION_GUIDE.md for detailed instructions"
        fi
    fi

    # Step 4: Start Docker containers
    log_header "🚀 Step 4: Starting Docker Containers"

    log_info "This may take a few minutes on first run..."
    echo

    if docker-compose up -d; then
        log_success "Docker containers started successfully"
    elif docker compose up -d; then
        log_success "Docker containers started successfully"
    else
        log_error "Failed to start Docker containers"
        exit 1
    fi

    # Wait for services to be ready
    log_info "Waiting for services to be ready (30 seconds)..."
    sleep 30

    # Step 5: Check service health
    log_header "🏥 Step 5: Service Health Check"

    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_warning "Backend may still be initializing..."
    fi

    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        log_success "Storefront is ready"
    else
        log_warning "Storefront may still be initializing..."
    fi

    # Success message
    log_header "✅ Setup Complete!"

    echo -e "${GREEN}Your e-commerce template is now running!${NC}\n"

    echo -e "${BOLD}Access your applications:${NC}"
    echo -e "  🛍️  Storefront:       ${CYAN}http://localhost:3000${NC}"
    echo -e "  🔧 Admin Dashboard:  ${CYAN}http://localhost:3001/admin${NC}"
    echo -e "  📧 Dev Mailbox:      ${CYAN}http://localhost:3001/mailbox${NC}"
    echo -e "  🔌 GraphQL API:      ${CYAN}http://localhost:3001/shop-api${NC}"
    echo ""

    echo -e "${BOLD}Default admin credentials:${NC}"
    echo -e "  Username: ${YELLOW}superadmin${NC}"
    echo -e "  Password: ${YELLOW}superadmin${NC}"
    echo -e "  ${RED}⚠️  Change these before deploying to production!${NC}"
    echo ""

    log_header "📚 Next Steps:"
    echo "1. Open the storefront: http://localhost:3000"
    echo "2. Login to admin: http://localhost:3001/admin"
    echo "3. Add your products in the admin dashboard"
    echo "4. Customize branding - see CUSTOMIZATION_GUIDE.md"
    echo "5. Configure Stripe keys in .env for payments"
    echo "6. When ready to deploy - see DEPLOYMENT.md"
    echo ""

    log_info "View logs: docker-compose logs -f"
    log_info "Stop services: docker-compose down"
    log_info "Restart: docker-compose restart"
    echo ""

    log_success "Happy building! 🎉"
    echo ""
}

# Run main function
main
