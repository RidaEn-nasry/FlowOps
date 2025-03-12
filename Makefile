.PHONY: dev prod up down restart clean build logs ps

# Default target
all: dev

# Development environment
dev:
	docker-compose -f docker-compose.dev.yml up
	
dev-build:
	docker-compose -f docker-compose.dev.yml up --build

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-restart:
	docker-compose -f docker-compose.dev.yml restart

# Production environment
prod:
	docker-compose up -d

prod-build:
	docker-compose up -d --build

prod-down:
	docker-compose down

prod-restart:
	docker-compose restart

# General commands
up:
	docker-compose -f docker-compose.dev.yml up

down:
	docker-compose -f docker-compose.dev.yml down

restart:
	docker-compose -f docker-compose.dev.yml restart

clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v

build:
	docker-compose -f docker-compose.dev.yml build
	docker-compose build

logs:
	docker-compose -f docker-compose.dev.yml logs -f

ps:
	docker-compose -f docker-compose.dev.yml ps

help:
	@echo "Available commands:"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-build    - Build and start development environment"
	@echo "  make dev-down     - Stop development environment"
	@echo "  make dev-restart  - Restart development environment"
	@echo "  make prod         - Start production environment (detached)"
	@echo "  make prod-build   - Build and start production environment (detached)"
	@echo "  make prod-down    - Stop production environment"
	@echo "  make prod-restart - Restart production environment"
	@echo "  make up           - Alias for 'make dev'"
	@echo "  make down         - Alias for 'make dev-down'"
	@echo "  make restart      - Alias for 'make dev-restart'"
	@echo "  make clean        - Remove containers and volumes"
	@echo "  make build        - Build all images"
	@echo "  make logs         - Show development logs"
	@echo "  make ps           - Show running containers" 