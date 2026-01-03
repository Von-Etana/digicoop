 # DigiCoop - Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Local Setup
- [x] Vercel CLI installed (v50.1.0)
- [ ] Logged into Vercel
- [ ] Code committed to Git
- [ ] PostgreSQL database ready

### Configuration Files Created
- [x] `apps/admin/vercel.json`
- [x] `packages/api/vercel.json`
- [x] `apps/admin/src/config.ts`
- [x] Updated `packages/api/src/app.ts`

### Documentation
- [x] `VERCEL_DEPLOYMENT.md` - Complete guide
- [x] `VERCEL_QUICK_START.md` - Quick reference
- [x] `deploy-vercel.ps1` - Windows deployment script
- [x] `deploy-vercel.sh` - Mac/Linux deployment script

---

## 🚀 Deployment Steps

### Step 1: Login to Vercel
```powershell
vercel login
```
- Opens browser
- Login with GitHub/GitLab/Bitbucket
- Authorize Vercel CLI

### Step 2: Setup Database

**Option A: Vercel Postgres (Recommended)**
1. Visit: https://vercel.com/dashboard/stores
2. Click "Create Database" → "Postgres"
3. Name: `digicoop-db`
4. Region: Choose closest to you
5. Click "Create"
6. Copy connection string from "Quickstart" tab

**Option B: Neon (Free)**
1. Visit: https://neon.tech
2. Sign up → Create project
3. Copy connection string
4. Format: `postgresql://user:pass@host/db?sslmode=require`

### Step 3: Deploy Backend API

```powershell
# Navigate to API directory
cd packages\api

# First deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - What's your project's name? digicoop-api
# - In which directory is your code located? ./
# - Override settings? No

# Add environment variables
vercel env add DATABASE_URL production
# Paste your database connection string

vercel env add JWT_SECRET production
# Enter a random 32+ character string

vercel env add NODE_ENV production
# Enter: production

# Deploy to production
vercel --prod
```

**Copy the production URL** (e.g., `https://digicoop-api.vercel.app`)

### Step 4: Run Database Migrations

```powershell
# Set environment variable temporarily
$env:DATABASE_URL = "your-database-connection-string"

# Navigate to database package
cd ..\..\packages\database

# Run migrations
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 5: Deploy Admin Dashboard

```powershell
# Navigate to admin directory
cd ..\..\apps\admin

# First deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - What's your project's name? digicoop-admin
# - In which directory is your code located? ./
# - Override settings? No

# Add environment variable
vercel env add VITE_API_URL production
# Enter your API URL: https://digicoop-api.vercel.app

# Deploy to production
vercel --prod
```

**Copy the production URL** (e.g., `https://digicoop-admin.vercel.app`)

### Step 6: Configure CORS

Update API to allow admin domain:

```powershell
# Add CORS environment variable to API
cd ..\..\packages\api

vercel env add CORS_ORIGINS production
# Enter: https://digicoop-admin.vercel.app

# Redeploy
vercel --prod
```

### Step 7: Verify Deployment

```powershell
# Test API health
curl https://digicoop-api.vercel.app/health

# Test API endpoint
curl https://digicoop-api.vercel.app/api/health

# Open admin in browser
start https://digicoop-admin.vercel.app
```

---

## 📋 Post-Deployment Tasks

### Configure Automatic Deployments

1. **Push code to GitHub**
   ```powershell
   git add .
   git commit -m "Add Vercel deployment config"
   git push origin main
   ```

2. **Link GitHub to Vercel**
   - Go to https://vercel.com/dashboard
   - Find your projects
   - Settings → Git → Link Repository
   - Now every push auto-deploys!

### Add Custom Domain (Optional)

**For Admin:**
1. Go to: https://vercel.com/dashboard
2. Select `digicoop-admin` project
3. Settings → Domains
4. Add domain: `admin.yourdomain.com`
5. Configure DNS as instructed

**For API:**
1. Select `digicoop-api` project
2. Settings → Domains
3. Add domain: `api.yourdomain.com`
4. Update admin's `VITE_API_URL` to new domain

### Setup Monitoring

1. **Enable Analytics**
   - Projects → Analytics → Enable

2. **Add Error Tracking** (Optional)
   - Sign up at https://sentry.io
   - Add Sentry to your project
   - Configure DSN in environment variables

---

## 🐛 Common Issues & Fixes

### Issue: "Command not found: vercel"
```powershell
# Install Vercel CLI globally
npm install -g vercel

# Verify installation
vercel --version
```

### Issue: Build fails with "MODULE_NOT_FOUND"
```powershell
# Clean node_modules and reinstall
cd apps\admin
Remove-Item -Recurse -Force node_modules
npm install

# Commit changes
git add package-lock.json
git commit -m "Update dependencies"

# Redeploy
vercel --prod
```

### Issue: API returns 500 errors
**Check Logs:**
1. Visit https://vercel.com/dashboard
2. Click on `digicoop-api` project
3. Deployments → Click latest → Functions tab
4. Check error logs

**Common fixes:**
- Verify DATABASE_URL is set correctly
- Ensure JWT_SECRET is added
- Check Prisma client is generated

### Issue: CORS errors in browser console
```powershell
# Add admin domain to API CORS
cd packages\api
vercel env add CORS_ORIGINS production
# Enter: https://your-admin-domain.vercel.app

# Redeploy
vercel --prod
```

### Issue: Database connection timeout
- Ensure database allows external connections
- Add `?sslmode=require` to DATABASE_URL
- Check database is running
- Verify connection string format

---

## 📊 Created URLs

After deployment, you'll have:

| Service | URL | Description |
|---------|-----|-------------|
| **Admin Dashboard** | `https://digicoop-admin.vercel.app` | Admin interface | 
| **Backend API** | `https://digicoop-api.vercel.app` | RESTful API |
| **API Health** | `https://digicoop-api.vercel.app/api/health` | Health check |
| **Vercel Dashboard** | `https://vercel.com/dashboard` | Manage deployments |

---

## 🎯 Quick Commands Reference

```powershell
# Login
vercel login

# Deploy current directory
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add VARIABLE_NAME production

# List environment variables
vercel env ls

# View deployment logs
vercel logs

# Remove deployment
vercel remove project-name

# Link local to Vercel project
vercel link
```

---

## ✅ Success Checklist

- [ ] Vercel CLI installed and logged in
- [ ] Database created and connection string copied
- [ ] API deployed successfully
- [ ] Database migrated
- [ ] Admin deployed successfully
- [ ] CORS configured
- [ ] Health checks passing
- [ ] Admin can access API
- [ ] GitHub linked for auto-deploy (optional)
- [ ] Custom domains added (optional)

---

## 🎉 Next Steps

1. **Test your deployment thoroughly**
2. **Set up custom domain** (optional)
3. **Configure automated backups** for database
4. **Enable monitoring** and analytics
5. **Deploy mobile app** to Expo
6. **Update mobile app** API URL to Vercel

---

## 📚 Resources

- **Complete Guide**: `VERCEL_DEPLOYMENT.md`
- **Quick Reference**: `VERCEL_QUICK_START.md`
- **Vercel Docs**: https://vercel.com/docs
- **Support**: https://vercel.com/support

---

**Ready to deploy? Run the deployment script or follow Step 1! 🚀**
