# API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "bio": "Optional bio"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "type": "Bearer",
  "userId": 1,
  "email": "john@example.com",
  "role": "patient"
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

---

## Practitioner Endpoints

### Get All Practitioners
**GET** `/practitioners`

**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "specialization": "Physiotherapy",
    "verified": true,
    "rating": 4.8
  }
]
```

### Get Verified Practitioners
**GET** `/practitioners/verified`

### Get Practitioner by User ID
**GET** `/practitioners/user/{userId}`

### Get Practitioners by Specialization
**GET** `/practitioners/specialization/{specialization}`

Example: `/practitioners/specialization/Physiotherapy`

### Create Practitioner Profile
**POST** `/practitioners` 🔒

**Request Body:**
```json
{
  "userId": 2,
  "specialization": "Acupuncture",
  "verified": false,
  "rating": 0.0
}
```

### Verify Practitioner
**PUT** `/practitioners/{id}/verify` 🔒

### Update Rating
**PUT** `/practitioners/{id}/rating?rating=4.5` 🔒

---

## Therapy Session Endpoints

### Book Session
**POST** `/sessions` 🔒

**Request Body:**
```json
{
  "practitionerId": 1,
  "userId": 2,
  "date": "2024-01-20T10:00:00"
}
```

**Response:**
```json
{
  "id": 1,
  "practitionerId": 1,
  "userId": 2,
  "date": "2024-01-20T10:00:00",
  "status": "booked",
  "notes": null
}
```

### Get User Sessions
**GET** `/sessions/user/{userId}` 🔒

### Get Practitioner Sessions
**GET** `/sessions/practitioner/{practitionerId}` 🔒

### Update Session Status
**PUT** `/sessions/{id}/status?status=completed` 🔒

### Add Session Notes
**PUT** `/sessions/{id}/notes` 🔒

**Request Body:** String with notes

---

## Product Endpoints

### Get All Products
**GET** `/products`

### Get Product by ID
**GET** `/products/{id}`

### Get Products by Category
**GET** `/products/category/{category}`

Example: `/products/category/Equipment`

### Get Available Products
**GET** `/products/available`

Returns products with stock > 0

### Create Product
**POST** `/products` 🔒

**Request Body:**
```json
{
  "name": "Yoga Mat",
  "description": "High-quality yoga mat",
  "price": 49.99,
  "category": "Equipment",
  "stock": 50
}
```

### Update Stock
**PUT** `/products/{id}/stock?stock=30` 🔒

---

## Order Endpoints

### Create Order
**POST** `/orders` 🔒

**Request Body:**
```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "quantity": 2,
  "totalAmount": 99.98,
  "orderDate": "2024-01-15T14:30:00",
  "status": "pending"
}
```

### Get User Orders
**GET** `/orders/user/{userId}` 🔒

### Update Order Status
**PUT** `/orders/{id}/status?status=completed` 🔒

---

## Review Endpoints

### Create Review
**POST** `/reviews` 🔒

**Request Body:**
```json
{
  "userId": 1,
  "practitionerId": 2,
  "rating": 5,
  "comment": "Excellent service!"
}
```

### Get Practitioner Reviews
**GET** `/reviews/practitioner/{practitionerId}`

### Get User Reviews
**GET** `/reviews/user/{userId}` 🔒

### Get Average Rating
**GET** `/reviews/practitioner/{practitionerId}/average`

**Response:**
```json
4.8
```

---

## Community Forum Endpoints

### Get All Questions
**GET** `/community/questions`

### Create Question
**POST** `/community/questions` 🔒

**Request Body:**
```json
{
  "userId": 1,
  "content": "What are the benefits of acupuncture?"
}
```

### Create Answer
**POST** `/community/answers` 🔒

**Request Body:**
```json
{
  "questionId": 1,
  "practitionerId": 2,
  "content": "Acupuncture has many benefits including..."
}
```

### Get Question Answers
**GET** `/community/questions/{questionId}/answers`

---

## Recommendation Endpoints

### Generate Recommendation
**POST** `/recommendations` 🔒

**Request Body:**
```json
{
  "userId": 1,
  "symptom": "back pain"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "symptom": "back pain",
  "suggestedTherapy": "Chiropractic",
  "sourceAPI": "AI_ENGINE",
  "timestamp": "2024-01-15T14:30:00"
}
```

**Supported Symptoms:**
- "back pain" → Chiropractic
- "stress" → Acupuncture
- "anxiety" → Ayurveda
- "muscle pain" → Physiotherapy
- "headache" → Acupuncture
- "joint pain" → Physiotherapy
- "insomnia" → Ayurveda
- "digestive issues" → Ayurveda

### Get User Recommendations
**GET** `/recommendations/user/{userId}` 🔒

---

## Notification Endpoints

### Get User Notifications
**GET** `/notifications/user/{userId}` 🔒

### Get Unread Notifications
**GET** `/notifications/user/{userId}/unread` 🔒

### Mark as Read
**PUT** `/notifications/{id}/read` 🔒

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Authentication Flow

1. **Register or Login** to get JWT token
2. **Store token** in localStorage or secure storage
3. **Send token** in Authorization header for protected endpoints
4. **Refresh token** when it expires (24 hours default)

Example with curl:
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Use token for protected endpoint
curl http://localhost:8080/api/sessions/user/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Rate limiting per IP
- Rate limiting per user
- Request throttling

---

## Pagination

Currently, all list endpoints return complete results. For large datasets, consider implementing pagination:

Example future implementation:
```
GET /api/products?page=0&size=10&sort=name,asc
```

---

## Testing Tips

### Postman Collection
Import the endpoints into Postman for easy testing.

### Sample Test Flow
1. Register as patient
2. Register as practitioner
3. Create practitioner profile
4. Browse practitioners
5. Book a session
6. Browse products
7. Place an order
8. Leave a review
9. Ask a question
10. Get AI recommendation

🔒 = Requires authentication
