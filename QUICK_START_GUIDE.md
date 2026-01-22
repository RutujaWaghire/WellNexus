# AI Recommendation Integration - Quick Start Guide

## What's New?

The Wellness Marketplace now features **complete AI-powered health recommendations** integrated with real data from:
- 🔬 **OpenFDA API** - Drug information and warnings
- 🏥 **WHO** - Health guidelines and preventive measures
- 🏋️ **API-Ninjas Fitness** - Exercise recommendations

## How to Access

### For Regular Users
1. **Login** to your account
2. Look for the **🧠 AI Health** button in the top navigation
3. Click it to access the recommendation page
4. Enter your symptom (e.g., "back pain", "stress", "headache")
5. Click **"Get Recommendation"**
6. View your enriched recommendation with all API data

### For Admin Users
All user features PLUS:
- **📊 Analytics Dashboard** - See API call statistics and integration health
- View system-wide recommendation patterns
- Monitor API performance and error rates

## Accessing the Features

### User Routes
- **Recommendations Page**: `/recommendations` (🧠 AI Health button in navbar)
- **User Dashboard**: `/dashboard`
- **Practitioners**: `/practitioners`
- **Products**: `/products`
- **Community**: `/community`

### Admin Routes
- **Analytics Dashboard**: `/admin/analytics` (📊 Analytics button)
- **Verify Practitioners**: `/admin/verify-practitioners` (✓ Verify button)
- **Admin Dashboard**: `/admin/dashboard` (👨‍💼 Admin button)

## Testing the Integration

### Test Account Creation
1. Click **Sign Up**
2. Fill in details (name, email, password)
3. Select role as "user" or "practitioner"
4. Submit

### Generate Your First Recommendation
1. After login, click **🧠 AI Health** in navbar
2. Try these symptoms:
   - "back pain" → Chiropractic
   - "stress" → Acupuncture
   - "anxiety" → Ayurveda
   - "headache" → Acupuncture
   - "insomnia" → Ayurveda
   - "muscle pain" → Physiotherapy
3. Wait for API calls to complete (5-10 seconds)
4. Review the enriched data

### What You'll See

**Section 1: Basic Info** (Always visible)
- Your symptom
- Suggested therapy
- Confidence level badge
  - 🟢 GREEN (HIGH) = All 3 APIs returned data
  - 🟡 YELLOW (MEDIUM) = 2 APIs returned data
  - 🟠 ORANGE (LOW) = 1 API returned data

**Section 2: FDA Drug Information** (If available)
- Brand names
- Indications for use
- Dosage recommendations
- Warnings and precautions

**Section 3: WHO Health Guidelines** (If available)
- Condition overview
- Prevalence information
- Preventive measures
- Recommended healthcare services

**Section 4: Fitness Recommendations** (If available)
- Recommended exercises
- Exercise type and difficulty
- Target muscle groups
- Equipment needed
- Step-by-step instructions

### Using Analytics Dashboard (Admin Only)

