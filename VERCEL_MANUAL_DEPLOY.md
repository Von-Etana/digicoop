# Manual Vercel Deployment Guide - Admin Dashboard Only

Complete guide to manually deploy the DigiCoop Admin Dashboard to Vercel using the web interface (no CLI needed).

## 🎯 Overview

We'll deploy the **Admin Dashboard** (React + Vite app) using Vercel's web dashboard.

**Time Required:** 10-15 minutes

---

## 📋 Prerequisites

- [ ] Vercel account ([Sign up free](https://vercel.com/signup))
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Backend API URL (or use localhost for testing)

---

## 🚀 Method 1: Deploy from GitHub (Recommended)

### Step 1: Push Your Code to GitHub

```powershell
# If not already on GitHub, create a new repository
# Visit: https://github.com/new

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit for Vercel deployment"

# Add remote and push
git remote add origin https://github.com/yourusername/digicoop.git
git branch -M main
git push -u origin main
```

### Step 2: Import Project to Vercel

1. **Visit Vercel Dashboard**
   - Go to: https://vercel.com/new
   - Sign in with your account

2. **Import Git Repository**
   - Click **"Import Git Repository"**
   - Or click **"+ Add New"** → **"Project"**
   
3. **Select Your Repository**
   - If first time, click **"Install Vercel for GitHub"**
   - Select your repository: `digicoop`
   - Click **"Import"**

### Step 3: Configure Project Settings

Vercel will detect it's a monorepo. Configure as follows:

**Framework Preset:**
- Select: **"Vite"** (should auto-detect)

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Enter: `apps/admin`
- Click **"Continue"**

**Build and Output Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Leave these as default or enter manually if needed.

### Step 4: Configure Environment Variables

1. Click **"Environment Variables"** section

2. Add the following variable:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_API_URL` | `http://localhost:3001` | Production |

   > **Note:** For now, use localhost. After deploying the API, update this to your API URL.

3. Click **"Add"**

### Step 5: Deploy!

1. Click **"Deploy"** button

2. Wait for deployment (2-3 minutes)
   - You'll see build logs in real-time
   - Build steps:
     - Installing dependencies
     - Building application
     - Optimizing assets
     - Deploying to edge network

3. **Success!** 🎉
   - You'll see: "Congratulations!"
   - Your URL: `https://your-project.vercel.app`

### Step 6: Access Your Admin Dashboard

1. Click **"Visit"** or the **URL** shown

2. Your admin dashboard is now live!

3. **Copy your URL** for later use

---

## 🚀 Method 2: Deploy via Drag & Drop (No Git Required)

If you don't want to use Git, you can deploy directly:

### Step 1: Build Your Project Locally

```powershell
# Navigate to admin directory
cd apps\admin

# Install dependencies (if not done)
npm install

# Build for production
npm run build

# The 'dist' folder is created with your built app
```

### Step 2: Upload to Vercel

1. **Visit:** https://vercel.com/new

2. **Select "Deploy with Zero Configuration"**

3. **Drag and Drop:**
   - Open File Explorer
   - Navigate to `apps\admin\dist` folder
   - Drag the **entire `dist` folder** to Vercel website
   - Drop it in the upload area

4. **Configure Project:**
   - Project Name: `digicoop-admin`
   - Click **"Deploy"**

5. **Wait for deployment** (1-2 minutes)

6. **Your app is live!**
   - URL: `https://digicoop-admin.vercel.app`

> **Note:** This method doesn't support auto-redeploys. You'll need to re-upload for updates.

---

## 🔧 Method 3: Using Vercel Desktop App

1. **Download Vercel Desktop**
   - Visit: https://vercel.com/download
   - Download for Windows
   - Install the app

2. **Sign In**
   - Open Vercel Desktop
   - Sign in with your account

3. **Deploy from Local Folder**
   - Click **"+ New Project"**
   - Select **"Import Local Project"**
   - Browse to: `C:\Users\Stephen\Documents\Digicoop\apps\admin`
   - Click **"Deploy"**

4. **Configure Settings** (same as Method 1)

5. **Deploy!**

---

## ⚙️ After Deployment: Update API URL

Once your API is deployed (or if using a different API), update the environment variable:

### Using Vercel Dashboard:

1. **Go to your project**
   - Visit: https://vercel.com/dashboard
   - Click on your `digicoop-admin` project

2. **Settings → Environment Variables**
   - Click **"Settings"** tab
   - Click **"Environment Variables"**

3. **Edit VITE_API_URL**
   - Find `VITE_API_URL`
   - Click **"Edit"**
   - Change value to your API URL:
     ```
     https://your-api.vercel.app
     ```
     or
     ```
     https://digicoop-api.vercel.app
     ```
   - Click **"Save"**

4. **Redeploy**
   - Go to **"Deployments"** tab
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**
   - Check **"Use existing Build Cache"** (faster)
   - Click **"Redeploy"**

5. **Wait for redeployment** (1-2 minutes)

6. **Test your app** with the new API URL

---

## 🔄 Automatic Deployments (Recommended Setup)

After initial deployment, enable automatic deployments for convenience:

### Configure Git Integration:

1. **In your Vercel project:**
   - Settings → **"Git"**

2. **Production Branch:**
   - Set to: `main` (or `master`)
   - Every push to this branch auto-deploys to production

3. **Preview Deployments:**
   - Enable for all branches
   - Every PR gets a preview URL

4. **Save Settings**

Now, whenever you push code:
```powershell
git add .
git commit -m "Update admin dashboard"
git push
```

Vercel automatically:
- Builds your app
- Runs tests (if configured)
- Deploys to production
- Updates your URL

---

## 🎨 Customize Your Deployment

### Add Custom Domain

1. **Go to project → Settings → Domains**

2. **Add Domain:**
   - Enter: `admin.yourdomain.com`
   - Click **"Add"**

3. **Configure DNS:**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: admin
     Value: cname.vercel-dns.com
     ```

4. **Wait for verification** (5-60 minutes)

5. **Your app is now at:** `https://admin.yourdomain.com`

### Update Project Name

1. **Settings → General**
2. **Project Name:** Change if needed
3. **Save**

### Configure Build Settings

1. **Settings → General**
2. Scroll to **"Build & Development Settings"**
3. Adjust if needed:
   - Build Command
   - Output Directory
   - Install Command

---

## 📊 Monitor Your Deployment

### View Deployment Status

1. **Deployments Tab:**
   - See all deployments
   - View build logs
   - Check deployment status

2. **Each Deployment Shows:**
   - Commit message
   - Branch name
   - Build duration
   - Deployment URL
   - Build logs

### View Analytics

1. **Analytics Tab:**
   - Page views
   - Top pages
   - Load times
   - Visitor locations

### View Logs

1. **Click on a deployment**
2. **View different log types:**
   - Build logs
   - Function logs (if using serverless)
   - Runtime logs

---

## ✅ Verification Steps

After deployment, verify everything works:

### 1. Check Homepage
```
Visit: https://your-project.vercel.app
Expected: Admin dashboard loads
```

### 2. Check Routing
```
Click navigation links
Expected: All pages load correctly
```

### 3. Check Console (F12)
```
Open DevTools → Console
Expected: No errors (except API connection if not deployed yet)
```

### 4. Check Network Tab
```
DevTools → Network
Expected: All assets load (200 status)
```

### 5. Test API Connection
```
Try features that call API
Expected: 
- If API deployed: Works ✅
- If API not deployed: CORS/Network error (expected)
```

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Command failed with exit code 1"**

**Solution:**
1. Check build logs in Vercel
2. Build locally first:
   ```powershell
   cd apps\admin
   npm run build
   ```
3. Fix any errors shown
4. Commit and push
5. Redeploy

**Error: "Module not found"**

**Solution:**
1. Ensure all dependencies are in `package.json`
2. Run locally:
   ```powershell
   npm install
   npm run build
   ```
3. Commit `package-lock.json`
4. Push and redeploy

### Page Shows 404

**Problem:** Routing not working

**Solution:**
1. Check `vercel.json` exists in `apps/admin/`
2. Should contain:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
3. Commit and redeploy

### Assets Not Loading

**Problem:** CSS/JS not loading

**Solution:**
1. Check build output directory is `dist`
2. In Vercel settings, verify:
   - Output Directory: `dist`
3. Rebuild

### Environment Variables Not Working

**Problem:** `VITE_API_URL` not accessible

**Solution:**
1. Ensure variable name starts with `VITE_`
2. Variable must be added BEFORE deployment
3. If added after:
   - Go to Deployments
   - Redeploy latest

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Root directory set to `apps/admin`
- [ ] Framework set to Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Deployment successful
- [ ] Website accessible
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Auto-deploy enabled (optional)
- [ ] Custom domain added (optional)

---

## 🎯 Next Steps

After deploying the admin:

1. **Deploy the API**
   - See `VERCEL_DEPLOYMENT.md` for API deployment
   - Or use Railway, Render for API

2. **Update API URL**
   - Change `VITE_API_URL` to production API
   - Redeploy admin

3. **Test Full Integration**
   - Create user account
   - Test all features
   - Verify API calls work

4. **Setup Monitoring**
   - Enable Vercel Analytics
   - Add error tracking (Sentry)

5. **Go Live!**
   - Add custom domain
   - Share with users
   - Monitor performance

---

## 📞 Support

**If you get stuck:**

1. **Check Vercel Logs:**
   - Deployments → Click deployment → View logs

2. **Vercel Documentation:**
   - https://vercel.com/docs

3. **Vercel Support:**
   - https://vercel.com/support

4. **Community:**
   - Vercel Discord: https://discord.gg/vercel
   - GitHub Discussions: https://github.com/vercel/vercel/discussions

---

## 🎉 Success!

Your DigiCoop Admin Dashboard is now live on Vercel! 

**Share your URL:**
```
https://your-project.vercel.app
```

**Automatic deployments enabled!**
Every git push updates your production site automatically.

---

**Happy Deploying! 🚀**
