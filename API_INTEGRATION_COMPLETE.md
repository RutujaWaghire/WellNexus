# AI Recommendation with FDA, WHO & Fitness API Integration

## Overview
This document describes the complete integration of external APIs (OpenFDA, WHO, and Fitness API) with the AI recommendation engine in the Wellness Marketplace application.

## Architecture

### Backend Services

#### 1. **ExternalAPIService** (`ExternalAPIService.java`)
Handles all external API calls with comprehensive error handling and logging.

**Methods:**
- `fetchMedicationInfo(searchTerm)` - Calls OpenFDA API for drug information
- `fetchWHOGuidelines(condition)` - Fetches WHO health guidelines
- `fetchFitnessData(activity)` - Gets fitness recommendations from API-Ninjas
- `initializeAPIIntegration(apiName, endpoint)` - Creates API integration records
- `logAPICall(apiName, action, status, errorMessage)` - Logs all API interactions

**Key Features:**
- Parses JSON responses and extracts relevant fields
- Updates APIIntegration statistics (request count, success/error rates)
- Logs all API interactions to AnalyticsService
- Returns JSON strings for storage in database
- Graceful error handling with fallback values

#### 2. **RecommendationService** (Enhanced)
Updated to enrich recommendations with external API data.

**Flow:**
```
generateRecommendation()
├── Create recommendation with basic data
├── enrichRecommendationWithExternalData()
│   ├── Fetch FDA medication info
│   ├── Fetch WHO health guidelines
│   ├── Fetch fitness recommendations
│   ├── Build enriched description
│   └── Set confidence level (HIGH/MEDIUM/LOW)
├── Save to database
├── Log to analytics
└── Send notification
```

**Confidence Levels:**
- **HIGH**: All 3 external APIs returned data
- **MEDIUM**: 2 APIs returned data
- **LOW**: 1 or 0 APIs returned data

#### 3. **Recommendation Model** (Enhanced)
Added 5 new fields to store API-enriched data:

```java
@Column(columnDefinition = "TEXT")
private String fdaDrugInfo;              // OpenFDA JSON response

@Column(columnDefinition = "TEXT")
private String whoGuidelines;            // WHO JSON response

@Column(columnDefinition = "TEXT")
private String fitnessData;              // Fitness API JSON response

@Column(columnDefinition = "TEXT")
private String enrichedDescription;      // Human-readable combined data

@Column
private String confidenceLevel;          // HIGH, MEDIUM, or LOW
```

#### 4. **RecommendationDTO** (New)
Data transfer object that exposes all enriched data through REST API:

```java
public class RecommendationDTO {
    private Long id;
    private Long userId;
    private String symptom;
    private String suggestedTherapy;
    private String sourceAPI;
    private LocalDateTime timestamp;
    
    // Enriched data
    private String fdaDrugInfo;
    private String whoGuidelines;
    private String fitnessData;
    private String enrichedDescription;
    private String confidenceLevel;
}
```

#### 5. **RecommendationController** (Enhanced)
REST endpoints for recommendation management:

**Endpoints:**
- `POST /api/recommendations` - Generate new recommendation with enrichment
- `GET /api/recommendations/user/{userId}` - Get user's recommendations with all enriched data
- `GET /api/recommendations/therapy/{therapy}` - Get recommendations by therapy type

### Frontend Components

#### 1. **RecommendationPage** (`RecommendationPage.jsx`)
Main user-facing component for AI recommendations with API data.

**Features:**
- Symptom input form
- Real-time recommendation generation
- Display of enriched data:
  - FDA drug information
  - WHO health guidelines
  - Fitness recommendations
- Confidence level badge
- Previous recommendations history
- Responsive design with Tailwind CSS

**Data Display Sections:**
```
┌─ Basic Recommendation Info
│  ├─ Symptom
│  ├─ Suggested Therapy
│  └─ Confidence Level
├─ FDA Drug Information (💊)
│  ├─ Brand Name
│  ├─ Indications
│  ├─ Dosage
│  └─ Warnings
├─ WHO Health Guidelines (🏥)
│  ├─ Condition
│  ├─ Prevalence
│  └─ Preventive Measures
└─ Fitness & Wellness (🏋️)
   ├─ Exercise Name
   ├─ Type
   ├─ Target Muscle
   ├─ Equipment
   ├─ Difficulty
   └─ Instructions
```

