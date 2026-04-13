# Park-Ease: Modern Parking Management System

[![Production-Ready](https://img.shields.io/badge/status-production--ready-success)](https://github.com/Dev-Git8/Park-Ease)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Park-Ease** is a high-performance, real-time parking management platform built with security and scalability at its core. It features a robust authentication system, live slot synchronization via WebSockets, and automated occupancy management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **State & Context**: React Context API
- **Styling**: Tailwind CSS
- **Communication**: Axios (with custom concurrency-aware interceptors), Socket.io-client

### Backend
- **Runtime**: Node.js (Express.js)
- **Database**: PostgreSQL / SQLite (via Prisma ORM)
- **Real-time**: Socket.io
- **Caching**: Redis
- **Authentication**: JWT (Stateless with HttpOnly Cookies)
- **Scheduling**: Node-cron based Background Workers

---

## 🛡️ Security Architecture: In-Memory Token Flow

To prevent **XSS (Cross-Site Scripting)** and **CSRF (Cross-Site Request Forgery)**, Park-Ease implements a hybrid authentication strategy:

1.  **Strictly In-Memory Access Tokens**: The `accessToken` is stored only in a JavaScript variable. It is never written to `localStorage` or `sessionStorage`.
2.  **HttpOnly Refresh Cookies**: The `refreshToken` is stored in a `Secure`, `HttpOnly`, `SameSite=Strict` cookie. It is inaccessible to client-side scripts.
3.  **Automatic Session Restoration**: On application load, the system automatically attempts a `/refresh` call to restore the user session seamlessly.
4.  **Concurrency-Aware Refresh Queue**: Custom Axios interceptors ensure that if multiple protected requests expire at once, only ONE refresh call is sent to the server, while others wait in a queue to be retried with the new token.

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
| `/:id` | GET | Get details of a specific slot | Public |
| `/business/:id` | GET | Get all slots for a specific business | Public |

### 📅 Bookings (`/api/bookings`)
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | POST | Create a new parking booking | Customer |
| `/customer/:id` | GET | View booking history for a customer | Customer/Admin |
| `/business/:id` | GET | View all bookings for a parking provider | Business/Admin |
| `/:id/cancel` | PUT | Cancel an active booking | Customer/Business |

### 👑 Admin (`/api/admin`)
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/users` | GET | List all platform users | Admin |
| `/businesses` | GET | List all registered businesses | Admin |
| `/businesses/:id/status`| PUT | Approve or Reject a parking provider | Admin |

---

## ⚙️ Environment Variables

### Backend (`/Backend/.env`)
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Redis Server (Running on port 6379)
- SQLite or PostgreSQL

### Setup
1. **Clone & Install**
   ```bash
   git clone https://github.com/Dev-Git8/Park-Ease.git
   cd Park-Ease
   ```
2. **Backend Configuration**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   npm run dev
   ```
3. **Frontend Configuration**
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