# 🚌 EasyTrip - Bus Ticket Booking System

**Domain-Based Architecture (Feature-Sliced Architecture)**

```
NOTE: Please refer Documentation Folder to view API Documentation, ER Diagram, Mind Map,Requirement Document, Testing Related Documents. 
Angular_Bus_Ticket_Booking_JWT/
├── EasyTrip/                           # Frontend Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/                 # TypeScript Interfaces & Models
│   │   │   │   ├── booking.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── bus.model.ts
│   │   │   │   ├── schedule.model.ts
│   │   │   │   ├── driver.model.ts
│   │   │   │   ├── payment.model.ts
│   │   │   │   └── auth.model.ts
│   │   │   │
│   │   │   ├── admin/                  # Admin Portal (Lazy Loaded)
│   │   │   │   ├── admin.module.ts
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── bookingmanagement/
│   │   │   │   │   ├── bookingmanagement.component.ts
│   │   │   │   │   ├── bookingmanagement.component.html
│   │   │   │   │   └── bookingmanagement.component.css
│   │   │   │   ├── bus-management/
│   │   │   │   │   ├── bus-management.component.ts
│   │   │   │   │   ├── bus-management.component.html
│   │   │   │   │   └── bus-management.component.css
│   │   │   │   ├── contentmanagement/
│   │   │   │   │   ├── contentmanagement.component.ts
│   │   │   │   │   ├── contentmanagement.component.html
│   │   │   │   │   └── contentmanagement.component.css
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   ├── dashboard.component.html
│   │   │   │   │   └── dashboard.component.css
│   │   │   │   └── usermanagement/
│   │   │   │       ├── usermanagement.component.ts
│   │   │   │       ├── usermanagement.component.html
│   │   │   │       └── usermanagement.component.css
│   │   │   │
│   │   │   ├── user/                   # User Portal (Lazy Loaded)
│   │   │   │   ├── user.module.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   ├── dashboard.component.html
│   │   │   │   │   └── dashboard.component.css
│   │   │   │   ├── profile/
│   │   │   │   │   ├── profile.component.ts
│   │   │   │   │   ├── profile.component.html
│   │   │   │   │   └── profile.component.css
│   │   │   │   └── bookings/
│   │   │   │       ├── bookings.component.ts
│   │   │   │       ├── bookings.component.html
│   │   │   │       └── bookings.component.css
│   │   │   │
│   │   │   ├── website/                # Public Website Features
│   │   │   │   ├── shared/             # Shared Website Components
│   │   │   │   │   ├── header/
│   │   │   │   │   │   ├── header.component.ts
│   │   │   │   │   │   ├── header.component.html
│   │   │   │   │   │   └── header.component.css
│   │   │   │   │   └── footer/
│   │   │   │   │       ├── footer.component.ts
│   │   │   │   │       ├── footer.component.html
│   │   │   │   │       └── footer.component.css
│   │   │   │   ├── home/
│   │   │   │   │   ├── home.component.ts
│   │   │   │   │   ├── home.component.html
│   │   │   │   │   └── home.component.css
│   │   │   │   ├── availablebuses/
│   │   │   │   │   ├── availablebuses.component.ts
│   │   │   │   │   ├── availablebuses.component.html
│   │   │   │   │   └── availablebuses.component.css
│   │   │   │   ├── continuebooking/
│   │   │   │   │   ├── continuebooking.component.ts
│   │   │   │   │   ├── continuebooking.component.html
│   │   │   │   │   └── continuebooking.component.css
│   │   │   │   ├── payment/
│   │   │   │   │   ├── payment.component.ts
│   │   │   │   │   ├── payment.component.html
│   │   │   │   │   └── payment.component.css
│   │   │   │   └── trackticket/
│   │   │   │       ├── trackticket.component.ts
│   │   │   │       ├── trackticket.component.html
│   │   │   │       └── trackticket.component.css
│   │   │   │
│   │   │   ├── services/               # Business Logic Services
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── booking.service.ts
│   │   │   │   ├── bus-management.service.ts
│   │   │   │   ├── dashboard.service.ts
│   │   │   │   └── jwt-auth.service.ts # JWT Authentication Service
│   │   │   │
│   │   │   ├── guards/                 # Route Protection
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── jwt-auth.guard.ts   # JWT-based Guards
│   │   │   │
│   │   │   ├── interceptors/           # HTTP Interceptors
│   │   │   │   └── jwt-auth.interceptor.ts
│   │   │   │
│   │   │   ├── environments/           # Environment Configuration
│   │   │   │   ├── environment.ts
│   │   │   │   └── environment.prod.ts
│   │   │   │
│   │   │   ├── app.component.ts        # Root Component
│   │   │   ├── app.component.html
│   │   │   ├── app.config.ts          # App Configuration
│   │   │   ├── app.routes.ts          # Main Routing
│   │   │   ├── auth.guard.ts          # Legacy Auth Guard
│   │   │   └── backend.js             # Twilio OTP Service
│   │   │
│   │   ├── public/                     # Static Assets
│   │   │   ├── title_logo.png
│   │   │   └── Images/                 # UI Images & Assets
│   │   │       ├── admn_logo.png
│   │   │       ├── bus_logo_latest.jpg
│   │   │       ├── easy_trip_main_background.jpeg
│   │   │       └── [50+ destination & UI images]
│   │   │
│   │   ├── angular.json               # Angular CLI Configuration
│   │   ├── package.json               # Frontend Dependencies
│   │   ├── tsconfig.json             # TypeScript Configuration
│   │   └── README.md                 # Frontend Documentation
│   │
├── backend/                           # Node.js Backend API
│   ├── controllers/                   # Business Logic Controllers
│   │   ├── AuthController.js         # JWT Authentication Controller
│   │   ├── BookingController.js      # Booking Management
│   │   ├── BusController.js         # Bus Operations
│   │   ├── UserController.js        # User Management
│   │   ├── DriverController.js      # Driver Management
│   │   ├── ScheduleController.js    # Schedule Management
│   │   └── dashboardController.js   # Analytics & Dashboard
│   │
│   ├── models/                       # MongoDB Data Models
│   │   ├── BookingModel.js          # Booking Schema
│   │   ├── BusModel.js              # Bus Schema
│   │   ├── DriverModel.js           # Driver Schema
│   │   ├── ScheduleModel.js         # Schedule Schema
│   │   ├── UserModel.js             # User Schema
│   │   └── User.js                  # Legacy User Model
│   │
│   ├── routes/                       # API Route Definitions
│   │   ├── authRoutes.js            # JWT Authentication Routes
│   │   ├── BookingRoutes.js         # Booking API Routes
│   │   ├── busRoutes.js             # Bus Management Routes
│   │   ├── userRoutes.js            # User Management Routes
│   │   ├── driverRoutes.js          # Driver Management Routes
│   │   ├── scheduleRoutes.js        # Schedule Management Routes
│   │   └── dashboardRoutes.js       # Dashboard Analytics Routes
│   │
│   ├── middleware/                   # Express Middleware
│   │   └── authMiddleware.js        # JWT Authentication Middleware
│   │
│   ├── config/                       # Configuration Files
│   │   └── db.js                    # MongoDB Connection
│   │
│   ├── server.js                     # Express Server Entry Point
│   ├── package.json                  # Backend Dependencies
│   └── .env                         # Environment Variables
│
├── gateway/                          # Optional API Gateway
│   ├── index.js                     # Gateway Service
│   └── package.json                 # Gateway Dependencies
│
├── package.json                      # Root Project Configuration
├── JWT_AUTHENTICATION_README.md      # JWT Implementation Guide
├── JWT_INTEGRATION_GUIDE.ts         # Integration Documentation
├── PRESENTATION_GUIDE.md            # Project Presentation Guide
├── DEMO_SCRIPTS.md                  # Live Demo Scripts
├── mind-map.html                    # Interactive System Architecture
└── er-diagram.html                  # Database ER Diagram
```

