# Milestone 4 Quick Reference Guide

## 🚀 Quick Start

### Backend Setup (5 minutes)
```bash
# 1. Update API keys in application.properties
nano backend/src/main/resources/application.properties

# 2. Build project
cd backend
mvn clean install

# 3. Create logs directory
mkdir logs

# 4. Run application
mvn spring-boot:run
# or
java -jar target/marketplace-1.0.0.jar
```

### Frontend Setup (3 minutes)
```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Run dev server
npm run dev

# 3. Access dashboard at http://localhost:5173/admin/analytics
```

---

## 📊 Key Endpoints

### Recommendations
```
POST /api/recommendations
Body: {"userId": 1, "symptom": "back pain"}
```

### Analytics Dashboard
```
GET /api/analytics/dashboard?days=30
GET /api/analytics/dashboard?days=90
```

### API Integrations
```
GET /api/analytics/api-integrations
POST /api/analytics/api-integrations/init
  ?apiName=OpenFDA&endpoint=https://api.fda.gov
```

### Metrics
```
POST /api/analytics/metrics
  ?metricName=TOTAL_RECOMMENDATIONS
  &metricValue=100
  &timeFrame=DAILY
  &category=RECOMMENDATIONS

GET /api/analytics/metrics/RECOMMENDATIONS
```

### Notifications
```
POST /api/notifications
Body: {"userId": 1, "type": "RECOMMENDATION", "message": "..."}

GET /api/notifications/user/1
GET /api/notifications/user/1/unread
```

---

## 🔐 Required Configuration

### application.properties
```properties
# API Keys (REQUIRED)
openfda.api.key=YOUR_KEY
who.api.key=YOUR_KEY
fitness.api.key=YOUR_KEY

# Optional but recommended
analytics.retention-days=90
logging.level.com.wellness.marketplace=DEBUG
```

---

## 📁 New Files at a Glance

### Backend
```
service/
  ├── AnalyticsService.java ⭐ NEW
  ├── ExternalAPIService.java ⭐ NEW
  └── RecommendationService.java (UPDATED)

controller/
  └── AnalyticsController.java ⭐ NEW

model/
  ├── AnalyticsLog.java ⭐ NEW
  ├── AnalyticsMetric.java ⭐ NEW
  └── APIIntegration.java ⭐ NEW

repository/
  ├── AnalyticsLogRepository.java ⭐ NEW
  ├── AnalyticsMetricRepository.java ⭐ NEW
  └── APIIntegrationRepository.java ⭐ NEW

dto/
  ├── AnalyticsLogDTO.java ⭐ NEW
  ├── AnalyticsDashboardDTO.java ⭐ NEW
  └── APIIntegrationDTO.java ⭐ NEW

config/
  └── RestTemplateConfig.java ⭐ NEW

resources/
  └── logback.xml ⭐ NEW
```

### Frontend
```
pages/
  └── AnalyticsDashboard.jsx ⭐ NEW

App.jsx (UPDATED - added route)
package.json (UPDATED - added recharts)
```

---

## 📊 Database Tables

### New Tables (Auto-created)
1. **analytics_logs** - User action tracking
2. **analytics_metrics** - Aggregated metrics
3. **api_integrations** - External API tracking

---

## 🎯 Key Features Summary

| Feature | Status | Component |
|---------|--------|-----------|
| AI Recommendations | ✅ | RecommendationService |
| OpenFDA Integration | ✅ | ExternalAPIService |
| WHO Integration | ✅ | ExternalAPIService |
| Fitness API Integration | ✅ | ExternalAPIService |
| Analytics Logging | ✅ | AnalyticsService |
| Analytics Dashboard | ✅ | AnalyticsController |
| Frontend Dashboard | ✅ | AnalyticsDashboard.jsx |
| Notifications | ✅ | NotificationService |
| Logging System | ✅ | logback.xml |

---

## 🔍 Log Files Location

```
logs/
├── wellness-marketplace.log (General)
├── analytics.log (Analytics-specific)
└── api-integration.log (External API calls)
```

Check logs:
```bash
tail -f logs/wellness-marketplace.log
tail -f logs/analytics.log
tail -f logs/api-integration.log
```

---

## 🧪 Quick Test Commands

