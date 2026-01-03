# Docker Deployment Guide

Complete guide for deploying DigiCoop using Docker and Docker Compose.

## 📋 Prerequisites

1. **Docker** installed ([Download here](https://docs.docker.com/get-docker/))
2. **Docker Compose** installed (included with Docker Desktop)
3. At least 2GB free RAM
4. At least 5GB free disk space

Verify installation:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start (Development)

### 1. Setup Environment Variables

```bash
# Copy the template
cp .env.docker .env

# Edit .env and set your values
# Minimum required:
# - DB_PASSWORD (set a secure password)
# - JWT_SECRET (generate a random string)
```

### 2. Start All Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access Your Applications

- **Admin Dashboard**: http://localhost
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

---

## 🔧 Production Deployment

### Option 1: Simple Production (No Reverse Proxy)

```bash
# 1. Configure environment
cp .env.docker .env
nano .env  # Edit values

# 2. Build for production
docker-compose build --no-cache

# 3. Start services
docker-compose up -d

# 4. Check health
docker-compose ps
curl http://localhost/health
curl http://localhost:3001/api/health
```

### Option 2: Production with Nginx Reverse Proxy

This setup adds SSL support and better security.

```bash
# 1. Start with nginx profile
docker-compose --profile production up -d

# 2. Access through nginx
# - Admin: http://localhost:8080
# - API: http://localhost:8080/api
```

### Option 3: Production with SSL

1. **Get SSL Certificates** (Let's Encrypt recommended)
   ```bash
   # Example with certbot
   certbot certonly --standalone -d your-domain.com
   ```

2. **Copy certificates**
   ```bash
   mkdir -p nginx/ssl
   cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/certificate.crt
   cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/private.key
   ```

3. **Update nginx.conf**
   - Uncomment the HTTPS server block
   - Update server_name to your domain

4. **Start with production profile**
   ```bash
   docker-compose --profile production up -d
   ```

---

## 🛠️ Common Commands

### Managing Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart a specific service
docker-compose restart api

# View logs
docker-compose logs -f api
docker-compose logs -f admin
docker-compose logs -f db

# Execute commands in a container
docker-compose exec api sh
docker-compose exec db psql -U digicoop
```

### Database Operations

```bash
# Access PostgreSQL
docker-compose exec db psql -U digicoop -d digicoop

# Run migrations
docker-compose exec api sh -c "cd database && npx prisma db push"

# View database logs
docker-compose logs -f db

# Backup database
docker-compose exec db pg_dump -U digicoop digicoop > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U digicoop digicoop
```

### Rebuilding Services

```bash
# Rebuild a specific service
docker-compose build api
docker-compose build admin

# Rebuild without cache
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build
```

---

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs api

# Check if port is already in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Mac/Linux

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Database Connection Issues

```bash
# Check if database is healthy
docker-compose ps

# Verify DATABASE_URL
docker-compose exec api printenv DATABASE_URL

# Test database connection
docker-compose exec db pg_isready -U digicoop

# Check database logs
docker-compose logs db
```

### API Returns 500 Errors

```bash
# Check API logs
docker-compose logs -f api

# Verify environment variables
docker-compose exec api printenv

# Check if Prisma client is generated
docker-compose exec api sh -c "cd database && npx prisma generate"
```

### Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check disk space
docker system df
```

### Admin Dashboard Not Loading

```bash
# Check nginx logs
docker-compose logs admin

# Verify API URL is accessible
curl http://localhost:3001/api/health

# Rebuild admin
docker-compose build admin
docker-compose up -d admin
```

---

## 📊 Monitoring

### Health Checks

```bash
# Check all services health
docker-compose ps

# API health
curl http://localhost:3001/api/health

# Admin health
curl http://localhost/health

# Database health
docker-compose exec db pg_isready
```

### Resource Usage

```bash
# View container stats
docker stats

# View specific container
docker stats digicoop-api
```

### Logs Management

```bash
# View recent logs
docker-compose logs --tail=100

# Follow logs
docker-compose logs -f

# Save logs to file
docker-compose logs > logs.txt
```

---

## 🔐 Security Best Practices

### Before Production:

1. **Change Default Passwords**
   ```bash
   # Generate secure passwords
   openssl rand -base64 32
   ```

2. **Set Strong JWT Secret**
   ```bash
   # Generate JWT secret
   openssl rand -hex 32
   ```

3. **Configure Firewall**
   ```bash
   # Only expose necessary ports
   # Close 5432 (database) to external access
   ```

4. **Enable HTTPS**
   - Get SSL certificate
   - Configure nginx with SSL
   - Redirect HTTP to HTTPS

5. **Regular Updates**
   ```bash
   # Pull latest images
   docker-compose pull
   
   # Rebuild and restart
   docker-compose up -d --build
   ```

---

## 🚢 Deployment to Cloud

### Option 1: AWS EC2

```bash
# 1. SSH into EC2 instance
ssh -i key.pem ubuntu@your-ec2-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clone repository
git clone your-repo-url
cd digicoop

# 4. Setup and start
cp .env.docker .env
nano .env  # Configure
docker-compose up -d
```

### Option 2: DigitalOcean Droplet

Same as AWS EC2, just use DigitalOcean's marketplace Docker image.

### Option 3: Azure Container Instances

```bash
# Create resource group
az group create --name digicoop --location eastus

# Deploy with docker-compose
az container create --resource-group digicoop --file docker-compose.yml
```

### Option 4: Google Cloud Run

```bash
# Build and push images
docker build -t gcr.io/project-id/digicoop-api -f packages/api/Dockerfile .
docker push gcr.io/project-id/digicoop-api

# Deploy
gcloud run deploy digicoop-api --image gcr.io/project-id/digicoop-api
```

---

## 📦 Backup and Restore

### Automated Backups

Create a backup script:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T db pg_dump -U digicoop digicoop > "$BACKUP_DIR/db_$DATE.sql"

# Backup volumes
docker run --rm -v digicoop_postgres_data:/data -v $PWD/$BACKUP_DIR:/backup alpine tar czf /backup/volumes_$DATE.tar.gz -C /data .

echo "Backup completed: $DATE"
```

Make it executable and run:
```bash
chmod +x backup.sh
./backup.sh
```

### Setup Cron for Daily Backups

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/digicoop && ./backup.sh
```

---

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild images
docker-compose build --no-cache

# 3. Stop old containers
docker-compose down

# 4. Start with new images
docker-compose up -d

# 5. Verify
docker-compose ps
docker-compose logs -f
```

### Updating Docker Images

```bash
# Update base images
docker-compose pull

# Rebuild
docker-compose up -d --build
```

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DB_USER` | Yes | Database username | `digicoop` |
| `DB_PASSWORD` | Yes | Database password | `secure_pass_123` |
| `JWT_SECRET` | Yes | JWT signing secret | `random32chars...` |
| `API_URL` | Yes | Backend API URL for frontend | `http://localhost:3001` |
| `FLUTTERWAVE_SECRET_KEY` | No | Payment gateway key | `FLWSECK_TEST-...` |
| `FLUTTERWAVE_PUBLIC_KEY` | No | Payment gateway public key | `FLWPUBK_TEST-...` |
| `SMILE_PARTNER_ID` | No | KYC partner ID | `0001` |
| `SMILE_API_KEY` | No | KYC API key | `api_key_...` |
| `TERMII_API_KEY` | No | SMS service API key | `TLxxx...` |
| `TERMII_SENDER_ID` | No | SMS sender name | `DigiCoop` |

---

## 🎯 Next Steps

After successful deployment:

1. ✅ Verify all services are running
2. ✅ Test API endpoints
3. ✅ Access admin dashboard
4. ✅ Create test user account
5. ✅ Configure monitoring
6. ✅ Setup automated backups
7. ✅ Configure SSL for production
8. ✅ Setup CI/CD pipeline

---

## 📞 Support

For issues:
1. Check container logs: `docker-compose logs service-name`
2. Verify environment variables: `docker-compose config`
3. Check service health: `docker-compose ps`
4. Review this guide's troubleshooting section

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

**You're now ready to deploy DigiCoop with Docker! 🎉**