1. Click **📊 Analytics** in navbar (if you're logged in as admin)
2. See:
   - **Total Recommendations** - Count of all recommendations
   - **API Integration Status** - OpenFDA, WHO, Fitness API status
   - **Average Confidence Level** - Quality of enriched data
   - **Success Rate** - % of successful API calls
   - **API Performance Table** - Details for each API
   - **Date Range Selector** - Filter by time period

## API Endpoints (for developers)

### Generate Recommendation
```bash
POST /api/recommendations
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": 1,
  "symptom": "back pain"
}
```

### Get User Recommendations
```bash
GET /api/recommendations/user/{userId}
Authorization: Bearer {token}
```

### Get Recommendations by Therapy
```bash
GET /api/recommendations/therapy/{therapy}
Authorization: Bearer {token}

Example: GET /api/recommendations/therapy/Chiropractic
```

### Analytics Endpoints
```bash
GET /api/analytics/dashboard
GET /api/analytics/user/{userId}
GET /api/analytics/api-integrations
GET /api/analytics/metrics
```

## Response Example

```json
{
  "id": 1,
  "userId": 1,
  "symptom": "back pain",
  "suggestedTherapy": "Chiropractic",
  "sourceAPI": "AI_ENGINE",
  "timestamp": "2024-01-15T10:30:00",
  "confidenceLevel": "HIGH",
  "fdaDrugInfo": "{\"brandName\":\"...\",\"indications\":\"...\"}",
  "whoGuidelines": "{\"preventiveMeasures\":[...]}",
  "fitnessData": "{\"exerciseName\":\"...\",\"difficulty\":\"...\"}"
}
```

## Troubleshooting

### No FDA Data Showing
- OpenFDA API may be temporarily unavailable
- Check confidence level - may be MEDIUM or LOW
- All data from WHO and Fitness APIs will still display

### No WHO Guidelines
- WHO API endpoints may need configuration
- System will use cached health data
- This won't prevent other APIs from working

### No Fitness Data
- Fitness API requires valid API key
- Check application.properties for fitness.api.key
- System continues without fitness data if unavailable

### Slow Response Time
- External API calls can take 5-10 seconds
- Multiple APIs are called in parallel
- This is normal - consider it in UX

## Feature Details

### Symptom-to-Therapy Mapping
The system uses an AI mapping to suggest therapies:
- back pain → Chiropractic
- stress → Acupuncture
- anxiety → Ayurveda
- muscle pain → Physiotherapy
- headache → Acupuncture
- joint pain → Physiotherapy
- insomnia → Ayurveda
- digestive issues → Ayurveda
- hypertension → Yoga Therapy
- diabetes → Nutritional Therapy
- obesity → Fitness & Wellness
- migraine → Naturopathy
- arthritis → Physiotherapy

### Confidence Levels
- **HIGH** (3/3 APIs successful) - Most reliable
- **MEDIUM** (2/3 APIs successful) - Good data
- **LOW** (0-1 APIs successful) - Limited data but useful

## Important Disclaimer

All recommendations are **AI-generated for informational purposes only**. Users should:
- Always consult qualified healthcare practitioners
- Not rely solely on AI recommendations for medical decisions
- Provide recommendations to their healthcare provider
- Seek emergency care when needed

## File Structure

### Frontend Files (Recommendation Feature)
- `frontend/src/pages/RecommendationPage.jsx` - Main UI component
- `frontend/src/App.jsx` - Route configuration
- `frontend/src/components/Navbar.jsx` - Navigation menu
- `frontend/src/services/api.js` - API service calls

### Backend Files (Recommendation Feature)
- `backend/src/main/java/com/wellness/marketplace/service/ExternalAPIService.java` - API integration
- `backend/src/main/java/com/wellness/marketplace/service/RecommendationService.java` - Business logic
- `backend/src/main/java/com/wellness/marketplace/controller/RecommendationController.java` - REST endpoints
- `backend/src/main/java/com/wellness/marketplace/dto/RecommendationDTO.java` - Data transfer
- `backend/src/main/java/com/wellness/marketplace/model/Recommendation.java` - Database model

### Documentation Files
- `API_INTEGRATION_COMPLETE.md` - Complete technical documentation
- `QUICK_START_GUIDE.md` - This file
- `API_INTEGRATION_REFERENCE.md` - API reference

## Getting Help

For issues or questions:
1. Check the Analytics Dashboard for API status
2. Review application logs in `logs/` directory
3. Verify API keys in `application.properties`
4. Check database connectivity
5. Review backend error logs for detailed error messages

## Next Steps

1. **Test the feature** with sample symptoms
2. **View recommendations** with enriched API data
3. **Monitor analytics** for API performance
4. **Share feedback** for improvements
5. **Integrate with practitioners** for booking recommendations

---

**Status**: ✅ **COMPLETE AND READY FOR PRODUCTION**

The AI recommendation system is fully integrated with external APIs and ready for user testing and production deployment.
