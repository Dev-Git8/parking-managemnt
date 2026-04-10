import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import BusinessDetails from './pages/Home/BusinessDetails';
import BookingSuccess from './pages/BookingSuccess/BookingSuccess';
import AdminDashboard from './pages/Admin/AdminDashboard';
import BusinessDashboard from './pages/Dashboard/BusinessDashboard';
import About from './pages/About/About';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

function AppContent() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/business/:id" element={<BusinessDetails />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/about" element={<About />} />
                
                {/* Customer Routes */}
                <Route path="/profile" element={
                    <ProtectedRoute roles={['customer']}>
                        <Profile />
                    </ProtectedRoute>
                } />

                {/* Business Owner Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute roles={['business']}>
                        <BusinessDashboard />
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute roles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
