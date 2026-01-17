# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND (Vite)                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages (8):                                                      │
│  ├── Home                  ├── Dashboard                        │
│  ├── Login                 ├── Practitioners                    │
│  ├── Register              ├── Products                         │
│  ├── Community             └── BookSession                      │
│                                                                  │
│  Components:                                                     │
│  └── Navbar (Navigation)                                        │
│                                                                  │
│  Services:                                                       │
│  └── API Service (Axios)                                        │
│                                                                  │
│  Context:                                                        │
│  └── AuthContext (JWT Management)                               │
│                                                                  │
│  Styling: Tailwind CSS                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │ JWT Token Auth
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SPRING BOOT BACKEND (Java 17)                   │
│                     http://localhost:8080                        │
├─────────────────────────────────────────────────────────────────┤
│  Controllers (9):                                                │
│  ├── AuthController              ├── OrderController            │
│  ├── PractitionerController      ├── ReviewController           │
│  ├── TherapySessionController    ├── CommunityController        │
│  ├── ProductController           ├── RecommendationController   │
│  └── NotificationController                                     │
│                                                                  │
│  Services (9):                                                   │
│  ├── AuthService                 ├── OrderService               │
│  ├── PractitionerService         ├── ReviewService              │
│  ├── TherapySessionService       ├── CommunityService           │
│  ├── ProductService              ├── RecommendationService      │
│  └── NotificationService                                        │
│                                                                  │
│  Security (3):                                                   │
│  ├── JwtUtil                     ├── CustomUserDetailsService   │
│  └── JwtAuthenticationFilter                                    │
│                                                                  │
│  Config (4):                                                     │
│  ├── SecurityConfig              ├── WebSocketConfig            │
│  ├── CorsConfig                  └── DataInitializer            │
│                                                                  │
│  Repositories (10) - JPA/Hibernate                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ JDBC
                             │ JPA/Hibernate
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MySQL DATABASE                              │
│                     jdbc:mysql://localhost:3306                  │
├─────────────────────────────────────────────────────────────────┤
│  Database: wellness_marketplace                                  │
│                                                                  │
│  Tables (10):                                                    │
│  ├── users                       ├── orders                     │
│  ├── practitioner_profiles       ├── reviews                    │
│  ├── therapy_sessions            ├── questions                  │
│  ├── products                    ├── answers                    │
│  ├── recommendations             └── notifications              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### Frontend Layer (React + Tailwind CSS)

**Technology Stack:**
- React 18.2.0
- React Router v6
- Tailwind CSS 3.3.6
- Axios for HTTP
- Vite for bundling

**Structure:**
```
frontend/
├── src/
│   ├── pages/           # 8 page components
│   ├── components/      # Reusable UI components
│   ├── context/         # Global state management
│   ├── services/        # API integration layer
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

---

### Backend Layer (Spring Boot)

**Technology Stack:**
- Spring Boot 3.1.5
- Spring Security
- Spring Data JPA
- Spring WebSocket
- JWT (jjwt 0.11.5)
- MySQL Connector
- Lombok

**Architecture Pattern:** Layered Architecture

```
Controller Layer
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database Layer
```

**Structure:**
```
backend/src/main/java/com/wellness/marketplace/
├── controller/      # REST API endpoints (9 controllers)
├── service/         # Business logic (9 services)
├── repository/      # Data access (10 repositories)
├── model/           # JPA entities (10 models)
├── security/        # JWT authentication (3 classes)
├── config/          # Configuration (4 classes)
└── dto/             # Data transfer objects (3 DTOs)
```

---

### Database Layer (MySQL)

**Entity Relationships:**

```
User (1) ──────> (1) PractitionerProfile
  │
  ├──> (n) TherapySession
  ├──> (n) Order
  ├──> (n) Review
  ├──> (n) Question
  ├──> (n) Recommendation
  └──> (n) Notification

PractitionerProfile (1) ──> (n) TherapySession
                        ──> (n) Review
                        ──> (n) Answer

Product (1) ──> (n) Order

Question (1) ──> (n) Answer
```

---

## API Flow Diagram

### Authentication Flow

```
Client                    Backend                  Database
  │                          │                         │
  │   POST /auth/register    │                         │
  ├─────────────────────────>│                         │
  │                          │  Save user              │
  │                          ├────────────────────────>│
  │                          │<────────────────────────┤
  │                          │  Generate JWT           │
  │   Return JWT token       │                         │
  │<─────────────────────────┤                         │
  │                          │                         │
  │   Subsequent requests    │                         │
  │   with Bearer token      │                         │
  ├─────────────────────────>│                         │
  │                          │  Validate JWT           │
  │                          │  Process request        │
  │                          ├────────────────────────>│
  │                          │<────────────────────────┤
  │   Return data            │                         │
  │<─────────────────────────┤                         │
