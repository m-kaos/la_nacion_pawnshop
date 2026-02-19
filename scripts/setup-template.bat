@echo off
REM ============================================================================
REM Template Setup Script (Windows)
REM
REM This script helps you quickly set up the e-commerce template for a new
REM client project on Windows.
REM
REM Usage:
REM   scripts\setup-template.bat
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         E-Commerce Template Setup                         ║
echo ║         KaoStore - Quick Setup Wizard                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check Docker
echo [*] Checking prerequisites...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Docker is not installed
    echo [i] Please install Docker Desktop: https://www.docker.com/products/docker-desktop
    exit /b 1
)
echo [✓] Docker is installed

REM Check Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [X] Docker Compose is not available
        exit /b 1
    )
)
echo [✓] Docker Compose is available

REM Check Node.js (optional)
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js is installed
) else (
    echo [!] Node.js not found (optional for Docker setup)
)

echo.
echo [*] Creating environment configuration...

REM Create .env file
if exist .env (
    echo [!] .env file already exists
    set /p OVERWRITE="Overwrite? (y/N): "
    if /i "!OVERWRITE!"=="y" (
        copy /y .env.example .env >nul
        echo [✓] Created new .env file
    ) else (
        echo [i] Keeping existing .env file
    )
) else (
    copy .env.example .env >nul
    echo [✓] Created .env file from .env.example
)

echo.
echo [*] Quick Customization (Optional)
set /p CUSTOMIZE="Do you want to set a custom store name? (y/N): "
if /i "!CUSTOMIZE!"=="y" (
    set /p STORE_NAME="Enter store name (e.g., MyStore): "
    if not "!STORE_NAME!"=="" (
        echo [i] Store name will be: !STORE_NAME!
        echo [!] You'll need to manually update these files:
        echo     - storefront/app/layout.tsx (line 12)
        echo     - storefront/components/Header.tsx (line 15)
        echo     - backend/src/vendure-config.ts (line 76)
        echo [i] See CUSTOMIZATION_GUIDE.md for detailed instructions
    )
)

echo.
echo [*] Starting Docker containers...
echo [i] This may take a few minutes on first run...
echo.

REM Start containers
docker-compose up -d
if %errorlevel% neq 0 (
    docker compose up -d
    if %errorlevel% neq 0 (
        echo [X] Failed to start Docker containers
        exit /b 1
    )
)

echo [✓] Docker containers started successfully

echo.
echo [i] Waiting for services to be ready (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo ✅ Setup Complete!
echo.
echo Your e-commerce template is now running!
echo.
echo Access your applications:
echo   🛍️  Storefront:       http://localhost:3000
echo   🔧 Admin Dashboard:  http://localhost:3001/admin
echo   📧 Dev Mailbox:      http://localhost:3001/mailbox
echo   🔌 GraphQL API:      http://localhost:3001/shop-api
echo.
echo Default admin credentials:
echo   Username: superadmin
echo   Password: superadmin
echo   ⚠️  Change these before deploying to production!
echo.
echo 📚 Next Steps:
echo 1. Open the storefront: http://localhost:3000
echo 2. Login to admin: http://localhost:3001/admin
echo 3. Add your products in the admin dashboard
echo 4. Customize branding - see CUSTOMIZATION_GUIDE.md
echo 5. Configure Stripe keys in .env for payments
echo 6. When ready to deploy - see DEPLOYMENT.md
echo.
echo [i] View logs: docker-compose logs -f
echo [i] Stop services: docker-compose down
echo [i] Restart: docker-compose restart
echo.
echo Happy building! 🎉
echo.

endlocal
