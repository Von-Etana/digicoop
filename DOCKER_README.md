# DigiCoop Docker Setup - README

## 🎯 Quick Start

### For Windows Users (PowerShell)

Since Makefiles don't work natively on Windows, use these PowerShell commands:

```powershell
# Initial setup
Copy-Item .env.docker .env
# Edit .env file with your settings

# Start production
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### For Mac/Linux Users

```bash
# One command to rule them all
make init

# Or step by step:
make setup    # Create .env file
make build    # Build images
make up       # Start services
make db-migrate  # Run migrations

# View logs
make logs

# Stop services
make down
```

---

## 📁 Files Created

Your Docker setup includes:

```
Digicoop/
├── docker-compose.yml              # Production orchestration
├── docker-compose.dev.yml          # Development with hot reload
├── .env.docker                     # Environment template
├── Makefile                        # Convenient commands (Mac/Linux)
├── DOCKER_GUIDE.md                 # Comprehensive guide
├── nginx/
│   └── nginx.conf                  # Reverse proxy config
├── packages/api/
│   ├── Dockerfile                  # Production API image
│   ├── Dockerfile.dev              # Development API image
│   └── .dockerignore              # Exclude files
└── apps/admin/
    ├── Dockerfile                  # Production admin image
    ├── Dockerfile.dev              # Development admin image
    ├── nginx.conf                  # Nginx config for admin
    └── .dockerignore              # Exclude files
```

---

## 🚀 Deployment Options

### Option 1: Development (with hot reload)

```bash
# Mac/Linux
make dev

# Windows
docker-compose -f docker-compose.dev.yml up -d
```

Access:
- Admin: http://localhost:5173 (with hot reload)
- API: http://localhost:3001 (with hot reload)

### Option 2: Production (optimized)

```bash
# Mac/Linux
make prod

# Windows
docker-compose up -d
```

Access:
- Admin: http://localhost
- API: http://localhost:3001

### Option 3: Production with Nginx Reverse Proxy

```bash
# Mac/Linux
make prod-ssl

# Windows
docker-compose --profile production up -d
```

Access through nginx on port 8080

---

## 🛠️ Common Tasks

### Windows PowerShell Commands

```powershell
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Access API shell
docker-compose exec api sh

# Access database
docker-compose exec db psql -U digicoop -d digicoop

# Backup database
docker-compose exec -T db pg_dump -U digicoop digicoop > backup.sql

# Rebuild
docker-compose up -d --build

# Stop and remove everything
docker-compose down -v
```

### Mac/Linux Makefile Commands

```bash
make help           # Show all commands
make dev            # Start development
make prod           # Start production
make logs           # View logs
make health         # Check service health
make db-backup      # Backup database
make db-migrate     # Run migrations
make clean          # Clean everything
```

---

## 📊 Services

| Service | Port | Description |
|---------|------|-------------|
| **admin** | 80 | Admin Dashboard (nginx) |
| **api** | 3001 | Backend API (Node.js) |
| **db** | 5432 | PostgreSQL Database |
| **nginx** | 8080/443 | Reverse Proxy (optional) |

---

## 🔧 Configuration

### 1. Create .env file

```bash
# Copy template
cp .env.docker .env
```

### 2. Edit .env (minimum required)

```env
DB_PASSWORD=your_secure_password
JWT_SECRET=your_random_32_character_string
```

### 3. Start services

```bash
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Windows - Find what's using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

```bash
# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Database Won't Start

```bash
# Check logs
docker-compose logs db

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Build Fails

```bash
# Clear cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## 📚 Documentation

- **DOCKER_GUIDE.md** - Complete deployment guide
- **DEPLOYMENT_READINESS.md** - Platform readiness assessment
- **QUICK_DEPLOY.md** - Quick deployment steps
- **README.md** - Project overview

---

## 🎉 Success!

Once running, verify everything works:

1. ✅ Check services: `docker-compose ps`
2. ✅ Admin dashboard: http://localhost
3. ✅ API health: http://localhost:3001/api/health
4. ✅ View logs: `docker-compose logs -f`

---

## 📞 Next Steps

1. Configure environment variables
2. Run database migrations
3. Test all features
4. Set up SSL for production
5. Configure automated backups
6. Deploy to cloud (see DOCKER_GUIDE.md)

**Happy Deploying! 🚀**
