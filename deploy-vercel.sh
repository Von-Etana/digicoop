#!/bin/bash

# Vercel Deployment Script for DigiCoop
# This script helps deploy both Admin and API to Vercel

set -e  # Exit on error

echo "🚀 DigiCoop Vercel Deployment Script"
echo "====================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "Install it with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Function to deploy admin
deploy_admin() {
    echo "📦 Deploying Admin Dashboard..."
    cd apps/admin
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        echo "❌ vercel.json not found in apps/admin"
        exit 1
    fi
    
    echo "Building admin..."
    npm run build
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    cd ../..
    echo "✅ Admin deployed!"
    echo ""
}

# Function to deploy API
deploy_api() {
    echo "🔌 Deploying Backend API..."
    cd packages/api
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        echo "❌ vercel.json not found in packages/api"
        exit 1
    fi
    
    echo "Building API..."
    npm run build
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    cd ../..
    echo "✅ API deployed!"
    echo ""
}

# Main menu
echo "What would you like to deploy?"
echo "1) Admin Dashboard only"
echo "2) Backend API only"
echo "3) Both Admin and API"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_admin
        ;;
    2)
        deploy_api
        ;;
    3)
        deploy_admin
        deploy_api
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check your Vercel dashboard for deployment URLs"
echo "2. Update VITE_API_URL in admin environment variables"
echo "3. Configure CORS in API for your admin domain"
echo "4. Test your deployment"
echo ""
echo "See VERCEL_DEPLOYMENT.md for detailed instructions"
