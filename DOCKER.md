# Docker Deployment Guide

This guide explains how to run the Wellness Marketplace using Docker.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Quick Start with Docker

### 1. Start All Services

From the project root directory:

```bash
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- Backend API on port 8080
- Frontend on port 3000

### 2. Check Services Status

```bash
docker-compose ps
```

All services should be "Up" or "healthy"

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 4. Access the Application

Open your browser: `http://localhost:3000`

## Docker Commands

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Data
```bash
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Restart Specific Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

## Troubleshooting

### Backend can't connect to MySQL

Wait a bit longer - MySQL might still be initializing:
```bash
docker-compose logs mysql
```

### Port Already in Use

Stop the conflicting service or change ports in `docker-compose.yml`

### Out of Memory

Increase Docker memory in Docker Desktop settings (Preferences > Resources)

## Production Deployment

For production, update:

1. **docker-compose.yml**:
   - Use environment variables for secrets
   - Add volume persistence
   - Configure logging

2. **Backend application.properties**:
   - Change JWT secret
   - Update CORS origins
   - Configure production database

3. **Frontend**:
   - Update API URL in production build
   - Add proper error handling
   - Configure analytics

## Environment Variables

Create `.env` file in root:

```env
MYSQL_ROOT_PASSWORD=secure_password_here
MYSQL_DATABASE=wellness_marketplace
JWT_SECRET=your-very-secure-jwt-secret-key-here
```

Then update `docker-compose.yml` to use these variables.