### Test AI Recommendation
```bash
curl -X POST http://localhost:8080/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"symptom":"back pain"}'
```

### Test Dashboard Endpoint
```bash
curl http://localhost:8080/api/analytics/dashboard?days=30 | jq
```

### Test API Integration
```bash
curl -X POST http://localhost:8080/api/analytics/api-integrations/init \
  -d "apiName=OpenFDA&endpoint=https://api.fda.gov"
```

---

## ⚙️ Common Issues & Solutions

### Issue: API Integration Failed
```
Solution:
1. Check API keys in application.properties
2. Verify internet connectivity
3. Check logs/api-integration.log for error details
4. Ensure API endpoints are correct
```

### Issue: Analytics Data Not Showing
```
Solution:
1. Verify database connection
2. Check if recommendations are being generated
3. Review logs/analytics.log
4. Check database tables exist (should auto-create)
```

### Issue: Dashboard Returns Empty
```
Solution:
1. Ensure you have data in database
2. Try with larger date range (days=90)
3. Check API integrations are initialized
4. Review AnalyticsController logs
```

---

## 📋 Symptom-Therapy Mappings

```
back pain → Chiropractic
stress → Acupuncture
anxiety → Ayurveda
muscle pain → Physiotherapy
headache → Acupuncture
joint pain → Physiotherapy
insomnia → Ayurveda
digestive issues → Ayurveda
hypertension → Yoga Therapy
diabetes → Nutritional Therapy
obesity → Fitness & Wellness
sleep disorder → Ayurveda
migraine → Naturopathy
arthritis → Physiotherapy
```

---

## 🎨 Frontend Component Usage

### Import Analytics Dashboard
```jsx
import AnalyticsDashboard from './pages/AnalyticsDashboard';
```

### Route Setup (Already Done)
```jsx
<Route path="/admin/analytics" 
  element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
```

### Access URL
```
http://localhost:5173/admin/analytics
```

---

## 🔄 Data Flow Diagram

```
User Action
    ↓
RecommendationService
    ├→ Generate AI Recommendation
    ├→ Enrich with External APIs
    │   ├→ OpenFDA API
    │   ├→ WHO API
    │   └→ Fitness API
    ├→ Log to AnalyticsService
    └→ Send Notification

AnalyticsService
    ├→ Log AnalyticsLog
    ├→ Record AnalyticsMetric
    └→ Store in Database

Database
    ├→ analytics_logs
    ├→ analytics_metrics
    └→ api_integrations

Frontend Dashboard
    ├→ Fetch from AnalyticsController
    ├→ Display Charts & Metrics
    └→ Show API Status Table
```

---

## 📈 Metrics Available

### Real-time Metrics
- Total Recommendations
- Total Bookings
- Total Sales
- Total Users
- API Success Rate

### Tracked Categories
- RECOMMENDATION
- BOOKING
- PURCHASE
- NOTIFICATION
- API

### Time Frames
- DAILY
- WEEKLY
- MONTHLY
- YEARLY

---

## 🔗 Dependencies Added

### Maven Dependencies
- spring-boot-starter-webflux
- jackson-databind
- httpclient5
- spring-boot-starter-logging

### npm Dependencies
- recharts@^2.10.3

---

## 📞 Support Resources

1. **Implementation Guide**: `MILESTONE_4_IMPLEMENTATION.md`
2. **Summary Document**: `MILESTONE_4_SUMMARY.md`
3. **Code Comments**: Check service/controller JavaDoc
4. **Log Files**: Check `logs/` directory

---

## ✅ Pre-Production Checklist

- [ ] Update all API keys
- [ ] Create logs directory
- [ ] Run database migrations
- [ ] Test AI recommendation endpoint
- [ ] Verify all API integrations
- [ ] Test analytics dashboard
- [ ] Check log files are being created
- [ ] Test notifications
- [ ] Verify frontend builds
- [ ] Load test the dashboard

---

## 🚀 Deployment Command

```bash
# Backend
cd backend && mvn clean package -DskipTests
java -jar target/marketplace-1.0.0.jar --server.port=8080

# Frontend
cd frontend && npm run build
# Serve dist/ with any web server (nginx, apache, etc.)
```

---

**Last Updated**: January 22, 2026  
**Version**: 1.0.0  
**Status**: Ready for Production
