# Vercel Deployment Guide for DigiCoop

Complete guide to deploy DigiCoop on Vercel (Admin Dashboard + Backend API).

## 🎯 Overview

We'll deploy:
1. **Admin Dashboard** - Static site on Vercel
2. **Backend API** - Serverless functions on Vercel

## 📋 Prerequisites

- [ ] Vercel account ([Sign up free](https://vercel.com/signup))
- [ ] GitHub account
- [ ] PostgreSQL database (see Database Setup below)
- [ ] Code pushed to GitHub

---

## 🗄️ Step 1: Database Setup

Vercel needs a PostgreSQL database. Choose one:

### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose a region close to your users
5. Copy the connection string

### Option B: Neon (Free PostgreSQL)

1. Visit [Neon.tech](https://neon.tech)
2. Sign up for free
3. Create a new project
4. Copy the connection string
5. Format: `postgresql://user:pass@host/database?sslmode=require`

### Option C: Supabase (Free PostgreSQL)

1. Visit [Supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (Direct Connection)

### Option D: Railway (Free tier available)

1. Visit [Railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string

---

## 🚀 Step 2: Deploy Admin Dashboard

### Method 1: Vercel Dashboard (Easiest)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect it as a monorepo

3. **Configure Admin Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://your-api.vercel.app
     ```
   - Note: You'll update this after deploying the API

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your admin will be live at `https://your-project.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy admin
cd apps/admin
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Scope: Select your account
# - Link to existing project? No
# - Project name: digicoop-admin
# - Directory: ./
# - Override settings? No

# Set environment variable
vercel env add VITE_API_URL

# Redeploy
vercel --prod
```

---

## 🔌 Step 3: Deploy Backend API

### Method 1: Vercel Dashboard

1. **Import API as separate project**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import same GitHub repository
   - This time configure for API

2. **Configure API Project**
   - **Framework Preset**: Other
   - **Root Directory**: `packages/api`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables** (CRITICAL!)
   ```
   DATABASE_URL = postgresql://user:pass@host/db
   JWT_SECRET = your-random-32-character-secret
   NODE_ENV = production
   
   # Optional (for features)
   FLUTTERWAVE_SECRET_KEY = your-key
   FLUTTERWAVE_PUBLIC_KEY = your-key
   SMILE_PARTNER_ID = your-id
   SMILE_API_KEY = your-key
   TERMII_API_KEY = your-key
   TERMII_SENDER_ID = DigiCoop
   ```

4. **Deploy**
   - Click "Deploy"
   - API will be at `https://your-api.vercel.app`

5. **Run Database Migrations**
   ```bash
   # After deployment, run migrations
   # You'll need to do this locally with the production DATABASE_URL
   
   # Set the production database URL
   export DATABASE_URL="your-vercel-postgres-url"
   
   # Run migrations
   cd packages/database
   npx prisma db push
   npx prisma generate
   ```

### Method 2: Vercel CLI

```bash
# Deploy API
cd packages/api
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

---

## 🔄 Step 4: Update Admin with API URL

1. **Copy your API URL** from Vercel (e.g., `https://digicoop-api.vercel.app`)

2. **Update Admin Environment Variable**
   - Go to Admin project in Vercel
   - Settings → Environment Variables
   - Edit `VITE_API_URL`
   - Set to your API URL
   - Click "Save"

3. **Redeploy Admin**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## 🔐 Step 5: Configure CORS

The API needs to allow requests from your admin domain.

**Option A: Update in Vercel Dashboard**

Add environment variable:
```
CORS_ORIGINS = https://your-admin.vercel.app,https://digicoop-admin.vercel.app
```

**Option B: Update API Code**

Edit `packages/api/src/app.ts`:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'https://your-admin.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Redeploy the API.

---

## ✅ Step 6: Verify Deployment

### Check Admin Dashboard
1. Visit your admin URL
2. Open browser DevTools (F12)
3. Check Console for errors
4. Verify pages load correctly

### Check API
```bash
# Health check
curl https://your-api.vercel.app/health

# Should return: {"status":"ok","timestamp":"..."}

# API health
curl https://your-api.vercel.app/api/health
```

### Test Full Integration
1. Open admin dashboard
2. Try to register a user (if implemented)
3. Check Network tab in DevTools
4. Verify API calls succeed

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Admin

1. Go to Admin project → Settings → Domains
2. Add your domain (e.g., `admin.digicoop.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### Add Custom Domain to API

1. Go to API project → Settings → Domains
2. Add your domain (e.g., `api.digicoop.com`)
3. Configure DNS
4. Update admin's `VITE_API_URL` to use new domain

---

## 🔧 Troubleshooting

### Build Fails

**Error: "Cannot find module"**
```bash
# Ensure all dependencies are in package.json
cd apps/admin
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: TypeScript errors**
- Check `tsconfig.json` settings
- Ensure `skipLibCheck: true` for faster builds

### API Returns 500 Error

**Check Vercel Logs:**
1. Go to API project → Deployments
2. Click latest deployment
3. Click "Functions" tab
4. Check error logs

**Common Issues:**
- Missing environment variables
- Database connection failed
- Prisma client not generated

**Fix:**
```bash
# Ensure DATABASE_URL is set
# Redeploy after adding env vars
vercel --prod
```

### Database Connection Issues

**Error: "Can't reach database server"**

1. **Check DATABASE_URL format:**
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```

2. **Verify database is accessible:**
   - Check if database allows external connections
   - Verify SSL is enabled (add `?sslmode=require`)

3. **Test connection locally:**
   ```bash
   export DATABASE_URL="your-url"
   npx prisma db push
   ```

### CORS Errors

**Error: "Access-Control-Allow-Origin"**

1. Add admin domain to API CORS settings
2. Check CORS_ORIGINS environment variable
3. Redeploy API

### Environment Variables Not Working

1. **Check variable names** (case-sensitive)
2. **Rebuild after adding variables**
3. **Use correct prefix:**
   - Admin: `VITE_` prefix
   - API: No prefix needed

---

## 📊 Monitoring & Logs

### View Logs

**Vercel Dashboard:**
1. Go to project → Deployments
2. Click deployment
3. View "Functions" tab for API logs
4. View "Build" tab for build logs

**Vercel CLI:**
```bash
# Tail logs for admin
vercel logs --follow

# Tail logs for API
vercel logs digicoop-api --follow
```

### Performance Monitoring

Vercel provides built-in analytics:
1. Go to project → Analytics
2. View page load times
3. Check error rates
4. Monitor bandwidth usage

---

## 🚀 Continuous Deployment

Vercel auto-deploys on:
- ✅ Push to main branch → Production
- ✅ Push to other branches → Preview deployments
- ✅ Pull requests → Preview URLs

### Configure Auto-Deploy

1. Go to project → Settings → Git
2. Enable "Production Branch": `main`
3. Enable "Preview Deployments"
4. Save

Now every `git push` triggers deployment!

---

## 💰 Pricing & Limits

### Vercel Free Tier (Hobby)

**Includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions (100 GB-hours)
- ✅ Preview deployments
- ✅ SSL certificates
- ✅ Analytics

**Limits:**
- ⚠️ Max 12 serverless deployments
- ⚠️ 10-second function timeout
- ⚠️ 50 MB function size

**Good for:** Testing, small apps, personal projects

### Vercel Pro ($20/month)

**Adds:**
- ✅ More bandwidth (1 TB)
- ✅ Team collaboration
- ✅ Password protection
- ✅ Advanced analytics

### Database Pricing

**Neon (Free tier):**
- ✅ 10 projects
- ✅ 3 GB storage
- ✅ Unlimited compute time

**Supabase (Free tier):**
- ✅ 500 MB database
- ✅ 1 GB file storage

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default secrets
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Add rate limiting (see advanced section)
- [ ] Review environment variables
- [ ] Set up monitoring/alerts
- [ ] Test authentication flow
- [ ] Verify database backups

---

## 🎯 Production Checklist

- [ ] Admin deployed successfully
- [ ] API deployed successfully
- [ ] Database connected and migrated
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Custom domains added (optional)
- [ ] SSL working
- [ ] Health checks passing
- [ ] All features tested
- [ ] Error tracking setup (optional)

---

## 🛠️ Advanced Configuration

### Add Monitoring with Sentry

1. **Sign up at [Sentry.io](https://sentry.io)**

2. **Add to API:**
   ```bash
   npm install @sentry/node
   ```

3. **Add environment variable:**
   ```
   SENTRY_DSN = your-sentry-dsn
   ```

### Add Rate Limiting

Install package:
```bash
npm install express-rate-limit
```

Update API:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Custom Build Command

In `vercel.json`:
```json
{
  "buildCommand": "npm run build && npx prisma generate"
}
```

---

## 📱 Next: Deploy Mobile App

For mobile app deployment:
- Use Expo Application Services (EAS)
- See: `apps/mobile/README.md` (create if needed)
- Update API URL in mobile app to Vercel URL

---

## 🎉 Success!

Your DigiCoop platform is now live on Vercel!

**URLs:**
- 🌐 Admin: `https://digicoop-admin.vercel.app`
- 🔌 API: `https://digicoop-api.vercel.app`

**Next steps:**
1. Configure custom domain
2. Set up monitoring
3. Deploy mobile app
4. Add analytics
5. Monitor performance

---

## 📞 Support

**Vercel Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Deploying Node.js](https://vercel.com/docs/frameworks/node)
- [Environment Variables](https://vercel.com/docs/environment-variables)

**Community:**
- [Vercel Discord](https://discord.gg/vercel)
- [Vercel GitHub Discussions](https://github.com/vercel/vercel/discussions)

---

**Happy Deploying! 🚀**
