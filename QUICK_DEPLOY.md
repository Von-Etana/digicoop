# Quick Deployment Guide

This guide helps you deploy DigiCoop for demo/production in the fastest way possible.

## 🚀 Quick Demo (Local)

If you just want to run everything locally for a demo:

```bash
# 1. Start the Backend API
npm run api

# 2. In another terminal, start the Admin Dashboard
npm run admin

# 3. In another terminal, start the Mobile App
npm run mobile
```

Access:
- **Admin Dashboard**: http://localhost:5173
- **API**: http://localhost:3001
- **Mobile**: Scan QR code with Expo Go app

---

## 🌐 Production Deployment

### Prerequisites Checklist
- [ ] PostgreSQL database instance
- [ ] Flutterwave account & API keys
- [ ] Smile Identity account (for KYC)
- [ ] Termii account (for SMS/OTP)

---

### 1. Deploy Admin Dashboard (Vercel)

**Fastest Option: One-Click Deploy**

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-api-url.com`
6. Click "Deploy"

**Alternative: Manual Deploy**
```bash
cd apps/admin
npm run build
# Upload the 'dist' folder to any static hosting
```

Hosting options:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Nginx on VPS

---

### 2. Deploy Backend API (Railway)

**Option A: Railway (Recommended)**

1. Visit [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add PostgreSQL service:
   - Click "+ New" → "Database" → "PostgreSQL"
5. Configure your API service:
   - **Root Directory**: `packages/api`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Add all environment variables (see ENV_TEMPLATE.md)
7. Deploy!

**Option B: Render**

1. Visit [render.com](https://render.com)
2. New → Web Service
3. Connect repository
4. Configure:
   - **Root Directory**: `packages/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables
6. Create PostgreSQL database in Render
7. Deploy!

**Option C: Docker (Any VPS)**

```bash
# Create Dockerfile in packages/api
docker build -t digicoop-api .
docker run -p 3001:3001 --env-file .env digicoop-api
```

---

### 3. Setup Database

**One-time setup after deploying API:**

```bash
# SSH into your server or use Railway/Render console

cd packages/database 

# Migrate database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Optional: Seed with test data
npx prisma db seed
```

---

### 4. Deploy Mobile App (Expo)

**For Testing (Instant):**
```bash
cd apps/mobile
npm start
# Scan QR code with Expo Go app
```

**For Production (App Stores):**

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login:
   ```bash
   eas login
   ```

3. Configure:
   ```bash
   eas build:configure
   ```

4. Update production API URL in `services/api.ts`

5. Build for both platforms:
   ```bash
   eas build --platform all
   ```

6. Submit to stores:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

---

## ⚙️ Environment Variables Setup

### Backend API

Copy `packages/api/ENV_TEMPLATE.md` and create `.env`:

**Required:**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="random-32-char-string"
NODE_ENV="production"
PORT=3001
```

**For Payments:**
```env
FLUTTERWAVE_SECRET_KEY="..."
FLUTTERWAVE_PUBLIC_KEY="..."
```

**For KYC:**
```env
SMILE_PARTNER_ID="..."
SMILE_API_KEY="..."
```

**For SMS/OTP:**
```env
TERMII_API_KEY="..."
TERMII_SENDER_ID="DigiCoop"
```

### Admin Dashboard

```env
VITE_API_URL=https://your-api.railway.app
```

### Mobile App

Edit `apps/mobile/services/api.ts`:
```typescript
const API_URL = 'https://your-api.railway.app';
```

---

## 🧪 Testing Your Deployment

### 1. Test Admin Dashboard
- Visit your Vercel URL
- Check all pages load
- Verify API connection

### 2. Test Backend API
```bash
# Health check
curl https://your-api-url.com/api/health

# Test registration
curl -X POST https://your-api-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123",...}'
```

### 3. Test Mobile App
- Open in Expo Go
- Test user registration
- Test all main features

---

## 📊 Monitoring & Logs

### Railway
- Built-in logs and metrics
- Visit your project → Service → Logs

### Vercel
- Visit project → Deployments → Click deployment → View logs

### Expo
- Use EAS dashboard for build status
- Sentry integration (optional)

---

## 🔐 Security Checklist

Before going live:
- [ ] Change all default secrets
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection (Helmet.js handles this)

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Database Connection Issues
- Check DATABASE_URL format
- Verify firewall allows connections
- Test connection with `psql` or database client

### API Not Responding
- Check environment variables
- Verify PORT is correct
- Check server logs

### Mobile App Can't Connect
- Verify API_URL is correct
- Check API is publicly accessible
- Test API with curl/Postman first

---

## 📞 Support

For issues:
1. Check server logs
2. Review DEPLOYMENT_READINESS.md
3. Check README.md in each package
4. Review error messages carefully

---

## 🎉 You're Live!

Once deployed:
1. ✅ Admin dashboard accessible via browser
2. ✅ Mobile app working on iOS/Android
3. ✅ Backend API responding to requests
4. ✅ Database properly configured
5. ✅ All integrations working

**Next Steps:**
- Monitor error rates
- Set up automated backups
- Configure CI/CD
- Add application monitoring
- Plan for scaling
