# DigiCoop Docker Makefile
# Convenient commands for Docker operations

.PHONY: help build up down logs clean restart dev prod backup restore

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "DigiCoop Docker Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development Commands
dev: ## Start development environment with hot reload
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "  - Admin: http://localhost:5173"
	@echo "  - API: http://localhost:3001"
	@echo "  - Database: localhost:5432"

dev-logs: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

dev-rebuild: ## Rebuild and restart development environment
	docker-compose -f docker-compose.dev.yml up -d --build

# Production Commands
build: ## Build production images
	docker-compose build --no-cache

up: prod ## Start production environment

prod: ## Start production environment
	@if [ ! -f .env ]; then \
		echo "Error: .env file not found!"; \
		echo "Please copy .env.docker to .env and configure it"; \
		exit 1; \
	fi
	docker-compose up -d
	@echo "Production environment started!"
	@echo "  - Admin: http://localhost"
	@echo "  - API: http://localhost:3001"

down: ## Stop all services
	docker-compose down

stop: ## Stop all services without removing containers
	docker-compose stop

restart: ## Restart all services
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs-api: ## View API logs
	docker-compose logs -f api

logs-admin: ## View Admin logs
	docker-compose logs -f admin

logs-db: ## View Database logs
	docker-compose logs -f db

# Container Management
ps: ## Show running containers
	docker-compose ps

stats: ## Show container resource usage
	docker stats

shell-api: ## Open shell in API container
	docker-compose exec api sh

shell-admin: ## Open shell in Admin container
	docker-compose exec admin sh

shell-db: ## Open PostgreSQL shell
	docker-compose exec db psql -U digicoop -d digicoop

# Database Commands
db-migrate: ## Run database migrations
	docker-compose exec api sh -c "cd database && npx prisma db push"

db-seed: ## Seed the database
	docker-compose exec api sh -c "cd database && npx prisma db seed"

db-studio: ## Open Prisma Studio
	docker-compose exec api sh -c "cd database && npx prisma studio"

db-backup: ## Backup database to backups/
	@mkdir -p backups
	@echo "Creating backup..."
	docker-compose exec -T db pg_dump -U digicoop digicoop > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/"

db-restore: ## Restore database from latest backup
	@if [ -z "$$(ls -t backups/*.sql 2>/dev/null | head -1)" ]; then \
		echo "Error: No backup files found in backups/"; \
		exit 1; \
	fi
	@echo "Restoring from latest backup..."
	cat $$(ls -t backups/*.sql | head -1) | docker-compose exec -T db psql -U digicoop digicoop
	@echo "Database restored!"

# Cleanup Commands
clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all
	docker system prune -f

clean-volumes: ## Remove all volumes (WARNING: deletes all data)
	docker-compose down -v

clean-images: ## Remove DigiCoop Docker images
	docker-compose down --rmi all

# Health Checks
health: ## Check health of all services
	@echo "Checking service health..."
	@docker-compose ps
	@echo ""
	@echo "API Health:"
	@curl -s http://localhost:3001/api/health || echo "API not responding"
	@echo ""
	@echo "Admin Health:"
	@curl -s http://localhost/health || echo "Admin not responding"
	@echo ""
	@echo "Database Health:"
	@docker-compose exec db pg_isready -U digicoop || echo "Database not responding"

# Testing
test-api: ## Run API tests in container
	docker-compose exec api npm test

test: test-api ## Run all tests

# Advanced
rebuild: ## Rebuild and restart all services
	docker-compose up -d --build

rebuild-api: ## Rebuild and restart API only
	docker-compose up -d --build api

rebuild-admin: ## Rebuild and restart Admin only
	docker-compose up -d --build admin

# Setup
setup: ## Initial setup - copy env file
	@if [ ! -f .env ]; then \
		cp .env.docker .env; \
		echo ".env file created! Please edit it with your configuration."; \
	else \
		echo ".env file already exists."; \
	fi

init: setup build up db-migrate ## Complete initialization (setup, build, start, migrate)
	@echo ""
	@echo "🎉 DigiCoop is ready!"
	@echo ""
	@echo "Access your applications:"
	@echo "  - Admin Dashboard: http://localhost"
	@echo "  - Backend API: http://localhost:3001"
	@echo ""
	@echo "Useful commands:"
	@echo "  - View logs: make logs"
	@echo "  - Stop services: make down"
	@echo "  - Restart: make restart"
	@echo ""
	@echo "Run 'make help' to see all available commands."

# Production with SSL
prod-ssl: ## Start production with nginx reverse proxy and SSL
	docker-compose --profile production up -d
