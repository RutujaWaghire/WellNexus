# Quick Start Guide

This guide will help you get the Wellness Marketplace up and running quickly.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17 or higher: `java -version`
- ✅ Maven 3.6+: `mvn -version`
- ✅ Node.js 16+: `node -version`
- ✅ MySQL 8.0+: `mysql --version`

## Step-by-Step Setup

### 1. Database Setup (5 minutes)

```bash
# Start MySQL service
# On Mac: brew services start mysql
# On Linux: sudo systemctl start mysql
# On Windows: Start MySQL service from Services

# Create database
mysql -u root -p
# Enter your MySQL password when prompted
```

In MySQL console:
```sql
CREATE DATABASE wellness_marketplace;
EXIT;
```

### 2. Configure Backend (2 minutes)

Edit `backend/src/main/resources/application.properties`:

```properties
# Update these lines with your MySQL credentials
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Start Backend (3 minutes)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Wait for the message: "Started WellnessMarketplaceApplication"

The backend will:
- Start on port 8080
- Automatically create database tables
- Load sample data (users, practitioners, products)

### 4. Start Frontend (3 minutes)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on: `http://localhost:3000`

## Test the Application

### Login with Sample Accounts

**Patient Account:**
- Email: `patient@example.com`
- Password: `password123`

**Practitioner Accounts:**
- Email: `sarah@example.com` (Physiotherapy)
- Password: `password123`

- Email: `michael@example.com` (Acupuncture)
- Password: `password123`

### What to Try

1. **Login** - Use one of the sample accounts
2. **Browse Practitioners** - View verified practitioners
3. **Book a Session** - Schedule an appointment
4. **Shop Products** - Browse wellness products
5. **AI Recommendations** - Enter symptoms to get therapy suggestions
6. **Community Forum** - Ask questions or answer them
7. **Dashboard** - View your sessions, orders, and recommendations

## API Testing with curl

Test the backend directly:

```bash
# Health check
curl http://localhost:8080/api/products

# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "patient",
    "bio": "Test bio"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Backend won't start

**Problem**: Port 8080 already in use
```bash
# Find and kill process on port 8080
# Mac/Linux:
lsof -ti:8080 | xargs kill -9
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Problem**: Database connection failed
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `application.properties`
- Ensure database `wellness_marketplace` exists

### Frontend won't start

**Problem**: Port 3000 already in use
```bash
# The frontend will automatically try port 3001
# Or kill the process:
# Mac/Linux:
lsof -ti:3000 | xargs kill -9
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Problem**: npm install fails
```bash
# Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues

If you see CORS errors in browser console:
1. Verify backend is running on port 8080
2. Check `CorsConfig.java` allows your frontend URL
3. Clear browser cache and reload

## Default Ports

- Backend API: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- MySQL: `localhost:3306`

## Next Steps

After successful setup:
1. Explore all features as different user roles
2. Create your own practitioner profile
3. Book sessions and place orders
4. Test the AI recommendation system
5. Participate in the community forum

## Development Tips

### Hot Reload

**Backend**: Spring Boot DevTools is included (restart on code changes)
**Frontend**: Vite provides instant hot module replacement

### Database Inspection

View data directly:
```bash
mysql -u root -p wellness_marketplace
SELECT * FROM users;
SELECT * FROM practitioners;
SELECT * FROM products;
```

### API Documentation

All endpoints are documented in the main README.md file.

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review API endpoints and their usage
- Check console logs for error messages
- Ensure all prerequisites are correctly installed

## Quick Reset

To start fresh:
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE wellness_marketplace;
CREATE DATABASE wellness_marketplace;
EXIT;

# Restart backend (it will recreate tables and data)
cd backend
mvn spring-boot:run
```
