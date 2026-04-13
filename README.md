# Park-Ease: Modern Parking Management System

Park-Ease is a high-performance, secure, and real-time full-stack web application designed for managing parking bookings. Built with a focus on security and user experience, it leverage modern web technologies to provide instant updates and robust authentication.

## ✨ Key Features

- **🛡️ Production-Grade Security**: 
    - **In-Memory Access Tokens**: Mitigates XSS by never storing access tokens in localStorage or persistent cookies.
    - **HttpOnly Refresh Tokens**: Secure session management using server-side cookies.
    - **Axios Concurrency Queue**: Robust interceptors that handle simultaneous token refreshes without race conditions.
- **⚡ Real-Time Live Updates**: 
    - Powered by **Socket.io** for instant synchronization of parking slot availability across all connected clients.
- **🕒 Automated Booking Lifecycle**: 
    - Background scheduler releases expired parking slots automatically.
    - Minute-based flexible durations for bookings.
- **📊 Business & Admin Dashboards**: 
    - Comprehensive interfaces for parking providers and system administrators.
- **📱 Responsive Design**: 
    - Fully optimized for all devices using **Tailwind CSS**.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, Socket.io-client
- **Backend**: Node.js, Express.js, SQLite (Prisma ORM)
- **Real-time & Performance**: Socket.io, Redis (for caching and synchronization)
- **Task Scheduling**: Node-cron / Background Workers

## 📂 Project Structure

```
Park-Ease/
├── Backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Database, Redis & Socket.io config
│   │   ├── middlewares/     # Auth (Cookie-based) & Error handling
│   │   ├── modules/         # Feature modules (Auth, Bookings, Slots, Business)
│   │   ├── services/        # Business logic & Background tasks
│   │   └── utils/           # JWT & Security utilities
│   └── .env.example         # Environment template
├── frontend/                # React frontend
│   ├── src/
│   │   ├── api/             # Axios instance with memory-store and interceptors
│   │   ├── context/         # Auth & Socket Contexts
│   │   ├── components/      # UI Components
│   │   └── pages/           # View layers
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js**: v18 or higher
- **Redis**: Required for real-time features and scheduling
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dev-Git8/Park-Ease.git
   cd Park-Ease
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Ensure PORT, REDIS_URL, and JWT_SECRET are set in .env
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run Redis:**
   Ensure your Redis server is running locally (default port 6379).

### Running the Application

1. **Start the Backend:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔐 Authentication Flow

Park-Ease uses a "Best-of-Both-Worlds" auth strategy:
1. **Access Token**: Stored in JavaScript memory. Lost on page refresh but recovered via the refresh token.
2. **Refresh Token**: Stored in a `Secure`, `HttpOnly`, `SameSite=Strict` cookie.
3. **Recovery**: On app load, the frontend calls `/auth/refresh`. If the cookie is valid, a new access token is issued and the session is restored seamlessly.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.