```

### Booking Flow

```
Patient                   Backend                  Database
  │                          │                         │
  │   Browse practitioners   │                         │
  ├─────────────────────────>│  GET /practitioners     │
  │                          ├────────────────────────>│
  │   Display list           │<────────────────────────┤
  │<─────────────────────────┤                         │
  │                          │                         │
  │   Select & book          │                         │
  ├─────────────────────────>│  POST /sessions         │
  │                          ├────────────────────────>│
  │                          │  Create notification    │
  │                          ├────────────────────────>│
  │   Booking confirmed      │<────────────────────────┤
  │<─────────────────────────┤                         │
```

---

## Security Architecture

### JWT Token Flow

```
1. User Login
   ↓
2. Validate Credentials
   ↓
3. Generate Access Token (24h) + Refresh Token (7d)
   ↓
4. Return tokens to client
   ↓
5. Client stores tokens
   ↓
6. Client sends token in Authorization header
   ↓
7. JwtAuthenticationFilter validates token
   ↓
8. Set SecurityContext with user details
   ↓
9. Allow access to protected resources
```

### Security Layers

```
┌────────────────────────────────────┐
│   CORS Filter                       │  ← Validate origin
├────────────────────────────────────┤
│   JWT Authentication Filter         │  ← Validate token
├────────────────────────────────────┤
│   Spring Security Filter Chain      │  ← Authorize access
├────────────────────────────────────┤
│   Method Security                   │  ← Role-based access
├────────────────────────────────────┤
│   Business Logic Layer              │  ← Input validation
└────────────────────────────────────┘
```

---

## Module Architecture

### Module A: Practitioner Onboarding
```
Register as Practitioner
    ↓
Create Profile (specialization)
    ↓
Admin Verification
    ↓
Verified Badge + Rating System
```

### Module B: Therapy Booking
```
Browse Practitioners
    ↓
Select Date/Time
    ↓
Book Session
    ↓
Track Status (booked → completed)
```

### Module C: Product Marketplace
```
Browse Products (by category)
    ↓
Select Product
    ↓
Place Order
    ↓
Track Order Status
```

### Module D: Community Forum
```
Ask Question
    ↓
Practitioners Answer
    ↓
Leave Reviews & Ratings
```

### Module E: AI Recommendations
```
Enter Symptoms
    ↓
AI Engine Analysis
    ↓
Suggest Therapy Type
    ↓
Store Recommendation
```

### Module F: Notifications
```
Event Occurs (booking, order, etc.)
    ↓
Create Notification
    ↓
Push to User
    ↓
Mark as Read/Unread
```

---

## Deployment Architecture

### Docker Deployment

```
┌─────────────────────────────────────────┐
│         Docker Compose                   │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────┐  ┌─────────────────┐│
│  │   Frontend    │  │    Backend      ││
│  │   Container   │  │    Container    ││
│  │   (Node:18)   │  │   (Java 17)     ││
│  │   Port 3000   │  │   Port 8080     ││
│  └───────┬───────┘  └────────┬────────┘│
│          │                   │          │
│          └─────────┬─────────┘          │
│                    │                    │
│          ┌─────────▼────────┐           │
│          │   MySQL          │           │
│          │   Container      │           │
│          │   (MySQL:8.0)    │           │
│          │   Port 3306      │           │
│          └──────────────────┘           │
│                                          │
│  Volume: mysql-data (persistent)        │
└─────────────────────────────────────────┘
```

---

## Data Flow Examples

### User Registration
```
Form Input → Validation → Password Hashing → Save to DB → 
Generate JWT → Return Token → Store in LocalStorage → 
Redirect to Dashboard
```

### Place Order
```
Select Product → Check Stock → Create Order → 
Reduce Stock → Update DB → Create Notification → 
Return Order Confirmation → Update UI
```

### AI Recommendation
```
Enter Symptom → Match Pattern → Select Therapy → 
Save Recommendation → Return Suggestion → Display on Dashboard
```

---

## File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| Backend Java Files | 49 | Controllers, Services, Models, etc. |
| Frontend React Files | 14 | Pages, Components, Services |
| Configuration Files | 9 | pom.xml, package.json, Docker, etc. |
| Documentation Files | 5 | README, API, Docker, Quick Start, Summary |
| **Total Files** | **77** | **Complete Application** |

---

## API Endpoint Summary

| Category | Endpoints | Authentication Required |
|----------|-----------|------------------------|
| Authentication | 2 | No |
| Practitioners | 7 | Some |
| Sessions | 5 | Yes |
| Products | 6 | Some |
| Orders | 3 | Yes |
| Reviews | 4 | Some |
| Community | 4 | Some |
| Recommendations | 2 | Yes |
| Notifications | 3 | Yes |
| **Total** | **36** | - |

---

This architecture provides:
✅ Scalability
✅ Maintainability
✅ Security
✅ Separation of Concerns
✅ Easy Testing
✅ Clear Data Flow
✅ Production Ready