**Commands to run:**
```bash
# Frontend
cd EasyTrip
npm install
ng serve --open

# Backend
cd backend
npm install
npm start

# MongoDB
mongod --dbpath /data/db
```

---

# 🚌 EasyTrip - Bus Ticket Booking System

An enterprise-level, full-featured **bus ticket booking platform** developed with **Angular 19** and **Node.js**, supporting **domain-based architecture** for scalability and maintainability. The application features comprehensive portals for different user types with **JWT authentication** and **real-time booking management**.

## Core Portals:
- 🌐 **Public Website** – for browsing, searching, and booking bus tickets
- 👤 **User Portal** – for managing bookings, profile, and travel history  
- 🛠️ **Admin Portal** – for complete platform management and analytics

The frontend communicates with the backend via **RESTful APIs** connected to a **MongoDB** database with **JWT-based authentication** using **HTTP-only cookies**.

---

## 📌 Table of Contents

- [🌐 Live Demo](#-live-demo)
- [✨ Features](#-features)
- [🗂️ Project Architecture](#-project-architecture)
- [⚙️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔐 Authentication System](#-authentication-system)
- [🧠 Architecture Highlights](#-architecture-highlights)
- [📊 Database Design](#-database-design)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [📄 License](#-license)

---

## 🌐 Live Demo

> **Frontend**: `http://localhost:4200`  
> **Backend**: `http://localhost:5000`  
> **MongoDB**: `mongodb://localhost:27017/bus_ticket_booking_db`

---

## ✨ Features

### 🌐 Public Website Portal

- **Responsive Design** with Tailwind CSS
- **Bus Search** by source, destination, and date
- **Real-time Seat Selection** with interactive seat map
- **OTP-based Authentication** for secure login
- **Route Visualization** with pickup/drop points
- **Fare Calculation** with dynamic pricing
- **Ticket Booking** with passenger details
- **Payment Integration** ready interface
- **Ticket Tracking** with booking ID and mobile number

### 👤 User Portal

- **Personal Dashboard** with booking statistics
- **Booking History** with detailed trip information
- **Profile Management** with emergency contacts
- **Travel Statistics** and spending analytics
- **Upcoming Bookings** with journey details
- **Ticket Download** and sharing options
- **Booking Modifications** and cancellations

### 🛠️ Admin Portal

- **Comprehensive Dashboard** with real-time analytics
- **User Management** with full CRUD operations
  - View all users with booking details
  - User statistics and spending analysis
  - Emergency contact management
- **Bus Management** with fleet operations
  - Add, update, delete buses
  - Bus capacity and amenities management
  - Real-time bus status tracking
- **Driver Management** system
  - Driver profiles and schedules
  - Availability and timing management
  - Performance tracking
- **Schedule Management**
  - Route creation and management
  - Timing and pricing configuration
  - Stop management with GPS coordinates
- **Booking Management**
  - Real-time booking monitoring
  - Revenue tracking and analysis
  - Passenger manifest generation
- **Content Management**
  - Website content updates
  - Promotional banner management
  - System announcements

---

## 🗂️ Project Architecture

### 🔹 Frontend Architecture (Angular 19)
```
EasyTrip/
├── Domain-Based Modules
│   ├── admin/           # Admin features (lazy-loaded)
│   ├── user/            # User portal (lazy-loaded)  
│   └── website/         # Public website features
├── Shared Services
│   ├── auth.service.ts
│   ├── jwt-auth.service.ts
│   └── [business services]
├── Guards & Interceptors
│   ├── auth.guard.ts
│   ├── jwt-auth.guard.ts
│   └── jwt-auth.interceptor.ts
└── Models & Interfaces
    ├── booking.model.ts
    ├── user.model.ts
    └── [domain models]
```

### 🔹 Backend Architecture (Node.js + Express)
```
backend/
├── MVC Pattern
│   ├── controllers/     # Business logic
│   ├── models/         # MongoDB schemas
│   └── routes/         # API endpoints
├── Middleware
│   └── authMiddleware.js # JWT authentication
├── Configuration
│   ├── db.js          # Database connection
│   └── server.js      # Express server
└── Authentication
    ├── JWT token generation
    ├── HTTP-only cookies
    └── Role-based access control
```

---

## ⚙️ Tech Stack

| **Frontend** | **Backend** | **Database** | **Authentication** |
|--------------|-------------|--------------|-------------------|
| Angular 19.2.15 | Node.js 18+ | MongoDB 6.0+ | JWT with HTTP-only cookies |
| TypeScript 5.7 | Express.js 5.1 | Mongoose ODM | OTP-based login |
| Tailwind CSS | RESTful APIs | MongoDB Compass | Role-based access control |
| Standalone Components | CORS enabled | Local/Atlas deployment | Secure session management |

| **Additional Tools** | **Development** | **Deployment** | **Testing** |
|---------------------|-----------------|----------------|-------------|
| Angular CLI | Hot reloading | Docker ready | Jasmine/Karma |
| npm/pnpm | Environment configs | PM2 process manager | Postman API testing |
| VS Code | Source maps | GitHub Actions ready | Unit & Integration tests |
| Git version control | Debug support | Cloud deployment ready | E2E testing setup |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**
- **MongoDB** 6.0+ (local or Atlas)
- **Angular CLI** 19+
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bus-ticket-booking-jwt.git
cd bus-ticket-booking-jwt
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start MongoDB (if running locally)
mongod --dbpath /data/db

# Start backend server
npm start
# Backend running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd EasyTrip
npm install

# Start development server
ng serve --open
# Frontend running on http://localhost:4200
```

### 4. Database Setup
- **Local MongoDB**: Ensure MongoDB is running on port 27017
- **MongoDB Atlas**: Update connection string in `.env`
- **Sample Data**: Use the booking system to create initial data

### 5. Access the Application
- **Public Website**: `http://localhost:4200`
- **Admin Portal**: `http://localhost:4200/admin` 
- **User Portal**: `http://localhost:4200/user`
- **API Documentation**: `http://localhost:5000/api/health`

---

## 🔐 Authentication System

### 🔹 Dual Authentication Strategy

**Current System (Active)**:
- **OTP-based authentication** with phone number verification
- **localStorage session management** for user state
- **Role-based access** (user/admin) with route protection

**JWT System (Ready for Integration)**:
- **HTTP-only cookie** authentication for enhanced security
- **Automatic token refresh** for seamless user experience
- **Comprehensive middleware** for API protection
- **Role-based authorization** with granular permissions

### 🔹 Security Features
✅ **HTTP-only cookies** prevent XSS attacks  
✅ **Secure flag** for HTTPS transmission  
✅ **SameSite protection** against CSRF  
✅ **Token expiration** and automatic refresh  
✅ **Role-based access control** (RBAC)  
✅ **OTP verification** for phone number validation  

### 🔹 Authentication Flow
```
1. User enters phone number
2. OTP generated and sent (simulated)
3. OTP verification and user lookup
4. Session creation (localStorage + optional JWT)
5. Role-based redirection (admin/user)
6. Protected route access based on role
```

---

## 🧠 Architecture Highlights

### 🔹 Domain-Driven Design
- **Modular architecture** with feature-based organization
- **Lazy loading** for optimal performance
- **Standalone components** for better tree-shaking
- **Separation of concerns** between domains

### 🔹 Scalable Backend Design
- **RESTful API** architecture
- **MongoDB** for flexible document storage
- **Mongoose ODM** for data modeling
- **Express middleware** for cross-cutting concerns

### 🔹 State Management
- **Service-based** state management with RxJS
- **Observable patterns** for reactive programming
- **localStorage backup** for session persistence
- **Real-time updates** across components

### 🔹 Performance Optimizations
- **Lazy loading** of feature modules
- **OnPush change detection** strategy
- **Optimized bundle size** with standalone components
- **Efficient API calls** with proper caching

---

## 📊 Database Design

### 🔹 Collections Structure
- **Users**: Customer profiles with booking history
- **Buses**: Fleet management with capacity and amenities
- **Drivers**: Driver profiles with availability schedules
- **Schedules**: Route timings with pricing information
- **Bookings**: Complete booking records with passengers

### 🔹 Key Relationships
- **User ↔ Bookings** (1:M) - User can have multiple bookings
- **Schedule ↔ Bookings** (1:M) - Schedule can have multiple bookings
- **Bus ↔ Schedules** (1:M) - Bus can have multiple schedules
- **Driver ↔ Schedules** (1:M) - Driver can operate multiple schedules

### 🔹 Data Features
- **Embedded documents** for related data (addresses, contacts)
- **Flexible schema** for evolving business requirements
- **Indexing strategy** for optimal query performance
- **Data validation** at both application and database levels

---

## 🧪 Testing

### Frontend Testing
```bash
cd EasyTrip
npm test              # Unit tests with Jasmine/Karma
npm run e2e           # End-to-end tests
npm run test:coverage # Test coverage report
```

### Backend Testing
```bash
cd backend
npm test              # API endpoint testing
npm run test:integration # Integration tests
```

### API Testing
- **Postman Collection** for comprehensive API testing
- **Authentication flow** testing with JWT tokens
- **CRUD operations** testing for all entities
- **Error handling** and edge case validation

---

## 📦 Deployment

### 🔹 Frontend Deployment
```bash
# Build for production
ng build --prod

# Deploy to platforms
# - Vercel/Netlify for static hosting
# - AWS S3 + CloudFront for enterprise
# - Docker containers for microservices
```

### 🔹 Backend Deployment
```bash
# Production build
npm run build

# Deploy options
# - Heroku for quick deployment
# - AWS EC2/ECS for scalable hosting
# - DigitalOcean Droplets for cost-effective hosting
# - Docker containers with orchestration
```

### 🔹 Database Deployment
- **MongoDB Atlas** for cloud hosting
- **AWS DocumentDB** for enterprise solutions
- **Local MongoDB** with replica sets for development

---


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Developed with ❤️ by [Your Name]**

- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]
- **Email**: [your.email@example.com]


**⭐ If you found this project helpful, please give it a star! ⭐**