#### 2. **Navbar Integration** (Updated)
Added "AI Health" menu item (🧠) for authenticated users:
- Indigo button styling
- Links to `/recommendations` route
- Visible for all authenticated users
- Protected by ProtectedRoute

#### 3. **App Routes** (Updated)
Added route for recommendation page:
```jsx
<Route 
  path="/recommendations" 
  element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} 
/>
```

## API Data Sources

### OpenFDA API
**Endpoint:** `https://api.fda.gov/drug/label.json`

**Data Retrieved:**
- Brand Name
- Indications and Usage
- Dosage and Administration
- Warnings and Precautions

**Key Details:**
- Free service, optional API key
- Limited to 240 requests/minute
- Returns structured JSON data
- Falls back gracefully if no data found

### WHO API
**Data Source:** WHO Health Guidelines

**Data Provided:**
- Condition description
- Prevalence information
- Preventive measures list
- Recommended healthcare services

**Key Details:**
- Public health data
- No authentication required
- Comprehensive health guidelines
- Localized recommendations

### Fitness API (API-Ninjas)
**Endpoint:** `https://api.api-ninjas.com/v1/exercises`

**Data Retrieved:**
- Exercise Name
- Type (cardio, strength, etc.)
- Target Muscle Groups
- Required Equipment
- Difficulty Level
- Instructions

**Key Details:**
- Free tier: 50 requests/day
- Requires API key
- Comprehensive exercise database
- Structured JSON responses

## Database Schema

### Recommendations Table (Enhanced)
```sql
CREATE TABLE recommendations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    symptom VARCHAR(255) NOT NULL,
    suggested_therapy VARCHAR(255) NOT NULL,
    source_api VARCHAR(100),
    timestamp DATETIME NOT NULL,
    
    -- Enriched Data
    fda_drug_info LONGTEXT,
    who_guidelines LONGTEXT,
    fitness_data LONGTEXT,
    enriched_description LONGTEXT,
    confidence_level VARCHAR(20)
);
```

### Related Tables
- `analytics_logs` - Tracks all API calls and user interactions
- `api_integrations` - Stores API configuration and statistics
- `analytics_metrics` - Aggregates performance metrics

## Data Flow Diagram

```
┌─────────────────┐
│  User Input     │
│  (Symptom)      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  RecommendationController       │
│  POST /api/recommendations      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  RecommendationService          │
│  generateRecommendation()       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  enrichRecommendationWithData() │
└────────┬────────────────────────┘
         │
    ┌────┴─────┬──────────┐
    │           │          │
    ▼           ▼          ▼
┌────────┐ ┌──────┐ ┌──────────┐
│ OpenFDA│ │ WHO  │ │ Fitness  │
│ API    │ │ API  │ │ API      │
└────┬───┘ └───┬──┘ └────┬─────┘
     │         │         │
     └─────┬───┴────┬────┘
           │        │
           ▼        ▼
    ┌────────────────────────┐
    │  Store Responses in:   │
    │  - fdaDrugInfo        │
    │  - whoGuidelines      │
    │  - fitnessData        │
    │  - enrichedDescription│
    │  - confidenceLevel    │
    └──────┬─────────────────┘
           │
           ▼
    ┌─────────────────┐
    │  Save to DB     │
    └────────┬────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  ┌────────┐   ┌──────────┐
  │ DTO    │   │Analytics │
  │Return  │   │ Logging  │
  │ to UI  │   │          │
  └────────┘   └──────────┘
```

## User Interface Flow

### Step 1: Access Recommendation Page
- User clicks "AI Health" in navbar
- Navigated to `/recommendations`
- Page loads previous recommendations history

### Step 2: Enter Symptom
- User types symptom (e.g., "back pain")
- Button shows "Get Recommendation"
- Request sent to backend with userId + symptom

