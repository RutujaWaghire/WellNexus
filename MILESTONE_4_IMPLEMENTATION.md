# Milestone 4 Implementation Guide: AI Engine & Integrations

## Overview
This document provides detailed information about the Milestone 4 implementation, which includes AI recommendations, external API integrations (OpenFDA, WHO, Fitness APIs), comprehensive logging, notifications, and analytics dashboard.

---

## 1. AI Recommendations with External API Integration

### 1.1 Enhanced Recommendation Service
**File**: `backend/src/main/java/com/wellness/marketplace/service/RecommendationService.java`

**Key Features**:
- AI-based symptom to therapy mapping
- Integration with external APIs for enriched data
- Analytics logging for all recommendations
- Notification system integration
- Enhanced symptom-therapy mapping with 14+ common conditions

**Symptom Mappings**:
```
- Back pain → Chiropractic
- Stress → Acupuncture
- Anxiety → Ayurveda
- Muscle pain → Physiotherapy
- Headache → Acupuncture
- Joint pain → Physiotherapy
- Insomnia → Ayurveda
- Digestive issues → Ayurveda
- Hypertension → Yoga Therapy
- Diabetes → Nutritional Therapy
- Obesity → Fitness & Wellness
- Sleep disorder → Ayurveda
- Migraine → Naturopathy
- Arthritis → Physiotherapy
```

**API Endpoint**:
```
POST /api/recommendations
{
  "userId": 1,
  "symptom": "back pain"
}
```

---

## 2. External API Integrations

### 2.1 OpenFDA Integration
**Purpose**: Fetch medication information and drug data

**Features**:
- Medication search
- Drug label retrieval
- Adverse event tracking
- Success/failure logging

**Configuration**:
```properties
openfda.api.key=YOUR_API_KEY
openfda.api.endpoint=https://api.fda.gov
```

**Get API Key**: https://open.fda.gov/apis/authentication/

### 2.2 WHO (World Health Organization) API Integration
**Purpose**: Fetch health guidelines and disease information

**Features**:
- Health condition guidelines
- Disease outbreak information
- Preventive measures

**Configuration**:
```properties
who.api.key=YOUR_API_KEY
who.api.endpoint=https://api.who.int
```

### 2.3 Fitness API Integration
**Purpose**: Provide fitness and wellness recommendations

**Features**:
- Exercise information
- Fitness routines
- Wellness recommendations

**Configuration**:
```properties
fitness.api.key=YOUR_API_KEY
fitness.api.endpoint=https://api.api-ninjas.com
```

**Service**: `ExternalAPIService.java`

---

## 3. Logging System

### 3.1 Logging Configuration
**File**: `backend/src/main/resources/logback.xml`

**Log Files**:
- `logs/wellness-marketplace.log` - General application logs
- `logs/analytics.log` - Analytics-specific logs
- `logs/api-integration.log` - External API call logs

**Log Levels**:
- ROOT: INFO
- Application: DEBUG
- Security: DEBUG
- Spring Web: INFO

**Log Pattern**: `%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n`

### 3.2 Application Properties Configuration
**File**: `backend/src/main/resources/application.properties`

```properties
# Logging
logging.level.root=INFO
logging.level.com.wellness.marketplace=DEBUG
logging.file.name=logs/wellness-marketplace.log
logging.file.max-size=10MB
logging.file.max-history=10
```

---

## 4. Analytics & Monitoring

### 4.1 Analytics Models

**AnalyticsLog.java**:
- Tracks all user actions
- Categories: RECOMMENDATION, BOOKING, PURCHASE, NOTIFICATIONS, API
- Status: SUCCESS, FAILURE, PENDING
- Stores source API information
- Related entity tracking

**AnalyticsMetric.java**:
- Aggregated metrics storage
- Metric names: total_recommendations, total_bookings, total_sales, total_users
- Time frames: DAILY, WEEKLY, MONTHLY, YEARLY
- Dimension tracking (e.g., therapy type, specialty)

**APIIntegration.java**:
- API status tracking
- Request/success/error counts
- Last sync and error times
- Active/inactive status management

### 4.2 Analytics Service
**File**: `backend/src/main/java/com/wellness/marketplace/service/AnalyticsService.java`

