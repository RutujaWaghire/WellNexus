# Wellness Marketplace for Alternative Therapies

A full-stack wellness marketplace that connects users with verified alternative therapy providers across domains like physiotherapy, acupuncture, Ayurveda, and chiropractic care.

## Features

### Core Functionality
- ✅ User registration and JWT authentication
- ✅ Practitioner onboarding and verification system
- ✅ Therapy session booking and scheduling
- ✅ Product marketplace with cart management
- ✅ Community Q&A forum with reviews
- ✅ AI-powered therapy recommendations
- ✅ Real-time notifications
- ✅ Secure payment integration ready

### Tech Stack

**Backend:**
- Spring Boot 3.1.5 (Java 17)
- MySQL Database
- Spring Security with JWT
- Spring WebSocket for real-time messaging
- JPA/Hibernate for ORM

**Frontend:**
- React 18
- Tailwind CSS
- React Router v6
- Axios for API calls
- Vite build tool

## Project Structure

```
├── backend/
│   ├── src/main/java/com/wellness/marketplace/
│   │   ├── config/         # Security, CORS, WebSocket configs
│   │   ├── controller/     # REST API endpoints
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── model/         # JPA Entities
│   │   ├── repository/    # Spring Data repositories
│   │   ├── security/      # JWT utilities and filters
│   │   └── service/       # Business logic layer
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── context/       # Auth context
    │   ├── pages/         # Page components
    │   ├── services/      # API service layer
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Database Schema

The application uses 10 main entities:
1. **User** - User accounts (patients and practitioners)
2. **PractitionerProfile** - Extended practitioner information
3. **TherapySession** - Scheduled therapy sessions
4. **Product** - Wellness products for sale
5. **Order** - Product orders
6. **Review** - Practitioner reviews and ratings
7. **Question** - Community forum questions
8. **Answer** - Answers to community questions
9. **Recommendation** - AI-generated therapy recommendations
10. **Notification** - User notifications

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8.0+

### Backend Setup

1. **Install MySQL and create database:**
```bash
mysql -u root -p
CREATE DATABASE wellness_marketplace;
```

2. **Configure database connection:**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/wellness_marketplace
spring.datasource.username=root
spring.datasource.password=your_password
```

3. **Build and run backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Run development server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Practitioners
- `GET /api/practitioners` - Get all practitioners
- `GET /api/practitioners/verified` - Get verified practitioners
- `POST /api/practitioners` - Create practitioner profile
- `PUT /api/practitioners/{id}/verify` - Verify practitioner

### Sessions
- `POST /api/sessions` - Book therapy session
- `GET /api/sessions/user/{userId}` - Get user sessions
- `GET /api/sessions/practitioner/{practitionerId}` - Get practitioner sessions

### Products
- `GET /api/products` - Get all products
- `GET /api/products/available` - Get available products
- `POST /api/products` - Create product (admin)

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders/user/{userId}` - Get user orders

### Community
- `GET /api/community/questions` - Get all questions
- `POST /api/community/questions` - Ask question
- `POST /api/community/answers` - Post answer

### Recommendations
- `POST /api/recommendations` - Generate AI recommendation
- `GET /api/recommendations/user/{userId}` - Get user recommendations

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/practitioner/{practitionerId}` - Get practitioner reviews

## Usage

1. **Register an account** - Choose between patient or practitioner role
2. **Browse practitioners** - Filter by specialization or verified status
3. **Book sessions** - Schedule appointments with practitioners
4. **Shop products** - Browse and purchase wellness products
5. **Get recommendations** - Input symptoms to receive AI-powered therapy suggestions
6. **Engage with community** - Ask questions and get expert answers

## Features by Module

### Module A: Practitioner Onboarding
- Registration with specialization
- Verification system
- Profile management with ratings

### Module B: Therapy Session Booking
- Session scheduling with calendar
- Status tracking (booked/completed)
- Session notes and feedback

### Module C: Product Marketplace
- Product listing by category
- Stock management
- Order processing

### Module D: Community Forum
- Q&A system
- Review and rating system
- Answer threading

### Module E: AI Recommendations
- Symptom-based therapy suggestions
- Recommendation history tracking
- Multiple therapy type support

### Module F: Notifications
- Real-time notification system
- Read/unread status tracking
- Multiple notification types

## Security

- JWT-based authentication with access and refresh tokens
- Password encryption using BCrypt
- CORS configuration for frontend-backend communication
- Protected routes requiring authentication
- Role-based access control (patient/practitioner)

## Development

### Building for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/marketplace-1.0.0.jar

or

cd backend
mvn clean install   -- one time whenever there is change in the code
mvn spring-boot:run -- to start the back end server -- always
```

**Frontend:**
```bash
cd frontend
npm install     -- one time whenever there is change in the code
npm run build   -- one time whenever there is change in the code
npm run dev     -- to start the front end server -- always
# Serve the dist/ folder with any static server
```

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Google Maps integration for practitioner locations
- Email notification system
- Advanced search and filtering
- Mobile app development
- Integration with OpenFDA, WHO APIs
- Enhanced AI recommendation engine
- Video consultation support

## License

This project is created for educational purposes.

## Contributors

Wellness Marketplace Development Team