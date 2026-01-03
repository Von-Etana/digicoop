# Backend API Environment Variables Template
# Copy this file to .env and fill in your actual values

# =====================================
# DATABASE
# =====================================
# For development (SQLite)
# DATABASE_URL="file:./dev.db"

# For production (PostgreSQL - REQUIRED)
DATABASE_URL="postgresql://username:password@localhost:5432/digicoop"

# =====================================
# SERVER CONFIGURATION
# =====================================
NODE_ENV="development"
PORT=3001

# =====================================
# AUTHENTICATION
# =====================================
# Generate a strong secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# =====================================
# FLUTTERWAVE PAYMENT INTEGRATION
# =====================================
# Get your keys from: https://dashboard.flutterwave.com/settings/apis
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X"
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X"
FLUTTERWAVE_ENCRYPTION_KEY="FLWSECK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# =====================================
# SMILE IDENTITY (KYC VERIFICATION)
# =====================================
# Get your credentials from: https://docs.usesmileid.com/
SMILE_PARTNER_ID="your-partner-id"
SMILE_API_KEY="your-api-key"
SMILE_CALLBACK_URL="https://your-api.com/api/kyc/callback"

# =====================================
# TERMII (SMS & OTP SERVICE)
# =====================================
# Get your API key from: https://accounts.termii.com/
TERMII_API_KEY="your-termii-api-key"
TERMII_SENDER_ID="DigiCoop"

# =====================================
# OPTIONAL: ADDITIONAL CONFIGURATIONS
# =====================================
# Logging level
LOG_LEVEL="info"

# CORS allowed origins (comma-separated)
CORS_ORIGINS="http://localhost:3000,https://your-admin-domain.com"

# Session/Cookie settings
COOKIE_SECRET="another-random-secret-for-cookies"

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
