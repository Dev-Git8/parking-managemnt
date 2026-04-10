# Parking Management System

A full-stack web application for managing parking bookings, built with React frontend and Node.js/Express backend.

## Features

- User authentication and authorization
- Business registration and management
- Parking slot management
- Booking system for parking slots
- Admin dashboard for oversight
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, SQLite
- **Authentication**: JWT
- **Deployment**: Ready for deployment on platforms like Vercel/Netlify (frontend) and Heroku/Railway (backend)

## Project Structure

```
parking-managemnt/
├── Backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── middlewares/     # Auth and error handling
│   │   ├── modules/         # Feature modules (auth, bookings, etc.)
│   │   └── utils/           # JWT utilities
│   ├── package.json
│   ├── schema.sql           # Database schema
│   └── .env.example         # Environment variables template
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── context/         # React contexts
│   │   └── api/             # API client
│   ├── package.json
│   └── vite.config.js
├── package.json             # Root package.json (if needed)
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SQLite (or any SQL database compatible with the schema)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dev-Git8/parking-managemnt.git
   cd parking-managemnt
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   # Copy environment variables
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Setup:**
   - Create a SQLite database
   - Run the SQL commands from `Backend/schema.sql` to set up tables

### Running the Application

1. **Start the Backend:**
   ```bash
   cd Backend
   npm run dev
   ```
   The backend will run on http://localhost:3000 (or configured port)

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. **Access the Application:**
   Open http://localhost:5173 in your browser

## API Endpoints

The backend provides RESTful APIs for:
- Authentication (`/auth`)
- User management (`/users`)
- Business management (`/business`)
- Slot management (`/slots`)
- Bookings (`/bookings`)
- Admin functions (`/admin`)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub.