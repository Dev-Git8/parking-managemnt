-- Database Schema for Parking Management System

-- Drop tables if they exist (Be careful with this in production!)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'business', 'admin')) NOT NULL,
    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Businesses table
CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    total_slots INTEGER NOT NULL DEFAULT 0,
    price_per_hour DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Slots table
CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    slot_number VARCHAR(10) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE(business_id, slot_number)
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    slot_id INTEGER REFERENCES slots(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    total_price DECIMAL(10, 2) NOT NULL,
    penalty_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('booked', 'cancelled', 'overdue', 'completed')) DEFAULT 'booked',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_slots_business ON slots(business_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_slot ON bookings(slot_id);
