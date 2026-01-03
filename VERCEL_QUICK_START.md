# 🚀 Quick Vercel Deployment Reference

## One-Time Setup (5 minutes)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Setup database (choose one):
# - Vercel Postgres: https://vercel.com/dashboard/stores
# - Neon (free): https://neon.tech
# - Supabase (free): https://supabase.com
```

## Deploy Admin Dashboard

```bash
cd apps/admin

# Deploy to production
vercel --prod

# Set environment variable
vercel env add VITE_API_URL
# Enter: https://your-api.vercel.app

# Redeploy
vercel --prod
```

**Access**: Your app will be at `https://your-project.vercel.app`

## Deploy Backend API

```bash
cd packages/api

# Deploy to production
vercel --prod

# Add required environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV

# Redeploy
vercel --prod
```

**Access**: Your API will be at `https://your-api.vercel.app`

## Run Database Migrations

```bash
# Set production database URL
export DATABASE_URL="your-vercel-postgres-url"

# Run migrations
cd packages/database
npx prisma db push
npx prisma generate
```

## Required Environment Variables

### Admin Dashboard
```env
VITE_API_URL=https://your-api.vercel.app
```

### Backend API
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=random-32-character-string
NODE_ENV=production

# Optional (for features)
FLUTTERWAVE_SECRET_KEY=your-key
FLUTTERWAVE_PUBLIC_KEY=your-key
SMILE_PARTNER_ID=your-id
SMILE_API_KEY=your-key
TERMII_API_KEY=your-key
TERMII_SENDER_ID=DigiCoop
```

## Verify Deployment

```bash
# Check API health
curl https://your-api.vercel.app/health

# Check API endpoint
curl https://your-api.vercel.app/api/health

# Visit admin
open https://your-admin.vercel.app
```

## Update After Changes

```bash
# Push to GitHub (auto-deploys if configured)
git add .
git commit -m "Update"
git push

# OR manual deploy
vercel --prod
```

## Troubleshooting

### Build fails
```bash
# Check logs in Vercel dashboard
# Or clear cache and rebuild:
vercel --prod --force
```

### API 500 errors
- Check environment variables in Vercel dashboard
- View Function logs in Vercel
- Verify DATABASE_URL format

### CORS errors
- Add admin domain to CORS_ORIGINS in API
- Redeploy API

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **View Logs**: Project → Deployments → Click deployment → Functions
- **Environment Variables**: Project → Settings → Environment Variables
- **Custom Domains**: Project → Settings → Domains

## Complete Guide

See **VERCEL_DEPLOYMENT.md** for detailed instructions!
