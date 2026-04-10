import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getInitialUser = () => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
            localStorage.removeItem('user');
            return null;
        }
    };

    const [user, setUser] = useState(getInitialUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verify token on load or just end loading
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data.data);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data));
        return data.data;
    };

    const register = async (name, email, password, role) => {
        await api.post('/auth/register', { name, email, password, role });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
