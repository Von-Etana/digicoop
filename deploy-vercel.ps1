# PowerShell Vercel Deployment Script for DigiCoop
# Run this script from the project root

Write-Host "🚀 DigiCoop Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Install it with: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Vercel CLI found" -ForegroundColor Green
Write-Host ""

# Function to deploy admin
function Deploy-Admin {
    Write-Host "📦 Deploying Admin Dashboard..." -ForegroundColor Cyan
    Push-Location apps\admin
    
    if (-not (Test-Path "vercel.json")) {
        Write-Host "❌ vercel.json not found in apps\admin" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "Building admin..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    Pop-Location
    Write-Host "✅ Admin deployed!" -ForegroundColor Green
    Write-Host ""
}

# Function to deploy API
function Deploy-API {
    Write-Host "🔌 Deploying Backend API..." -ForegroundColor Cyan
    Push-Location packages\api
    
    if (-not (Test-Path "vercel.json")) {
        Write-Host "❌ vercel.json not found in packages\api" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "Building API..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    Pop-Location
    Write-Host "✅ API deployed!" -ForegroundColor Green
    Write-Host ""
}

# Main menu
Write-Host "What would you like to deploy?" -ForegroundColor Yellow
Write-Host "1) Admin Dashboard only"
Write-Host "2) Backend API only"
Write-Host "3) Both Admin and API"
Write-Host "4) Exit"
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Deploy-Admin
    }
    "2" {
        Deploy-API
    }
    "3" {
        Deploy-Admin
        Deploy-API
    }
    "4" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check your Vercel dashboard for deployment URLs"
Write-Host "2. Update VITE_API_URL in admin environment variables"
Write-Host "3. Configure CORS in API for your admin domain"
Write-Host "4. Test your deployment"
Write-Host ""
Write-Host "See VERCEL_DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