**Key Methods**:
```java
// Log user action
logAction(userId, action, category, details, sourceAPI, ...)

// Get user analytics
getUserAnalytics(userId)

// Get date range analytics
getAnalyticsByDateRange(startDate, endDate)

// Record metrics
recordMetric(metricName, metricValue, timeFrame, category, dimension)

// Get aggregated metrics
getAggregatedMetrics(startDate, endDate)

// Get API performance metrics
getAPIPerformanceMetrics()
```

### 4.3 Analytics Dashboard Controller
**File**: `backend/src/main/java/com/wellness/marketplace/controller/AnalyticsController.java`

**Endpoints**:

1. **Get Dashboard**
   ```
   GET /api/analytics/dashboard?days=30
   ```
   Returns overall metrics (recommendations, bookings, sales, users, API success rate)

2. **Get User Analytics**
   ```
   GET /api/analytics/user/{userId}
   ```
   Returns user-specific analytics

3. **Get Date Range Analytics**
   ```
   GET /api/analytics/range
   ?startDate=2024-01-01T00:00:00
   &endDate=2024-01-31T23:59:59
   ```

4. **Get API Integrations Status**
   ```
   GET /api/analytics/api-integrations
   ```

5. **Initialize API Integration**
   ```
   POST /api/analytics/api-integrations/init
   ?apiName=OpenFDA
   &endpoint=https://api.fda.gov
   ```

6. **Record Metric**
   ```
   POST /api/analytics/metrics
   ?metricName=TOTAL_RECOMMENDATIONS
   &metricValue=100
   &timeFrame=DAILY
   &category=RECOMMENDATIONS
   ```

7. **Get Metrics by Category**
   ```
   GET /api/analytics/metrics/{category}
   ?startDate=2024-01-01T00:00:00
   &endDate=2024-01-31T23:59:59
   ```

---

## 5. Notifications System

### 5.1 Enhanced Notification Service
**File**: `backend/src/main/java/com/wellness/marketplace/service/NotificationService.java`

**Features**:
- Send notifications for recommendations
- Track notification read/unread status
- Delete notifications
- Log notification actions to analytics
- Notification statistics

**Methods**:
```java
// Create and send notification
createNotification(userId, type, message)
sendNotification(userId, title, message)

// Retrieve notifications
getUserNotifications(userId)
getUnreadNotifications(userId)

// Manage notifications
markAsRead(id)
deleteNotification(id)
getUnreadCount(userId)
```

### 5.2 Notification Triggers
Notifications are automatically sent for:
- New health recommendations
- Booking confirmations
- Session reminders
- Payment notifications
- System alerts

---

## 6. Frontend Analytics Dashboard

### 6.1 AnalyticsDashboard Component
**File**: `frontend/src/pages/AnalyticsDashboard.jsx`

**Features**:
- Real-time metrics display
- Charts and visualizations
  - Pie chart for category breakdown
  - Bar chart for API performance
  - Line charts for trends
- API integration status table
- Date range selector
- Responsive design

**Key Metrics Displayed**:
- Total Recommendations
- Total Bookings
- Total Sales
- API Success Rate
- API Requests (successful/failed)
- Category Breakdown

**Route**: `/admin/analytics`

**Access**: Admin users only

---

## 7. Database Models and Repositories

### 7.1 Models Created
1. **AnalyticsLog** - User action tracking
2. **AnalyticsMetric** - Aggregated metrics
3. **APIIntegration** - External API tracking

### 7.2 Repositories
1. **AnalyticsLogRepository** - CRUD + custom queries
2. **AnalyticsMetricRepository** - CRUD + aggregation queries
3. **APIIntegrationRepository** - API management

---

## 8. Setup Instructions

### 8.1 Backend Setup

1. **Update Dependencies**:
   ```bash
   cd backend
   mvn clean install
   ```

2. **Configure API Keys** in `application.properties`:
   ```properties
   openfda.api.key=YOUR_KEY
   who.api.key=YOUR_KEY
   fitness.api.key=YOUR_KEY
   ```

3. **Create Log Directories**:
   ```bash
   mkdir logs
   ```

4. **Database Initialization**:
   - New tables will be created automatically via JPA
   - Tables: analytics_logs, analytics_metrics, api_integrations

5. **Run Application**:
   ```bash
   mvn spring-boot:run
   ```