### Step 3: API Enrichment Process
- Backend calls 3 external APIs in parallel
- Each API response parsed and stored
- Enriched description compiled
- Confidence level calculated
- Data saved to database

### Step 4: Display Results
- Frontend receives RecommendationDTO
- Displays in organized sections:
  - Basic info with confidence badge
  - FDA drug information (if available)
  - WHO health guidelines (if available)
  - Fitness recommendations (if available)
- Shows disclaimer about consulting healthcare practitioners

### Step 5: View History
- Previous recommendations displayed below
- Click to view details
- Shows confidence level for each

## Error Handling

### API Call Failures
- Each API call wrapped in try-catch
- Logs failure to AnalyticsService
- Updates APIIntegration error statistics
- Returns empty JSON object
- Recommendation still created with available data
- Confidence level adjusted based on successful APIs

### Fallback Behavior
If an API fails:
- Service continues with other APIs
- Recommendation saved with partial data
- User still sees available information
- Confidence level indicates data completeness

### Example Fallback
```
FDA API: FAILURE (network error)
WHO API: SUCCESS
Fitness API: SUCCESS

Result:
- Show WHO + Fitness data
- Set confidence to MEDIUM
- Display only available sections
- Don't show FDA section
```

## Testing the Integration

### Manual Testing with cURL

**1. Generate Recommendation:**
```bash
curl -X POST http://localhost:8080/api/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": 1,
    "symptom": "back pain"
  }'
```

**2. Fetch User Recommendations:**
```bash
curl http://localhost:8080/api/recommendations/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Get Recommendations by Therapy:**
```bash
curl http://localhost:8080/api/recommendations/therapy/Chiropractic \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Sample Response
```json
{
  "id": 1,
  "userId": 1,
  "symptom": "back pain",
  "suggestedTherapy": "Chiropractic",
  "sourceAPI": "AI_ENGINE",
  "timestamp": "2024-01-15T10:30:00",
  "fdaDrugInfo": "{\"brandName\": \"...\", ...}",
  "whoGuidelines": "{\"preventiveMeasures\": [...], ...}",
  "fitnessData": "{\"exerciseName\": \"...\", ...}",
  "enrichedDescription": "Symptom: back pain...",
  "confidenceLevel": "HIGH"
}
```

## Configuration

### Application Properties
```properties
# API Keys (optional for OpenFDA and WHO, required for Fitness)
openfda.api.key=YOUR_KEY
who.api.key=YOUR_KEY
fitness.api.key=YOUR_KEY

# API Endpoints
openfda.api.endpoint=https://api.fda.gov/drug/label.json
who.api.endpoint=https://api.who.int
fitness.api.endpoint=https://api.api-ninjas.com/v1/exercises

# Logging
logging.level.com.wellness.marketplace.service.ExternalAPIService=INFO
logging.level.com.wellness.marketplace.service.RecommendationService=INFO
```

## Key Features

✅ **Complete API Integration**
- 3 external APIs integrated
- Robust error handling
- Graceful fallbacks

✅ **Data Persistence**
- All API responses stored
- Enriched recommendations saved
- Full audit trail

✅ **User-Friendly Interface**
- Intuitive symptom input
- Well-organized data display
- Confidence indicator
- Recommendation history

✅ **Analytics Integration**
- All API calls logged
- Performance metrics tracked
- Success/failure rates monitored
- User interactions recorded

✅ **Security**
- Protected routes (authentication required)
- API key management
- Data validation

## Future Enhancements

- Real-time API performance monitoring dashboard
- Custom recommendation filtering options
- PDF export of recommendations
- Appointment booking integration with FDA-approved practitioners
- AI model improvement based on user feedback
- Multi-language support for WHO guidelines
- Personalized recommendation history analytics

## Summary

The AI recommendation system now fully integrates with OpenFDA, WHO, and Fitness APIs to provide comprehensive, enriched health recommendations. Users can input symptoms and receive personalized therapy suggestions backed by real external data from trusted health sources. The system gracefully handles API failures and provides transparency about data sources through confidence levels.
