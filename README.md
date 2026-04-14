# Park-Ease: Modern Parking Management System

[![Production-Ready](https://img.shields.io/badge/status-production--ready-success)](https://github.com/Dev-Git8/Park-Ease)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Park-Ease** is a high-performance, real-time parking management platform built with security and scalability at its core. It features a robust authentication system, live slot synchronization via WebSockets, and automated occupancy management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **State & Context**: React Context API
- **Styling**: Vanilla CSS (Premium Micro-animations)
- **Communication**: Axios, Socket.io-client

### Backend
- **Runtime**: Node.js (Express.js)
- **Database**: PostgreSQL (Dockerized)
- **Real-time**: Socket.io
- **Caching**: Redis (Dockerized)
- **Authentication**: JWT (Stateless with HttpOnly Cookies)
- **Scheduling**: Node-cron based Background Workers
- **Cloud Media**: Cloudinary (Image Uploads)

---

## 🏗️ Infrastructure: The Docker Advantage

Park-Ease uses **Docker Containerization** to provide a consistent development environment. By using `docker-compose`, we ensure that the entire infrastructure (Database + Cache) is portable and ready for production.

- **Orchestration**: Managed via `docker-compose.yml`.
- **Persistence**: Data is persisted on the host machine using Docker Volumes.
- **Portability**: New developers can be up and running with a single command without installing Postgres or Redis manually.

---

## 🛡️ Security Architecture: In-Memory Token Flow

To prevent **XSS (Cross-Site Scripting)** and **CSRF (Cross-Site Request Forgery)**, Park-Ease implements a hybrid authentication strategy:

1.  **Strictly In-Memory Access Tokens**: The `accessToken` is stored only in a JavaScript variable. It is never written to `localStorage` or `sessionStorage`.
2.  **HttpOnly Refresh Cookies**: The `refreshToken` is stored in a `Secure`, `HttpOnly`, `SameSite=Strict` cookie.
3.  **Automatic Session Restoration**: On application load, the system automatically attempts a `/refresh` call to restore the user session.
4.  **Concurrency-Aware Refresh Queue**: Custom Axios interceptors ensure that only one refresh call is sent if multiple requests expire simultaneously.

---

## 🚦 Key Features

- **Live Slot Status**: Real-time updates of parking slot availability across all users using WebSockets.
- **Micro-Reservations**: Support for minute-based booking durations with automatic expiry logic.
- **Role-Based Access (RBAC)**: Distinct workflows for **Customers**, **Business Owners**, and **System Admins**.
- **Automated Expire Scheduler**: A background service that releases slots back to the public pool immediately upon booking expiration.
- **Provider Dashboard**: Analytics and management tools for parking business owners.

---

## 📋 API Reference

### 🔐 Authentication (`/api/auth`)
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/register` | POST | Register a new user | Public |
| `/login` | POST | Login and receive memory token + cookie | Public |
| `/refresh` | POST | Get a new access token via refresh cookie | Public |
| `/logout` | POST | Clear tokens and session | Private |

### 🏢 Business Management (`/api/business`)
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/register` | POST | Register a new parking business | User |
| `/mine` | GET | Get business details for current logged-in user | Business Owner |

### 🅿️ Slots (`/api/slots`)
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | GET | List all available parking slots | Public |
| `/` | POST | Create a new parking slot | Business Owner |

---

## ⚙️ Environment Variables

### Backend (`/Backend/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:root@localhost:5432/ParkingDB
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
CLOUDINARY_URL=your_cloudinary_url
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- **Docker Desktop** (Essential for Infra)

### Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Dev-Git8/Park-Ease.git
   cd Park-Ease
   ```

2. **Start Infrastructure (Databases)**
   ```bash
   cd Backend
   docker-compose up -d
   ```

3. **Backend Configuration**
   ```bash
   # Inside /Backend
   npm install
   # Create .env with the values from the Environment Variables section above
   npm run dev
   ```

4. **Frontend Configuration**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🚧 Roadmap
- [ ] Integration with Stripe for automated payments
- [ ] Google Maps API for location-based slot searching
- [ ] Native Mobile App (React Native)
- [ ] AI-based dynamic pricing for peak hours

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Maintained by**: [Dev-Git8](https://github.com/Dev-Git8)
 by**: [Dev-Git8](https://github.com/Dev-Git8)