### 8.2 Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 9. API Configuration

### 9.1 Initialize APIs
Before using external APIs, initialize them:

```bash
# Initialize OpenFDA
curl -X POST http://localhost:8080/api/analytics/api-integrations/init \
  -d "apiName=OpenFDA&endpoint=https://api.fda.gov"

# Initialize WHO
curl -X POST http://localhost:8080/api/analytics/api-integrations/init \
  -d "apiName=WHO&endpoint=https://api.who.int"

# Initialize Fitness API
curl -X POST http://localhost:8080/api/analytics/api-integrations/init \
  -d "apiName=FITNESS_API&endpoint=https://api.api-ninjas.com"
```

---

## 10. Testing the Implementation

### 10.1 Test Recommendation Generation
```bash
curl -X POST http://localhost:8080/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "symptom": "back pain"
  }'
```

### 10.2 Test Analytics Dashboard
```bash
curl http://localhost:8080/api/analytics/dashboard?days=30
```

### 10.3 Test Notification
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "type": "RECOMMENDATION",
    "message": "New health recommendation available"
  }'
```

---

## 11. Performance Considerations

### 11.1 Database Optimization
- Indexes created on frequently queried fields
- Batch queries for analytics aggregation
- Archive old logs periodically

### 11.2 API Rate Limiting
- Implement rate limiting for external APIs
- Cache API responses when applicable
- Fallback mechanisms for API failures

### 11.3 Logging Best Practices
- Use appropriate log levels
- Implement log rotation (10MB files, 10 day retention)
- Monitor log file sizes

---

## 12. Future Enhancements

1. **Machine Learning Integration**: Advanced AI model for better recommendations
2. **Real-time Dashboards**: WebSocket-based live updates
3. **Email Notifications**: Send email alerts for critical events
4. **SMS Integration**: SMS notifications for appointments
5. **Data Export**: Export analytics to CSV/PDF
6. **Custom Reports**: User-defined analytics reports
7. **Predictive Analytics**: Forecast future trends

---

## 13. Troubleshooting

### Issue: API Integration Failed
**Solution**: 
- Verify API keys are correct
- Check network connectivity
- Review logs in `logs/api-integration.log`

### Issue: Analytics Data Not Showing
**Solution**:
- Check database connection
- Verify analytics service is logging actions
- Review `logs/analytics.log`

### Issue: Notifications Not Sending
**Solution**:
- Check NotificationService configuration
- Review database for notification records
- Check logs for error messages

---

## 14. Files Modified/Created

### Backend Files Created:
- AnalyticsLog.java (Model)
- AnalyticsMetric.java (Model)
- APIIntegration.java (Model)
- AnalyticsLogRepository.java
- AnalyticsMetricRepository.java
- APIIntegrationRepository.java
- AnalyticsService.java
- ExternalAPIService.java
- AnalyticsController.java
- RestTemplateConfig.java
- logback.xml (Configuration)
- AnalyticsLogDTO.java
- AnalyticsDashboardDTO.java
- APIIntegrationDTO.java

### Backend Files Modified:
- RecommendationService.java (Enhanced with API integration)
- RecommendationRepository.java (Added new method)
- NotificationService.java (Enhanced with analytics)
- application.properties (Added API configurations)
- pom.xml (Added dependencies)

### Frontend Files Created:
- AnalyticsDashboard.jsx (Component)

### Frontend Files Modified:
- App.jsx (Added analytics route)
- package.json (Added recharts dependency)

---

## 15. Configuration Summary

**Key Properties to Configure**:
```properties
# API Keys
openfda.api.key=YOUR_KEY
who.api.key=YOUR_KEY
fitness.api.key=YOUR_KEY

# Analytics
analytics.enabled=true
analytics.batch-size=100
analytics.retention-days=90

# Logging
logging.level.com.wellness.marketplace=DEBUG
logging.file.max-size=10MB
logging.file.max-history=10

# Notifications
notification.email.enabled=false
notification.sms.enabled=false
notification.push.enabled=true
```

---

## 16. Support and Documentation

For more information:
- Review individual service documentation in code comments
- Check controller endpoints documentation
- Refer to database schema documentation
- See frontend component JSDoc comments

---

**Implementation Date**: January 2026
**Status**: Complete
**Version**: 1.0.0
