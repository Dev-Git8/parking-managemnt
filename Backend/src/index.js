const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const { errorMiddleware } = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Parking Management API is running' });
});

// Import Routes
const authRoutes = require('./modules/auth/auth.routes');
const businessRoutes = require('./modules/business/business.routes');
const slotsRoutes = require('./modules/slots/slots.routes');
const bookingsRoutes = require('./modules/bookings/bookings.routes');
const adminRoutes = require('./modules/admin/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
